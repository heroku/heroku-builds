import {Command, flags} from '@heroku-cli/command'
import * as Heroku from '@heroku-cli/schema'
import {hux} from '@heroku/heroku-cli-util'
import * as color from '@heroku/heroku-cli-util/color'
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
      ux.stdout(ux.colorizeJson(build))
    } else {
      const statusFn = color[statusColor(build.status) as keyof typeof color] as ((s: string) => string) | undefined
      const coloredId = statusFn ? statusFn(build.id as string) : build.id
      hux.styledHeader(`Build ${coloredId}`)
      const data = {
        Buildpacks: build.buildpacks?.map(e => e.url),
        By: build.user?.email,
        Status: build.status,
        When: build.created_at,
      } as Record<string, unknown>

      if (build.release) {
        const {body: release} = await this.heroku.get<Heroku.Release>(`/apps/${app}/releases/${build.release.id}`)
        data.Release = `v${release.version}`
      }

      hux.styledObject(data)
    }
  }
}
