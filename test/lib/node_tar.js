'use strict'

const expect = require('unexpected')
const nodeTar = require('../../lib/node_tar')
var tmp = require('tmp')

describe('node_tar', () => {
  it('compresses the folder', () => {
    var file = tmp.fileSync()
    return expect(nodeTar.call(process.cwd() + '/test', file.name), 'to be fulfilled')
  })

  it('has an error', () => {
    var file = tmp.fileSync()
    return expect(nodeTar.call('/dev/null', file.name), 'to be rejected')
  })
})
