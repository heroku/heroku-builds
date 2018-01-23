'use strict'

let FindBuild = function (heroku, app, search) {
  return heroku.request({
    path: `/apps/${app}/builds`,
    partial: true,
    headers: { 'Range': 'updated_at ..; max=10, order=desc' }
  }).then(search)
}

let FindByLatestOrId = function (heroku, app, build) {
  if (!build) {
    return FindBuild(heroku, app, (builds) => builds[0])
  } else {
    return heroku.get(`/apps/${app}/builds/${build}`)
  }
}

let StatusColor = function (s) {
  switch (s) {
    case 'pending':
      return 'yellow'
    case 'failed':
      return 'red'
    default:
      return 'white'
  }
}

module.exports = {
  FindBuild,
  FindByLatestOrId,
  StatusColor
}
