import {color} from '@heroku-cli/color'
import {Command, flags} from '@heroku-cli/command'
import {Args, ux} from '@oclif/core'

import {findByLatestOrId} from '../../lib/builds'

export default class Cancel extends Command {
  static args = {
    build: Args.string(),
  }

  static description = 'cancel a running build\nStops executing a running build. Omit BUILD to cancel the latest build.'
  static flags = {
    app: flags.app({required: true}),
  }

  static topic = 'builds'

  public async run(): Promise<void> {
    const {flags, args} = await this.parse(Cancel)
    const {app} = flags
    const {build: buildId} = args
    const build = await findByLatestOrId(this.heroku, app, buildId)
    if (!build) {
      return ux.warn(`No build found for: ${buildId || app}`)
    }

    if (build.status !== 'pending') {
      return ux.error(`Can only cancel pending builds. Build ${build.id} has status '${build.status}'`)
    }

    ux.action.start(`Stopping build ${build.id}`)
    await this.heroku.delete(`/apps/${app}/builds/${build.id}`, {
      headers: {Accept: 'application/vnd.heroku+json; version=3.cancel-build'},
    })
    ux.action.stop()
  }
}
