'use strict'

const cli = require('heroku-cli-util')
const co = require('co')
const time = require('../../lib/time')
let builds = require('../../lib/builds')

function * run (context, heroku) {
  let b = yield heroku.request({
    path: `/apps/${context.app}/builds`,
    partial: true,
    headers: {
      'Range': `created_at ..; max=${context.flags.num || 15}, order=desc`
    }
  })

  cli.styledHeader(`${context.app} Builds`)
  cli.table(b, {
    columns: [
      {label: 'ID', key: 'id', format: (t) => t},
      {label: 'Source Version', key: 'source_blob.version', format: (v) => v},
      {label: 'Created At', key: 'created_at', format: (t) => time.ago(new Date(t))},
      {label: 'Duration', format: (_, t) => time.duration(new Date(t.created_at).getTime(), new Date(t.updated_at).getTime())},
      {label: 'Status', key: 'status', format: (s) => cli.color[builds.StatusColor(s)](s)},
      {label: 'User', key: 'user', format: (u) => cli.color.magenta(u.email.replace(/@addons\.heroku\.com$/, ''))}
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
