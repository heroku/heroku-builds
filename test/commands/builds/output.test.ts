import {runCommand} from '@heroku-cli/test-utils'
import {expect} from 'chai'
import nock from 'nock'

import Cmd from '../../../src/commands/builds/output.js'

describe('builds:output', function () {
  let originalColumns: number | undefined

  beforeEach(function () {
    originalColumns = process.stdout.columns
  })

  afterEach(function () {
    if (originalColumns === undefined) {
      delete (process.stdout as {columns?: number}).columns
    } else {
      process.stdout.columns = originalColumns
    }

    nock.cleanAll()
  })

  it('shows the output from a build', async function () {
    process.stdout.columns = 80
    const busl = nock('https://busl.test:443')
    .get('/streams/build.log')
    .reply(200, 'Build Content')
    const api = nock('https://api.heroku.com:443')
    .get('/apps/my-app/builds/build_id')
    .reply(200, {output_stream_url: 'https://busl.test/streams/build.log'})

    const {stdout} = await runCommand(Cmd, ['--app', 'my-app', 'build_id'])
    expect(stdout).to.contain('Build Content')
    busl.done()
    api.done()
  })

  it('shows the output from the latest build', async function () {
    process.stdout.columns = 80
    const busl = nock('https://busl.test:443')
    .get('/streams/build.log')
    .reply(200, 'Build Content')
    const api = nock('https://api.heroku.com:443')
    .get('/apps/my-app/builds')
    .reply(200, [{output_stream_url: 'https://busl.test/streams/build.log'}])
    const {stdout} = await runCommand(Cmd, ['--app', 'my-app'])
    expect(stdout).to.contain('Build Content')
    busl.done()
    api.done()
  })

  it('warns when no build is found', async function () {
    const api = nock('https://api.heroku.com:443')
    .get('/apps/my-app/builds')
    .reply(200, [])
    const {stderr} = await runCommand(Cmd, ['--app', 'my-app'])
    expect(stderr).to.contain('No build found')
    api.done()
  })
})
