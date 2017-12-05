'use strict'

let cli = require('heroku-cli-util')
let fs = require('fs')
let uuid = require('node-uuid')
let os = require('os')
let path = require('path')
let exec = require('child_process').execSync
let nodeTar = require('../../lib/node_tar')

function compressSource (context, dir, tempFile) {
  return new Promise(function (resolve, reject) {
    var tar = context.flags['tar'] || 'tar'
    let tarVersion = ''

    try {
      tarVersion = exec(tar + ' --version').toString()
    } catch (err) {
      if (err.toString().match(/not found/)) {
        // tar was not found on the system
      } else {
        throw err
      }
    }

    if (tarVersion.match(/GNU tar/)) {
      let includeVcsIgnore = context.flags['include-vcs-ignore']
      let command = tar + ' cz -C ' + dir + ' --exclude .git --exclude .gitmodules .'

      if (!includeVcsIgnore) {
        command += ' --exclude-vcs-ignores'
      }

      exec(command + ' > ' + tempFile)
      resolve()
    } else {
      cli.warn('Couldn\'t detect GNU tar. Builds could fail due to decompression errors')
      cli.warn('See https://devcenter.heroku.com/articles/platform-api-deploying-slugs#create-slug-archive')
      cli.warn('Please install it, or specify the \'--tar\' option')
      cli.warn('Falling back to node\'s built-in compressor')
      nodeTar.call(dir, tempFile).then(resolve, reject)
    }
  })
}

async function uploadDirToSource (context, heroku, tarPath) {
  let filePath

  if (fs.statSync(tarPath).isDirectory()) {
    filePath = path.join(os.tmpdir(), uuid.v4() + '.tar.gz')
    await compressSource(context, tarPath, filePath)
  } else {
    filePath = tarPath
  }

  let source = await heroku.post('/sources')

  await cli.got.put(source.source_blob.put_url, {
    body: fs.createReadStream(filePath),
    headers: {
      'Content-Type': '',
      'Content-Length': fs.statSync(filePath).size
    }
  })
  return source.source_blob.get_url
}

async function create (context, heroku) {
  let sourceUrl = context.flags['source-url']
  let sourceTar = context.flags['source-tar']
  let dir = context.flags.dir || process.cwd()

  if (sourceTar) {
    sourceUrl = await uploadDirToSource(context, heroku, sourceTar)
  } else if (!sourceUrl) {
    sourceUrl = await uploadDirToSource(context, heroku, dir)
  }

  let build = await heroku.post(`/apps/${context.app}/builds`, {
    body: {
      source_blob: {
        url: sourceUrl,
        // TODO: look at heroku/heroku-cli-builds to see how to get the md5
        version: context.flags.version || ''
      }
    }
  })

  return new Promise((resolve, reject) => {
    let stream = cli.got.stream(build.output_stream_url)
    stream.on('error', reject)
    stream.on('end', resolve)
    stream.pipe(process.stderr)
  })
}

module.exports = {
  topic: 'builds',
  command: 'create',
  needsAuth: true,
  needsApp: true,
  help: 'Create build from contents of current dir',
  description: 'create build',
  flags: [
    { name: 'source-tar', description: 'local path to source to the tarball of your application\'s source code', hasValue: true },
    { name: 'source-url', description: 'source URL that points to the tarball of your application\'s source code', hasValue: true },
    { name: 'dir', description: 'the local path to build. Defaults to the current working directory', hasValue: true },
    { name: 'tar', description: 'path to the executable GNU tar', hasValue: true },
    { name: 'version', description: 'description of your new build', hasValue: true },
    { name: 'include-vcs-ignore', description: 'include files ignores by VCS (.gitignore, ...) from the build' }
  ],
  run: cli.command(create)
}
