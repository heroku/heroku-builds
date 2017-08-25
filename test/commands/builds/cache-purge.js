'use strict'
const cli = require('heroku-cli-util')
const nock = require('nock')
const cmd = require('../../..').commands.find(c => c.topic === 'builds' && c.command === 'cache:purge')
const expect = require('unexpected')

describe('builds cache purge', () => {
  beforeEach(() => cli.mockConsole())

  it('purges the build cache', () => {
    process.stdout.columns = 80
    let api = nock('https://api.heroku.com:443')
      .delete('/apps/myapp/build-cache')
      .reply(200)

    return cmd.run({app: 'myapp'})
      .then(() => expect(cli.stdout, 'to be empty'))
      .then(() => expect(cli.stderr, 'to equal', 'Purging build cache for myapp... done\n'))
      .then(() => api.done())
  })
})
