import {expect} from '@oclif/test'
import nock from 'nock'
import {stderr, stdout} from 'stdout-stderr'
import heredoc from 'tsheredoc'

import Cmd from '../../../src/commands/builds/info'
import {runCommand} from '../../run-command'

describe('builds info', () => {
  const build = {
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
  }

  const failedBuild = {
    app: {
      id: 'app_uuid',
    },
    buildpacks: [],
    created_at: '2016-08-08T08:46:40Z',
    id: 'build_uuid',
    output_stream_url: 'https://example.com',
    release: null,
    slug: null,
    source_blob: {
      checksum: 'SHA256:3e46dfa5cc27b79b5aab6fa054775915b65b9709e4167ac508a7684445de493a',
      url: 'https://example.com/source_blob.tar.gz',
      version: 'succeeded_blob_version',
      version_description: '',
    },
    status: 'failed',
    updated_at: '2016-08-08T08:46:55Z',
    user: {
      email: 'damien@heroku.com',
      id: 'user_uuid',
    },
  }

  it('shows build info in json', async () => {
    process.stdout.columns = 80
    const api = nock('https://api.heroku.com:443')
      .get('/apps/my-app/builds')
      .reply(200, [build])
    await runCommand(Cmd, ['--app', 'my-app', '--json'])
    expect(JSON.parse(stdout.output)).to.have.deep.property('status', 'succeeded')
    api.done()
  })

  it('shows the latest build info', async () => {
    process.stdout.columns = 80
    const api = nock('https://api.heroku.com:443')
      .get('/apps/my-app/builds')
      .reply(200, [build])
      .get('/apps/my-app/releases/release_uuid')
      .reply(200, {version: 42})
    await runCommand(Cmd, ['--app', 'my-app'])
    expect(stdout.output).to.equal(heredoc(`
    === Build build_uuid

    Buildpacks: https://example.com/buildpack.tgz
    By:         damien@heroku.com
    Release:    v42
    Status:     succeeded
    When:       2016-08-08T08:46:40Z
`))
    expect(stderr.output).to.be.empty
    api.done()
  })

  it('shows a failed build info', async () => {
    process.stdout.columns = 80
    const api = nock('https://api.heroku.com:443')
      .get('/apps/my-app/builds')
      .reply(200, [failedBuild])
    await runCommand(Cmd, ['--app', 'my-app'])
    expect(stdout.output).to.eq(heredoc(`
    === Build build_uuid

    By:         damien@heroku.com
    Status:     failed
    When:       2016-08-08T08:46:40Z
`))
    expect(stderr.output).to.be.empty
    api.done()
  })
})
