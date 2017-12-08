'use strict'

let cli = require('heroku-cli-util')
let co = require('co')
let builds = require('../../lib/builds')

module.exports = {
  topic: 'builds',
  command: 'output',
  needsAuth: true,
  needsApp: true,
  description: 'show build output. Omit BUILD to get latest build.',
  help: 'Show build output for a Heroku app. Omit BUILD or use "current" in place of an BUILD to get the output for the latest build.',
  args: [
    {
      name: 'build',
      optional: true,
      hidden: false
    }
  ],
  run: cli.command(co.wrap(run))
}

function * run (context, heroku) {
  let build = yield builds.FindByLatestOrId(heroku, context.app, context.args.build)

  return new Promise(function (resolve, reject) {
    let stream = cli.got.stream(build.output_stream_url)
    stream.on('error', reject)
    stream.on('end', resolve)
    stream.pipe(process.stderr)
  })
}
