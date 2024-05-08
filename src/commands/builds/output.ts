import {Command, flags} from '@heroku-cli/command'
import {Args, ux} from '@oclif/core'

import {findByLatestOrId} from '../../lib/builds'

export default class Output extends Command {
  static args = {
    build: Args.string(),
  }

  static description = 'show build output. Omit BUILD to get latest build.\nShow build output for a Heroku app. Omit BUILD to get the output for the latest build.'
  static flags = {
    app: flags.app({required: true}),
    remote: flags.remote()
  }

  static topic = 'builds'

  public async run(): Promise<void> {
    const {flags, args} = await this.parse(Output)
    const {app} = flags
    const build = await findByLatestOrId(this.heroku, app, args.build)
    if (!build) {
      return ux.warn(`No build found for ${args.build || app}.`)
    }

    const {response: stream} = await this.heroku.stream(build.output_stream_url as string)
    return new Promise((resolve, reject) => {
      stream.on('error', reject)
      stream.on('end', resolve)
      stream.pipe(process.stdout)
    })
  }
}
