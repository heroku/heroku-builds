'use strict'

let cli = require('heroku-cli-util')
let co = require('co')
let builds = require('../../lib/builds')

module.exports = {
  topic: 'builds',
  command: 'output',
  needsAuth: true,
  needsApp: true,
  description: 'show build output',
  help: 'Show build output for a Heroku app',
  args: [
    {
      name: 'id',
      optional: true,
      hidden: false
    }
  ],
  run: cli.command(co.wrap(run))
}

function * run (context, heroku) {
  let build = yield builds.FindByLatestOrId(heroku, context.app, context.args.id)

  return new Promise(function (resolve, reject) {
    let stream = cli.got.stream(build.output_stream_url)
    stream.on('error', reject)
    stream.on('end', resolve)
    stream.pipe(process.stderr)
  })
}
