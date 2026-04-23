import {runCommand} from '@heroku-cli/test-utils'
import {expect} from 'chai'
import nock from 'nock'

import Cmd from '../../../src/commands/builds/cancel.js'
import {stubUxActionStart} from '../../helpers/ux-stub.js'

describe('builds cancel', function () {
  let uxStub: ReturnType<typeof stubUxActionStart>

  beforeEach(function () {
    uxStub = stubUxActionStart()
  })

  afterEach(function () {
    uxStub.restore()
    nock.cleanAll()
  })

  it('cancels a build', async function () {
    const api = nock('https://api.heroku.com:443')
    .get('/apps/my-app/builds')
    .reply(200, [{id: 'build_id', status: 'pending'}])
    .delete('/apps/my-app/builds/build_id')
    .reply(200, '')
    const {stderr} = await runCommand(Cmd, ['--app', 'my-app'])
    expect(stderr).to.contain('Stopping build build_id... done')
    api.done()
  })

  it('does not cancel an already finished build', async function () {
    const api = nock('https://api.heroku.com:443')
    .get('/apps/my-app/builds')
    .reply(200, [{id: 'build_id', status: 'succeeded'}])

    const {error} = await runCommand(Cmd, ['--app', 'my-app'])
    expect(error?.message).to.contain('Can only cancel pending builds')
    api.done()
  })
})
