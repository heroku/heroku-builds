'use strict';

let cli       = require('heroku-cli-util');
let columnify = require('columnify');

module.exports = {
  topic: 'builds',
  needsAuth: true,
  needsApp: true,
  description: 'list builds',
  help: 'List builds for a Heroku app',
  run: cli.command(function (context, heroku) {
    return heroku.request({
       path: `/apps/${context.app}/builds`,
       method: 'GET',
       headers: {
        'Range': 'created_at ..; order=desc;'
      },
      parseJSON: true
    }).then(function (builds) {
      var columnData = builds.slice(0, 10).map(function(build) {
        return { created_at: build.created_at,
          status: build.status,
          version: build.source_blob.version,
          user: build.user.email
        };
      });

      // TODO: use `max` directive in query to avoid the slice nonsense
      // heroku-client currently breaks if one tries to do this
      var columns = columnify(columnData, {
        showHeaders: false
      });
      console.log(columns);
    });
  })
};
