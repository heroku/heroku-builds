import {runCommand} from '@heroku-cli/test-utils'
import {expect} from 'chai'
import nock from 'nock'

import Cmd from '../../../src/commands/builds/cache/purge.js'
import {stubUxActionStart} from '../../helpers/ux-stub.js'

describe('builds cache purge', function () {
  let uxStub: ReturnType<typeof stubUxActionStart>

  beforeEach(function () {
    uxStub = stubUxActionStart()
  })

  afterEach(function () {
    uxStub.restore()
    nock.cleanAll()
  })

  it('purges the build cache for a 204 (No Content) response', async function () {
    const api = nock('https://api.heroku.com')
    .delete('/apps/my-app/build-cache')
    .reply(204)
    const {stderr} = await runCommand(Cmd, ['--app', 'my-app', '--confirm', 'my-app'])
    expect(stderr).to.contain('Purging build cache for my-app... done')
    api.done()
  })

  it('purges the build cache for a 202 (Accepted) response with empty body and Content-Type header set', async function () {
    const api = nock('https://api.heroku.com')
    .delete('/apps/my-app/build-cache')
    .reply(202, '', {'content-type': 'application/json'})
    const {stderr} = await runCommand(Cmd, ['--app', 'my-app', '--confirm', 'my-app'])
    expect(stderr).to.contain('Purging build cache for my-app... done')
    api.done()
  })

  it('errors out for other thrown errors', async function () {
    const api = nock('https://api.heroku.com')
    .delete('/apps/my-app/build-cache')
    .reply(403, {id: 'forbidden', message: 'forbidden'})
    const {error} = await runCommand(Cmd, ['--app', 'my-app', '--confirm', 'my-app'])
    expect(error?.message).to.contain('forbidden')
    api.done()
  })
})
