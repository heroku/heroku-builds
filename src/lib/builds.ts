import {APIClient} from '@heroku-cli/command'
import * as Heroku from '@heroku-cli/schema'
import * as color from '@heroku/heroku-cli-util/color'

export async function findBuild(heroku: APIClient, app: string, search: (builds: Heroku.Build[]) => Heroku.Build): Promise<Heroku.Build | undefined> {
  const {body: builds} = await heroku.get<Heroku.Build[]>(`/apps/${app}/builds`, {
    headers: {Range: 'created_at ..; max=10, order=desc'},
    partial: true,
  })
  return search(builds)
}

export async function findByLatestOrId(heroku: APIClient, app: string, build: string | undefined): Promise<Heroku.Build | undefined> {
  if (!build) {
    return findBuild(heroku, app, builds => builds[0])
  }

  const {body} = await heroku.get<Required<Heroku.Build>>(`/apps/${app}/builds/${build}`)
  return body
}

export function statusColor(status: Heroku.Build['status']): (text: string) => string {
  switch (status) {
    case 'failed': {
      return color.failure
    }

    case 'pending': {
      return color.warning
    }

    case 'succeeded': {
      return color.success
    }

    default: {
      return (text: string) => text
    }
  }
}
