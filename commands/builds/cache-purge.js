'use strict'

const cli = require('heroku-cli-util')
const co = require('co')

function * run (context, heroku) {
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
