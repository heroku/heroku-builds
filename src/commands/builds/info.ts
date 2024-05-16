import color from '@heroku-cli/color'
import {Command, flags} from '@heroku-cli/command'
import * as Heroku from '@heroku-cli/schema'
import {Args, ux} from '@oclif/core'

import {findByLatestOrId, statusColor} from '../../lib/builds'

export default class Info extends Command {
  static args = {
    build: Args.string(),
  }

  static description = 'view detailed information for a build'
  static flags = {
    json: flags.boolean({description: 'output in json format'}),
    app: flags.app({required: true}),
    remote: flags.remote()
  }

  static topic = 'builds'

  public async run(): Promise<void> {
    const {flags, args} = await this.parse(Info)
    const {app, json} = flags
    const build = await findByLatestOrId(this.heroku, app, args.build)
    if (!build) {
      return ux.warn(`No builds found for ${args.build || app}`)
    }

    if (json) {
      ux.styledJSON(build)
    } else {
      ux.styledHeader(`Build ${color[statusColor(build.status)](build.id)}`)
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

      ux.styledObject(data)
    }
  }
}
