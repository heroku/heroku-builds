'use strict'

const cli = require('heroku-cli-util')
const co = require('co')
const util = require('util')

const confirmMsg = `WARNING: This will delete the build cache for %s.
Clearing your build cache can have unintended side effects, such as updating your language version if you don't explicitly specify one.`

function * run (context, heroku) {
  yield cli.confirmApp(
    context.app,
    context.flags.confirm,
    util.format(confirmMsg, cli.color.app(context.app))
  )

  let r = heroku.request({
    method: 'DELETE',
    path: `/apps/${context.app}/build-cache`
  })

  yield cli.action(`Purging build cache for ${cli.color.app(context.app)}`, r)
}

module.exports = {
  topic: 'builds',
  command: 'cache:purge',
  description: 'purge the build cache for the specified app',
  needsApp: true,
  needsAuth: true,
  run: cli.command(co.wrap(run))
}
