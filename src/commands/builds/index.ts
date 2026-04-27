import {Command, flags} from '@heroku-cli/command'
import * as Heroku from '@heroku-cli/schema'
import {hux} from '@heroku/heroku-cli-util'
import * as color from '@heroku/heroku-cli-util/color'

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
    hux.styledHeader(`${app} Builds`)
    hux.table<Heroku.Build>(builds, {
      created_at: {
        get(row: Heroku.Build): null | string | undefined {
          return ago(new Date(row.created_at as string))
        },
        header: 'Created At',
      },
      duration: {
        get(row: Heroku.Build): null | string | undefined {
          return duration(new Date(row.created_at as string), new Date(row.updated_at as string))
        },
        header: 'Duration',
      },
      id: {
        get(row: Heroku.Build): null | string | undefined {
          return row.id
        },
        header: 'ID',
      },
      sourceVersion: {
        get(row: Heroku.Build): null | string | undefined {
          return row.source_blob?.version
        },
        header: 'Source Version',
      },
      status: {
        get(row: Heroku.Build): null | string | undefined {
          return statusColor(row.status)(row.status as string)
        },
        header: 'Status',
      },
      user: {
        get(row: Heroku.Build): null | string | undefined {
          const email = row.user?.email?.replace(/@addons\.heroku\.com$/, '')
          return email ? color.magenta(email) : undefined
        },
        header: 'User',
      },
    }, {maxWidth: 'none'})
  }
}
