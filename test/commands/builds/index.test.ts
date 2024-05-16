import {expect} from '@oclif/test'
import nock from 'nock'
import {stderr, stdout} from 'stdout-stderr'
import heredoc from 'tsheredoc'

import Cmd from '../../../src/commands/builds/index'
import {runCommand} from '../../run-command'

describe('builds index', () => {
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

  it('shows builds', async () => {
    process.stdout.columns = 80
    const api = nock('https://api.heroku.com:443')
      .get('/apps/my-app/builds')
      .reply(200, builds)
    await runCommand(Cmd, ['--app', 'my-app'])
    expect(stdout.output).to.eq(heredoc(`
 === my-app Builds

  ID         Source Version         Created At                Duration Status    User              
  ────────── ────────────────────── ───────────────────────── ──────── ───────── ───────────────── 
  build_uuid succeeded_blob_version 2016/08/08 08:46:40 +0000 15s      succeeded damien@heroku.com 
  build_uuid failed_blob_version    2016/08/08 08:46:40 +0000 15s      failed    damien@heroku.com 
`))
    expect(stderr.output, 'to be empty')
    api.done()
  })
})
