'use strict'

const cli = require('heroku-cli-util')
const nock = require('nock')
const cmd = require('../../../commands/builds/create')
const expect = require('unexpected')

describe('builds create', () => {
  beforeEach(() => cli.mockConsole())

  const source = {
    source_blob: {
      get_url: 'https://api.heroku.com/sources/1234.tgz',
      put_url: 'https://api.heroku.com/sources/1234.tgz'
    }
  }

  const build = {
    app: {
      id: 'app_uuid'
    },
    buildpacks: null,
    created_at: '2017-06-16T09:58:25Z',
    id: 'build_uuid',
    output_stream_url: 'https://busl.test/streams/build.log',
    release: null,
    slug: null,
    source_blob: {
      checksum: null,
      url: 'https://api.heroku.com/sources/1234.tgz',
      version: '',
      version_description: null
    },
    status: 'pending',
    updated_at: '2017-06-16T09:58:25Z',
    user: {
      email: 'johndoe@example.com',
      id: 'user_uuid'
    }
  }

  it('creates a new build', () => {
    process.stdout.columns = 80
    let busl = nock('https://busl.test:443')
      .get('/streams/build.log')
      .reply(200, 'Streamed Build Output')
    let api = nock('https://api.heroku.com:443')
      .post('/sources')
      .reply(200, source)
      .put('/sources/1234.tgz')
      .reply(200)
      .post('/apps/myapp/builds')
      .reply(200, build)

    return cmd.run({app: 'myapp', flags: {cwd: process.cwd() + '/test', 'include-vcs-ignore': true}})
      .then(() => expect(cli.stdout, 'to be empty'))
      .then(() => expect(cli.stderr, 'to be empty'))
      .then(() => api.done())
      .then(() => busl.done())
  })

  it('creates a new build with node tar', () => {
    process.stdout.columns = 80
    let busl = nock('https://busl.test:443')
      .get('/streams/build.log')
      .reply(200, 'Streamed Build Output')
    let api = nock('https://api.heroku.com:443')
      .post('/sources')
      .reply(200, source)
      .put('/sources/1234.tgz')
      .reply(200)
      .post('/apps/myapp/builds')
      .reply(200, build)

    return cmd.run({app: 'myapp', flags: {cwd: process.cwd() + '/test', tar: 'no-tar'}})
      .then(() => expect(cli.stdout, 'to be empty'))
      .then(() => expect(cli.stderr, 'to contain', 'Couldn\'t detect GNU tar. Builds could fail due to decompression errors'))
      .then(() => api.done())
      .then(() => busl.done())
  })
})
