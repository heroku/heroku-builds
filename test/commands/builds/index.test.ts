import {runCommand} from '@heroku-cli/test-utils'
import {expect} from 'chai'
import nock from 'nock'

import Cmd from '../../../src/commands/builds/index.js'

describe('builds index', function () {
  const builds = [
    {
      app: {
        id: 'app_uuid',
      },
      buildpacks: [
        {
          url: 'https://example.com/buildpack.tgz',
        },
      ],
      created_at: '2016-08-08T08:46:40Z',
      id: 'build_uuid',
      output_stream_url: 'https://example.com',
      release: {
        id: 'release_uuid',
      },
      slug: {
        id: 'slug_uuid',
      },
      source_blob: {
        checksum: 'SHA256:3e46dfa5cc27b79b5aab6fa054775915b65b9709e4167ac508a7684445de493a',
        url: 'https://example.com/source_blob.tar.gz',
        version: 'succeeded_blob_version',
        version_description: '',
      },
      status: 'succeeded',
      updated_at: '2016-08-08T08:46:55Z',
      user: {
        email: 'damien@heroku.com',
        id: 'user_uuid',
      },
    },
    {
      app: {
        id: 'app_uuid',
      },
      buildpacks: [
        {
          url: 'https://example.com/buildpack.tgz',
        },
      ],
      created_at: '2016-08-08T08:46:40Z',
      id: 'build_uuid',
      output_stream_url: 'https://example.com',
      release: {
        id: 'release_uuid',
      },
      slug: {
        id: 'slug_uuid',
      },
      source_blob: {
        checksum: 'SHA256:3e46dfa5cc27b79b5aab6fa054775915b65b9709e4167ac508a7684445de493a',
        url: 'https://example.com/source_blob.tar.gz',
        version: 'failed_blob_version',
        version_description: '',
      },
      status: 'failed',
      updated_at: '2016-08-08T08:46:55Z',
      user: {
        email: 'damien@heroku.com',
        id: 'user_uuid',
      },
    },
  ]

  afterEach(function () {
    nock.cleanAll()
  })

  it('shows builds', async function () {
    const originalColumns = process.stdout.columns
    process.stdout.columns = 200
    try {
      const api = nock('https://api.heroku.com:443')
      .get('/apps/my-app/builds')
      .reply(200, builds)
      const {stdout} = await runCommand(Cmd, ['--app', 'my-app'])
      expect(stdout).to.contain('my-app Builds')
      expect(stdout).to.contain('build_uuid')
      expect(stdout).to.contain('succeeded_blob_version')
      expect(stdout).to.contain('failed_blob_version')
      expect(stdout).to.contain('damien@heroku.com')
      api.done()
    } finally {
      process.stdout.columns = originalColumns
    }
  })
})
