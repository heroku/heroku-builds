'use strict'
const cli = require('heroku-cli-util')
const nock = require('nock')
const cmd = require('../../..').commands.find(c => c.topic === 'builds' && c.command === 'info')
const expect = require('unexpected')

describe('builds info', () => {
  beforeEach(() => cli.mockConsole())

  const build = {
    'app': {
      'id': 'app_uuid'
    },
    'buildpacks': [
      {
        'url': 'https://example.com/buildpack.tgz'
      }
    ],
    'created_at': '2016-08-08T08:46:40Z',
    'id': 'build_uuid',
    'output_stream_url': 'https://example.com',
    'release': {
      'id': 'release_uuid'
    },
    'slug': {
      'id': 'slug_uuid'
    },
    'source_blob': {
      'checksum': 'SHA256:3e46dfa5cc27b79b5aab6fa054775915b65b9709e4167ac508a7684445de493a',
      'url': 'https://example.com/source_blob.tar.gz',
      'version': 'succeeded_blob_version',
      'version_description': ''
    },
    'status': 'succeeded',
    'updated_at': '2016-08-08T08:46:55Z',
    'user': {
      'email': 'damien@heroku.com',
      'id': 'user_uuid'
    }
  }

  it('shows build info in json', () => {
    process.stdout.columns = 80
    let api = nock('https://api.heroku.com:443')
      .get('/apps/myapp/builds')
      .reply(200, [build])
    return cmd.run({app: 'myapp', args: {}, flags: {'json': true}})
      .then(() => expect(JSON.parse(cli.stdout), 'to satisfy', {status: 'succeeded'}))
      .then(() => expect(cli.stderr, 'to be empty'))
      .then(() => api.done())
  })

  it('shows the latest build info', () => {
    process.stdout.columns = 80
    let api = nock('https://api.heroku.com:443')
      .get('/apps/myapp/builds')
      .reply(200, [build])
      .get('/apps/myapp/releases/release_uuid')
      .reply(200, {version: 42})
    return cmd.run({app: 'myapp', args: {}, flags: {}})
      .then(() => expect(cli.stdout, 'to equal', `=== Build build_uuid
Buildpacks: https://example.com/buildpack.tgz
By:         damien@heroku.com
Release:    v42
Status:     succeeded
When:       2016-08-08T08:46:40Z
`))
      .then(() => expect(cli.stderr, 'to be empty'))
      .then(() => api.done())
  })
})
