'use strict'

let cli = require('heroku-cli-util')
let co = require('co')
let builds = require('../../lib/builds')

async function cancel (context, heroku) {
  let build = await builds.FindByLatestOrId(heroku, context.app, context.args.build)

  if (build.status !== 'pending') {
    cli.error(`Can only cancel pending builds. Build ${build.id} has status '${build.status}'`, 1)
    return
  }

  let d = heroku.request({
    method: 'DELETE',
    path: `/apps/${context.app}/builds/${build.id}`,
    headers: {'Accept': 'application/vnd.heroku+json; version=3.cancel-build'}
  })
  await cli.action(`Stopping build ${build.id}`, d)
}

module.exports = {
  topic: 'builds',
  command: 'cancel',
  needsAuth: true,
  needsApp: true,
  description: 'cancel a running build',
  help: 'Stops executing a running build. Omit BUILD to cancel the latest build.',
  args: [
    {
      name: 'build',
      optional: true,
      hidden: false
    }
  ],
  run: cli.command(co.wrap(cancel))
}
