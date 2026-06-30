import {Command, flags} from '@heroku-cli/command'
import * as Heroku from '@heroku-cli/schema'
import * as color from '@heroku/heroku-cli-util/color'
import {styledHeader, table} from '@heroku/heroku-cli-util/hux'

import {statusColor} from '../../lib/builds.js'
import {ago, duration} from '../../lib/time.js'

export default class Index extends Command {
  static description = 'list builds\nList builds for a Heroku app'
  static flags = {
    app: flags.app({required: true}),
    num: flags.string({char: 'n', description: 'number of builds to show'}),
    remote: flags.remote(),
  }
  static topic = 'builds'

  public async run(): Promise<void> {
    const {flags} = await this.parse(Index)
    const {app, num} = flags
    const {body: builds} = await this.heroku.get<Heroku.Build[]>(`/apps/${app}/builds`, {
      headers: {Range: `created_at ..; max=${num || 15}, order=desc`},
      partial: true,
    })
    styledHeader(`${app} Builds`)
    table<Heroku.Build>(builds, {
      id: {
        header: 'ID',
        get(row: Heroku.Build): null | string | undefined {
          return row.id
        },
      },
      sourceVersion: {
        header: 'Source Version',
        get(row: Heroku.Build): null | string | undefined {
          return row.source_blob?.version
        },
      },
      created_at: {
        header: 'Created At',
        get(row: Heroku.Build): null | string | undefined {
          return ago(new Date(row.created_at as string))
        },
      },
      duration: {
        header: 'Duration',
        get(row: Heroku.Build): null | string | undefined {
          return duration(new Date(row.created_at as string), new Date(row.updated_at as string))
        },
      },
      status: {
        header: 'Status',
        get(row: Heroku.Build): null | string | undefined {
          return statusColor(row.status)(row.status as string)
        },
      },
      user: {
        header: 'User',
        get(row: Heroku.Build): null | string | undefined {
          const email = row.user?.email?.replace(/@addons\.heroku\.com$/, '')
          return email ? color.magenta(email) : undefined
        },
      },
    }, {maxWidth: 'none'})
  }
}
