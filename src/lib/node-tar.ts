import ignoreModule from 'ignore'
import * as fs from 'node:fs'
import {readdir} from 'node:fs/promises'
import * as os from 'node:os'
import {create} from 'tar'

const ignore = ignoreModule.default ?? ignoreModule

export async function nodeTar(cwd: string, file: string): Promise<void> {
  let ig = ignore()
  if (fs.existsSync('./.gitignore')) {
    ig = ig.add(fs.readFileSync('./.gitignore').toString())
  }

  const filter = ig.createFilter()
  const files = await readdir(cwd)
  await create({
    cwd,
    file,
    filter,
    gzip: true,
    mode: os.platform() === 'win32' ? 0o0755 : 0o666,
  }, files)
}
