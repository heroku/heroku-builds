import {expect} from '@oclif/test'
import nock from 'nock'
import {stderr, stdout} from 'stdout-stderr'

import Cmd from '../../../src/commands/builds/create'
import {runCommand} from '../../run-command'

describe('builds create', () => {
  const source = {
    source_blob: {
      get_url: 'https://api.heroku.com/sources/1234.tgz',
      put_url: 'https://api.heroku.com/sources/1234.tgz',
    },
  }

  const build = {
    app: {
      id: 'app_uuid',
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
      version_description: null,
    },
    status: 'pending',
    updated_at: '2017-06-16T09:58:25Z',
    user: {
      email: 'johndoe@example.com',
      id: 'user_uuid',
    },
  }

  function buildMocks(urlBuild?: boolean, buildData?: Record<string, unknown>) {
    const busl = nock('https://busl.test:443')
      .get('/streams/build.log')
      .reply(200, 'Streamed Build Output')
    const api = nock('https://api.heroku.com:443')
      .post('/apps/my-app/builds')
      .reply(200, buildData || build)
      .get('/apps/my-app/builds/build_uuid')
      .reply(200, buildData || build)

    if (!urlBuild) {
      api.post('/sources')
        .reply(200, source)
        .put('/sources/1234.tgz')
        .reply(200)
    }

    return {busl, api}
  }

  it('creates a new build', async () => {
    const mocks = buildMocks()
    process.stdout.columns = 80
    await runCommand(Cmd, ['--app', 'my-app', '--dir', process.cwd() + '/test', '--include-vcs-ignore'])
    expect(stdout.output).to.be.empty
    mocks.api.done()
    mocks.busl.done()
  })

  it('creates a new build with node tar', async () => {
    const mocks = buildMocks()
    await runCommand(Cmd, ['--app', 'my-app', '--dir', process.cwd() + '/test', '--tar', 'no-tar'])
    expect(stdout.output).to.be.empty
    expect(stderr.output).to.contain('Couldn\'t detect GNU tar. Builds could fail due to decompression')
    mocks.api.done()
    mocks.busl.done()
  })

  it('creates a new build from an existing file', async () => {
    const mocks = buildMocks()
    process.stdout.columns = 80
    // not a tar file, but will suffice for testing purposes
    await runCommand(Cmd, ['--app', 'my-app', '--source-tar', process.cwd() + '/test/helpers.mjs'])
    expect(stdout.output).to.be.empty
    mocks.api.done()
    mocks.busl.done()
  })

  it('creates a new build from URL', async () => {
    const mocks = buildMocks(true)
    process.stdout.columns = 80

    // not a tar file, but will suffice for testing purposes
    await runCommand(Cmd, ['--app', 'my-app', '--source-url', 'https://example.com/1234.tgz'])
    expect(stdout.output, 'to be empty')
    mocks.api.done()
    mocks.busl.done()
  })

  it('exits with an error on a failed build', async () => {
    const failedBuild = build
    failedBuild.status = 'failed'
    const mocks = buildMocks(false, failedBuild)
    try {
      await runCommand(Cmd, ['--app', 'my-app', '--dir', process.cwd() + '/test', '--include-vcs-ignore'])
    } catch {
      expect(stdout.output).to.be.empty
    }

    mocks.api.done()
    mocks.busl.done()
  })
})
