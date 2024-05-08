import {expect} from '@oclif/test'
import nock from 'nock'
import {stdout} from 'stdout-stderr'

import Cmd from '../../../src/commands/builds/output'
import {runCommand} from '../../run-command'

describe('builds:output', () => {
  it('shows the output from a build', async () => {
    process.stdout.columns = 80
    const busl = nock('https://busl.test:443')
      .get('/streams/build.log')
      .reply(200, 'Build Content')
    const api = nock('https://api.heroku.com:443')
      .get('/apps/my-app/builds/build_id')
      .reply(200, {output_stream_url: 'https://busl.test/streams/build.log'})

    await runCommand(Cmd, ['--app', 'my-app', 'build_id'])
    expect(stdout.output).to.equal('Build Content')
    busl.done()
    api.done()
  })

  it('shows the output from the latest build', async () => {
    process.stdout.columns = 80
    const busl = nock('https://busl.test:443')
      .get('/streams/build.log')
      .reply(200, 'Build Content')
    const api = nock('https://api.heroku.com:443')
      .get('/apps/my-app/builds')
      .reply(200, [{output_stream_url: 'https://busl.test/streams/build.log'}])
    await runCommand(Cmd, ['--app', 'my-app'])
    expect(stdout.output).to.equal('Build Content')
    busl.done()
    api.done()
  })
})
