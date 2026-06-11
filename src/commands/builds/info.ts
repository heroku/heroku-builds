import {Command, flags} from '@heroku-cli/command'
import * as Heroku from '@heroku-cli/schema'
import {styledHeader, styledJSON, styledObject} from '@heroku/heroku-cli-util/hux'
import {Args} from '@oclif/core'
import {ux} from '@oclif/core/ux'

import {findByLatestOrId, statusColor} from '../../lib/builds.js'

export default class Info extends Command {
  static args = {
    build: Args.string(),
  }
  static description = 'view detailed information for a build'
  static flags = {
    app: flags.app({required: true}),
    json: flags.boolean({description: 'output in json format'}),
    remote: flags.remote(),
  }
  static topic = 'builds'

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(Info)
    const {app, json} = flags
    const build = await findByLatestOrId(this.heroku, app, args.build)
    if (!build) {
      return ux.warn(`No builds found for ${args.build || app}`)
    }

    if (json) {
      styledJSON(build)
    } else {
      const coloredId = statusColor(build.status)(build.id as string)
      styledHeader(`Build ${coloredId}`)
      const data = {
        By: build.user?.email,
        When: build.created_at,
        Status: build.status,
        Buildpacks: build.buildpacks?.map(e => e.url),
      } as Record<string, unknown>

      if (build.release) {
        const {body: release} = await this.heroku.get<Heroku.Release>(`/apps/${app}/releases/${build.release.id}`)
        data.Release = `v${release.version}`
      }

      styledObject(data)
    }
  }
}
