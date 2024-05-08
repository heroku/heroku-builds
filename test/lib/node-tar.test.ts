import {expect} from '@oclif/test'
import * as tmp from 'tmp'

import {nodeTar} from '../../src/lib/node-tar'

describe('node_tar', () => {
  it('compresses the folder', () => {
    const file = tmp.fileSync()
    return expect(nodeTar(process.cwd() + '/test', file.name), 'to be fulfilled')
  })

  it('has an error', () => {
    const file = tmp.fileSync()
    return expect(nodeTar('/dev/null', file.name), 'to be rejected')
  })
})
