import {APIClient, Command, flags} from '@heroku-cli/command'
import * as Heroku from '@heroku-cli/schema'
import {ux} from '@oclif/core'
import HTTP from '@heroku/http-call'
import {exec} from 'node:child_process'
import {randomUUID} from 'node:crypto'
import {createReadStream, statSync} from 'node:fs'
import {stat} from 'node:fs/promises'
import * as os from 'node:os'
import * as path from 'node:path'
import {promisify} from 'node:util'

import {nodeTar} from '../../lib/node-tar'

const execPromisified = promisify(exec)

async function compressSource(tar: string, includeVcsIgnore: boolean, dir: string, tempFile: string) {
  let tarVersion = ''
  try {
    const result = await execPromisified(tar + ' --version')
    tarVersion = result.stdout
  } catch (error) {
    const {message} = error as Error
    if (!/not found/.test(message)) {
      throw error
    }
  }

  if (/GNU tar/.test(tarVersion)) {
    let command = tar + ' cz -C ' + dir
    if (!includeVcsIgnore) {
      command += ' --exclude-vcs-ignores'
    }

    command += ' --exclude .git --exclude .gitmodules'
    command += ' .'
    await execPromisified(command + ' > ' + tempFile)
  } else {
    ux.warn('Couldn\'t detect GNU tar. Builds could fail due to decompression errors')
    ux.warn('See https://devcenter.heroku.com/articles/platform-api-deploying-slugs#create-slug-archive')
    ux.warn('Please install it, or specify the \'--tar\' option')
    ux.warn('Falling back to node\'s built-in compressor')
    await nodeTar(dir, tempFile)
  }
}

async function uploadDirToSource(tar: string | undefined, includeVcsIgnore: boolean, heroku: APIClient, tarPath: string) {
  let filePath
  const tarPathStat = await stat(tarPath)
  if (tarPathStat.isDirectory()) {
    filePath = path.join(os.tmpdir(), randomUUID() + '.tar.gz')
    await compressSource((tar ?? 'tar'), includeVcsIgnore, tarPath, filePath)
  } else {
    filePath = tarPath
  }

  const {body: source} = await heroku.post<Required<Heroku.Source>>('/sources')

  await HTTP.put(source.source_blob.put_url as string, {
    body: createReadStream(filePath),
    headers: {
      'Content-Type': '',
      'Content-Length': statSync(filePath).size,
    }
  })
  return source.source_blob.get_url
}

export default class Create extends Command {
  static description = 'create build\nCreate build from contents of current dir'
  static flags = {
    'source-tar': flags.string({description: 'local path to source to the tarball of your application\'s source code'}),
    'source-url': flags.string({description: 'source URL that points to the tarball of your application\'s source code'}),
    dir: flags.string({description: 'the local path to build. Defaults to the current working directory'}),
    tar: flags.string({description: 'path to the executable GNU tar'}),
    version: flags.string({description: 'description of your new build'}),
    'include-vcs-ignore': flags.boolean({description: 'include files ignored by VCS (.gitignore, ...) from the build'}),
    app: flags.app({required: true}),
    remote: flags.remote(),
  }

  static topic = 'builds'

  public async run(): Promise<void> {
    const {flags} = await this.parse(Create)
    const {
      app,
      dir = process.cwd(),
      tar,
      'include-vs-ignore': includeVcsIgnore,
      'source-tar': sourceTar,
      'source-url': sourceUrl,
      version,
    } = flags
    let targetSourceUrl = sourceUrl
    if (sourceTar) {
      targetSourceUrl = await uploadDirToSource(tar, includeVcsIgnore, this.heroku, sourceTar)
    } else if (!sourceUrl) {
      targetSourceUrl = await uploadDirToSource(tar, includeVcsIgnore, this.heroku, dir)
    }

    const {body: newBuild} = await this.heroku.post<Required<Heroku.Build>>(`/apps/${app}/builds`, {
      body: {
        source_blob: {
          url: targetSourceUrl,
          version: version || '',
        },
      },
    })
    const {response: stream} = await this.heroku.stream(newBuild.output_stream_url)
    await new Promise((resolve, reject) => {
      stream.on('error', reject)
      stream.on('end', resolve)
      stream.pipe(process.stderr)
    })
    const {body: build} = await this.heroku.get<Heroku.Build>(`/apps/${app}/builds/${newBuild.id}`)
    if (build.status === 'failed') {
      ux.error('Build failed', {exit: 1})
    }
  }
}
