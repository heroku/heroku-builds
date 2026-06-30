import {runCommand} from '@heroku-cli/test-utils'
import {expect} from 'chai'
import nock from 'nock'

import Cmd from '../../../src/commands/builds/info.js'

describe('builds info', function () {
  let originalColumns: number | undefined

  beforeEach(function () {
    originalColumns = process.stdout.columns
  })

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

  afterEach(function () {
    if (originalColumns === undefined) {
      delete (process.stdout as {columns?: number}).columns
    } else {
      process.stdout.columns = originalColumns
    }

    nock.cleanAll()
  })

  it('shows build info in json', async function () {
    process.stdout.columns = 80
    const api = nock('https://api.heroku.com:443')
      .get('/apps/my-app/builds')
      .reply(200, [build])
    const {stdout} = await runCommand(Cmd, ['--app', 'my-app', '--json'])
    expect(JSON.parse(stdout)).to.have.deep.property('status', 'succeeded')
    api.done()
  })

  it('shows the latest build info', async function () {
    process.stdout.columns = 80
    const api = nock('https://api.heroku.com:443')
      .get('/apps/my-app/builds')
      .reply(200, [build])
      .get('/apps/my-app/releases/release_uuid')
      .reply(200, {version: 42})
    const {stdout} = await runCommand(Cmd, ['--app', 'my-app'])
    expect(stdout).to.contain('Build build_uuid')
    expect(stdout).to.contain('damien@heroku.com')
    expect(stdout).to.contain('v42')
    expect(stdout).to.contain('succeeded')
    api.done()
  })

  it('shows a failed build info', async function () {
    process.stdout.columns = 80
    const api = nock('https://api.heroku.com:443')
      .get('/apps/my-app/builds')
      .reply(200, [failedBuild])
    const {stdout} = await runCommand(Cmd, ['--app', 'my-app'])
    expect(stdout).to.contain('Build build_uuid')
    expect(stdout).to.contain('damien@heroku.com')
    expect(stdout).to.contain('failed')
    api.done()
  })

  it('warns when no build is found', async function () {
    const api = nock('https://api.heroku.com:443')
      .get('/apps/my-app/builds')
      .reply(200, [])
    const {stderr} = await runCommand(Cmd, ['--app', 'my-app'])
    expect(stderr).to.contain('No builds found')
    api.done()
  })
})
