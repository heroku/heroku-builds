'use strict'

let cli = require('heroku-cli-util')

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
      optional: false,
      hidden: false
    }
  ],
  run: cli.command(showOutput)
}

function showOutput (context, heroku) {
  let app = heroku.apps(context.app)

  let id = context.args.id

  return app.builds(id).info().then(function (build) {
    return new Promise(function (resolve, reject) {
      let stream = cli.got.stream(build.output_stream_url)
      stream.on('error', reject)
      stream.on('end', resolve)
      let piped = stream.pipe(process.stderr)
      piped.on('error', reject)
    })
  })
}
