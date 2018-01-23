'use strict'

const cli = require('heroku-cli-util')
const nock = require('nock')
const cmd = require('../../../commands/builds/cancel')
const expect = require('unexpected')

describe('builds cancel', () => {
  beforeEach(() => cli.mockConsole())

  it('cancels a build', () => {
    process.stdout.columns = 80

    let api = nock('https://api.heroku.com:443')
      .get('/apps/myapp/builds')
      .reply(200, [{id: 'build_id', status: 'pending'}])
      .delete('/apps/myapp/builds/build_id')
      .reply(200, '')

    return cmd.run({app: 'myapp', args: {}, flags: {}})
      .then(() => expect(cli.stdout, 'to be empty'))
      .then(() => expect(cli.stderr, 'to contain', 'Stopping build build_id... done'))
      .then(() => api.done())
  })

  it('does not cancel an already finished build', () => {
    process.stdout.columns = 80

    let api = nock('https://api.heroku.com:443')
      .get('/apps/myapp/builds')
      .reply(200, [{id: 'build_id', status: 'succeeded'}])

    return cmd.run({app: 'myapp', args: {}, flags: {}})
      .then(() => expect(cli.stdout, 'to be empty'))
      .then(() => expect(cli.stderr, 'to contain', 'Can only cancel pending builds'))
      .then(() => api.done())
  })
})
