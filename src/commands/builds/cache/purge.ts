import {Command, flags} from '@heroku-cli/command'
import * as color from '@heroku/heroku-cli-util/color'
import {ux} from '@oclif/core/ux'
import {format} from 'node:util'

import confirmCommand from '../../../lib/confirm-command.js'

// eslint-disable-next-line @stylistic/max-len
const confirmMsg = 'WARNING: This will delete the build cache for %s.\nClearing your build cache can have unintended side effects, such as updating your language version if you don\'t explicitly specify one.'
export default class Purge extends Command {
  static description = 'purge the build cache for the specified app'
  static flags = {
    app: flags.app({required: true}),
    confirm: flags.string({char: 'c'}),
    remote: flags.remote(),
  }
  static topic = 'builds'

  public async run(): Promise<void> {
    const {flags} = await this.parse(Purge)
    const {app, confirm} = flags
    await confirmCommand(app, confirm, format(confirmMsg, color.magenta(app)))
    ux.action.start(`Purging build cache for ${color.magenta(app)}`)
    try {
      await this.heroku.delete(`/apps/${app}/build-cache`)
    } catch (error) {
      const {name} = error as Error
      if (name !== 'SyntaxError') {
        throw error
      }
    }

    ux.action.stop()
  }
}
