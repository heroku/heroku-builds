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
  return heroku.get(`/apps/${context.app}/builds/${context.args.id}`)
    .then(function (build) {
      return new Promise(function (resolve, reject) {
        let stream = cli.got.stream(build.output_stream_url)
        stream.on('error', reject)
        stream.on('end', resolve)
        stream.pipe(process.stderr)
      })
    })
}
