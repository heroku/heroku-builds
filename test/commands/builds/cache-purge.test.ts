import {CLIError} from '@oclif/core/lib/errors'
import {expect} from '@oclif/test'
import nock from 'nock'
import {stderr, stdout} from 'stdout-stderr'

import Cmd from '../../../src/commands/builds/cache/purge'
import {runCommand} from '../../run-command'

describe('builds cache purge', () => {
  it('purges the build cache for a 204 (No Content) response', async () => {
    const api = nock('https://api.heroku.com')
      .delete('/apps/my-app/build-cache')
      .reply(204)
    await runCommand(Cmd, ['--app', 'my-app', '--confirm', 'my-app'])
    expect(stdout.output).to.be.empty
    expect(stderr.output.trim().split('\n').pop()).to.eq('Purging build cache for my-app... done')
    api.done()
  })

  it('purges the build cache for a 202 (Accepted) response with empty body and Content-Type header set', async () => {
    const api = nock('https://api.heroku.com')
      .delete('/apps/my-app/build-cache')
      .reply(202, '', {'content-type': 'application/json'})
    await runCommand(Cmd, ['--app', 'my-app', '--confirm', 'my-app'])
    expect(stdout.output).to.be.empty
    expect(stderr.output.trim().split('\n').pop()).to.eq('Purging build cache for my-app... done')
    api.done()
  })

  it('errors out for other thrown errors', async () => {
    const api = nock('https://api.heroku.com')
      .delete('/apps/my-app/build-cache')
      .reply(403, {id: 'forbidden', message: 'forbidden'})
    try {
      await runCommand(Cmd, ['--app', 'my-app', '--confirm', 'my-app'])
    } catch (error: unknown) {
      const {message, oclif} = error as CLIError
      expect(message).to.eq('forbidden\n\nError ID: forbidden')
      expect(oclif.exit).to.eq(2)
    }

    expect(stderr.output.trim().split('\n').pop()).not.to.eq('Purging build cache for my-app... done')
    api.done()
  })
})
