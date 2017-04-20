'use strict'

const cli = require('heroku-cli-util')
const co = require('co')
const time = require('../../lib/time')

function statusColor (s) {
  switch (s) {
    case 'pending':
      return 'yellow'
    case 'failed':
      return 'red'
    default:
      return 'white'
  }
}

function * run (context, heroku) {
  let builds = yield heroku.request({
    path: `/apps/${context.app}/builds`,
    partial: true,
    headers: {
      'Range': `created_at ..; max=${context.flags.num || 15}, order=desc`
    }
  })

  cli.styledHeader(`${context.app} Builds`)
  cli.table(builds, {
    printHeader: false,
    columns: [
      {key: 'created_at', format: (t) => time.ago(new Date(t))},
      {key: 'source_blob.version', format: (v, b) => cli.color[statusColor(b.status)](v)},
      {key: 'user', format: (u) => cli.color.magenta(u.email.replace(/@addons\.heroku\.com$/, ''))}
    ]
  })
}

module.exports = {
  topic: 'builds',
  needsAuth: true,
  needsApp: true,
  description: 'list builds',
  help: 'List builds for a Heroku app',
  flags: [
    {name: 'num', char: 'n', description: 'number of builds to show', hasValue: true}
  ],
  run: cli.command(co.wrap(run))
}
