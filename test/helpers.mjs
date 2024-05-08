import * as mockdate from 'mockdate'
import * as nock  from 'nock'

process.env.TZ = 'UTC'                         // Use UTC time always
mockdate.set(new Date())                       // Freeze time
process.stdout.columns = 120                    // Set screen width for consistent wrapping
process.stderr.columns = 120                    // Set screen width for consistent wrapping

nock.default.disableNetConnect()

globalThis.setInterval = () => ({unref() {}})
const tm = globalThis.setTimeout
globalThis.setTimeout = cb => tm(cb)
