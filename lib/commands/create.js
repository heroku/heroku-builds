'use strict';

let archiver = require('archiver');
let fs = require('fs');
let Heroku = require('heroku-client');
let ignore = require('ignore');
let uuid = require('node-uuid');
let os = require('os');
let path = require('path');
let request = require('request');

function uploadCwdToSource(app, cwd, fn) {
  let tempFilePath = path.join(os.tmpdir(), uuid.v4() + '.tar.gz');
  let ig = ignore().addIgnoreFile('.gitignore');
  let filter = ig.createFilter();

  app.sources().create({}).then(function(source){
    let archive = archiver('tar', { gzip: true });

    archive.on('finish', function (err) {
      if (err) { throw err; }

      let filesize = fs.statSync(tempFilePath).size;
      let request_options = {
        url: source.source_blob.put_url,
        headers: {
         'Content-Type': '',
         'Content-Length': filesize
        }
      };

      var stream = fs.createReadStream(tempFilePath);
      stream.on('close', function() {
        fs.unlink(tempFilePath);
      });

      stream.pipe(request.put(request_options, function() {
        fn(source.source_blob.get_url);
      }));
    });

    let output = fs.createWriteStream(tempFilePath);
    archive.pipe(output);
    var data = {};
    if (os.platform() == 'win32') {
      data.mode = 0o0755;
    }
    archive.bulk([
      { expand: true,
        cwd: cwd,
        src: ['**'],
        dest: false,
        filter: filter,
        data: data
      }
    ]).finalize();
  });
}

function create(context) {
  let heroku = new Heroku({ token: context.auth.password });
  let app = heroku.apps(context.app);

  var sourceUrl = context.args['source-url'];

  var sourceUrlPromise = sourceUrl ?
      new Promise(function(resolve) { resolve(sourceUrl);}) :
      new Promise(function(resolve) { uploadCwdToSource(app, context.cwd, resolve); });

  sourceUrlPromise.then(function(sourceGetUrl) {
    // TODO we have to bail out to `request` to get edge version
    heroku.request({
      path: `/apps/${context.app}/builds`,
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.heroku+json; version=3.streaming-build-output'
      },
      parseJSON: true,
      body: {
        source_blob: {
          url: sourceGetUrl,
          // TODO provide better default, eg. archive md5
          version: context.args.version || ''
        }
      }
    }).then(function(build) {
      request.get(build.output_stream_url).pipe(process.stderr);
    }).done();
  });
}

module.exports = {
  topic: 'builds',
  command: 'create',
  needsAuth: true,
  needsApp: true,
  help: 'Create build from contents of current dir',
  description: 'create build',
  flags: [
    { name: 'source-url', description: 'Source URL that points to the tarball of your application\'s source code', hasValue: true},
    { name: 'version', description: 'Description of your new build', hasValue: true }
  ],
  run: create
};
