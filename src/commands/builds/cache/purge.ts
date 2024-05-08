import {color} from '@heroku-cli/color'
import {Command, flags} from '@heroku-cli/command'
import {ux} from '@oclif/core'
import confirmCommand from '../../../lib/confirm-command'

import util = require('util')

const confirmMsg = 'WARNING: This will delete the build cache for %s.\nClearing your build cache can have unintended side effects, such as updating your language version if you don\'t explicitly specify one.'
export default class Purge extends Command {
  static description = 'purge the build cache for the specified app'
  static flags = {
    confirm: flags.string({char: 'c'}),
    app: flags.app({required: true}),
    remote: flags.remote(),
  }

  static topic = 'builds'

  public async run(): Promise<void> {
    const {flags} = await this.parse(Purge)
    const {app, confirm} = flags
    await confirmCommand(app, confirm, util.format(confirmMsg, color.magenta(app)))
    ux.action.start(`Purging build cache for ${color.magenta(app)}`)
    try {
      await this.heroku.delete(`/apps/${app}/build-cache`)
    } catch (error) {
      const {name} = error as Error
      // These occur with 202's from this endpoint for some reason.
      if (name !== 'JSONError') {
        throw error
      }
    }

    ux.action.stop()
  }
}
