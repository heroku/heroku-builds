import {expect} from '@oclif/test'
import nock from 'nock'
import {stderr, stdout} from 'stdout-stderr'

import Cmd from '../../../src/commands/builds/cancel'
import {runCommand} from '../../run-command'

describe('builds cancel', () => {
  it('cancels a build', async () => {
    const api = nock('https://api.heroku.com:443')
      .get('/apps/my-app/builds')
      .reply(200, [{id: 'build_id', status: 'pending'}])
      .delete('/apps/my-app/builds/build_id')
      .reply(200, '')
    await runCommand(Cmd, ['--app', 'my-app'])
    expect(stdout.output).to.be.empty
    expect(stderr.output).to.contain('Stopping build build_id... done')
    api.done()
  })

  it('does not cancel an already finished build', async () => {
    process.stdout.columns = 80

    const api = nock('https://api.heroku.com:443')
      .get('/apps/my-app/builds')
      .reply(200, [{id: 'build_id', status: 'succeeded'}])

    try {
      await runCommand(Cmd, ['--app', 'my-app'])
    } catch (error) {
      const {message} = error as Error
      expect(message).to.contain('Can only cancel pending builds')
    }

    expect(stdout.output).to.be.empty
    api.done()
  })
})
