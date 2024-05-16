import {expect} from '@oclif/test'
import nock from 'nock'
import {stderr, stdout} from 'stdout-stderr'

import Cmd from '../../../src/commands/builds/cache/purge'
import {runCommand} from '../../run-command'

describe('builds cache purge', () => {
  it('purges the build cache', async () => {
    const api = nock('https://api.heroku.com:443')
      .delete('/apps/my-app/build-cache')
      .reply(200)
    await runCommand(Cmd, ['--app', 'my-app', '--confirm', 'my-app'])
    expect(stdout.output).to.be.empty
    expect(stderr.output.trim().split('\n').pop()).to.eq('Purging build cache for my-app... done')
    api.done()
  })
})
