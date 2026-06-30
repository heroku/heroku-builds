import nock from 'nock'
import {resolve} from 'node:path'

process.env.TS_NODE_PROJECT = resolve('test/tsconfig.json')
process.env.HEROKU_API_KEY = 'test-api-key'
process.stdout.columns = 120
process.stderr.columns = 120
nock.disableNetConnect()
