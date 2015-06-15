'use strict';

let cli     = require('heroku-cli-util');
let request = require('request');

module.exports = {
  topic: 'builds',
  command: 'output',
  needsAuth: true,
  needsApp: true,
  description: 'show build output',
  help: 'Show build output for a Heroku app',
  variableArgs: true,
  run: cli.command(showOutput)
};

function showOutput(context, heroku) {
  let id = context.args[0];

  if (!id) {
    cli.error("Usage: heroku builds:output <id> -a <app>")
    return
  }

  return heroku.request({
    path: `/apps/${context.app}/builds/${id}`,
    method: 'GET',
    headers: {
      'Accept': 'application/vnd.heroku+json; version=3.streaming-build-output'
    },
    parseJSON: true
  }).then(function (build) {
    request(build.output_stream_url).pipe(process.stdout);
  });
}
