import {APIClient} from '@heroku-cli/command'
import * as Heroku from '@heroku-cli/schema'

export async function findBuild(heroku: APIClient, app: string, search: (builds: Heroku.Build[]) => Heroku.Build): Promise<Heroku.Build | undefined> {
  const {body: builds} = await heroku.get<Heroku.Build[]>(`/apps/${app}/builds`, {
    partial: true,
    headers: {Range: 'created_at ..; max=10, order=desc'}
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

export function statusColor(status: Heroku.Build['status']) {
  switch (status) {
  case 'pending': {
    return 'yellow'
  }

  case 'failed': {
    return 'red'
  }

  case 'succeeded': {
    return 'green'
  }

  default: {
    return 'white'
  }
  }
}
