'use strict'
/* globals describe it beforeEach */

const cli = require('heroku-cli-util')
const nock = require('nock')
const cmd = require('../../..').commands.find(c => c.topic === 'builds' && c.command === 'output')
const expect = require('chai').expect
const stdMocks = require('std-mocks')

describe('builds:output', function () {
  beforeEach(() => cli.mockConsole())

  it('shows the output from a build', function () {
    stdMocks.use()
    process.stdout.columns = 80
    let busl = nock('https://busl.test:443')
      .get('/streams/build.log')
      .reply(200, 'Build Content')
    let api = nock('https://api.heroku.com:443')
      .get('/apps/myapp/builds/build_id')
      .reply(200, { output_stream_url: 'https://busl.test/streams/build.log' })
    return cmd.run({app: 'myapp', args: {id: 'build_id'}})
      .then(() => expect(stdMocks.flush().stdout.join('')).to.equal('Build Content'))
      .then(() => expect(cli.stderr).to.equal(''))
      .then(() => busl.done())
      .then(() => api.done())
      .then(() => stdMocks.restore())
      .catch(() => stdMocks.restore())
  })
})
