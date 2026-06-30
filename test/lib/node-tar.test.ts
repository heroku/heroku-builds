import {expect} from 'chai'
import {mkdtempSync} from 'node:fs'
import {tmpdir} from 'node:os'
import {join} from 'node:path'

import {nodeTar} from '../../src/lib/node-tar.js'

describe('node_tar', function () {
  it('compresses the folder', async function () {
    const file = join(mkdtempSync(join(tmpdir(), 'heroku-builds-')), 'test.tar.gz')
    await nodeTar(process.cwd() + '/test', file)
  })

  it('has an error', async function () {
    const file = join(mkdtempSync(join(tmpdir(), 'heroku-builds-')), 'test.tar.gz')
    try {
      await nodeTar('/dev/null', file)
      expect.fail('should have thrown')
    } catch (error: unknown) {
      expect(error).to.be.instanceOf(Error)
    }
  })
})
