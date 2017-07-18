'use strict'

const cli = require('heroku-cli-util')
const co = require('co')
let builds = require('../../lib/builds')

function * run (context, heroku) {
  let build = yield builds.FindByLatestOrId(heroku, context.app, context.args.build)

  if (context.flags.json) {
    cli.styledJSON(build)
  } else {
    let release = yield heroku.get(`/apps/${context.app}/releases/${build.release.id}`)

    cli.styledHeader(`Build ${cli.color[builds.StatusColor(build.status)](build.id)}`)
    cli.styledObject({
      By: build.user.email,
      When: build.created_at,
      Status: build.status,
      Buildpacks: build.buildpacks.map((e) => e.url),
      Release: `v${release.version}`
    })
  }
}

module.exports = {
  topic: 'builds',
  command: 'info',
  description: 'view detailed information for a build',
  needsApp: true,
  needsAuth: true,
  args: [{name: 'build', optional: true}],
  flags: [
    {name: 'json', description: 'output in json format'}
  ],
  run: cli.command(co.wrap(run))
}
