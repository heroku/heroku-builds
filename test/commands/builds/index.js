'use strict'

const cli = require('heroku-cli-util')
const nock = require('nock')
const cmd = require('../../../commands/builds')
const expect = require('unexpected')

describe('builds index', () => {
  beforeEach(() => cli.mockConsole())

  const builds = [
    {
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
    },
    {
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
        'version': 'failed_blob_version',
        'version_description': ''
      },
      'status': 'failed',
      'updated_at': '2016-08-08T08:46:55Z',
      'user': {
        'email': 'damien@heroku.com',
        'id': 'user_uuid'
      }
    }
  ]

  it('shows builds', () => {
    process.stdout.columns = 80
    let api = nock('https://api.heroku.com:443')
      .get('/apps/myapp/builds')
      .reply(200, builds)
    return cmd.run({app: 'myapp', flags: {}})
      .then(() => expect(cli.stdout, 'to equal', `=== myapp Builds
build_uuid  2016/08/08 08:46:40 +0000  succeeded_blob_version  damien@heroku.com
build_uuid  2016/08/08 08:46:40 +0000  failed_blob_version     damien@heroku.com
`))
      .then(() => expect(cli.stderr, 'to be empty'))
      .then(() => api.done())
  })
})
