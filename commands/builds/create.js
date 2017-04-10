'use strict'

let cli = require('heroku-cli-util')
let fs = require('fs')
let uuid = require('node-uuid')
let os = require('os')
let path = require('path')
let request = require('request')
let exec = require('child_process').execSync
let nodeTar = require('../../lib/node_tar')

function compressSource (tar, cwd, tempFile, cb) {
  let tarVersion = exec(tar + ' --version').toString()

  if (tarVersion.match(/GNU tar/)) {
    exec(tar + ' cz -C ' + cwd + ' --exclude .git --exclude .gitmodules . --exclude-vcs-ignores > ' + tempFile)
    cb()
  } else {
    cli.warn('Couldn\'t detect GNU tar. Builds could fail due to decompression errors')
    cli.warn('See https://devcenter.heroku.com/articles/platform-api-deploying-slugs#create-slug-archive')
    cli.warn('Please install it, or specify the \'--tar\' option')
    cli.warn('Falling back to node\'s built-in compressor')
    nodeTar.call(cwd, tempFile, cb)
  }
}

function uploadCwdToSource (app, cwd, tar, fn) {
  let tempFilePath = path.join(os.tmpdir(), uuid.v4() + '.tar.gz')

  app.sources().create({}).then(function (source) {
    compressSource(tar, cwd, tempFilePath, function () {
      let requestOptions = {
        url: source.source_blob.put_url,
        headers: {
          'Content-Type': '',
          'Content-Length': fs.statSync(tempFilePath).size
        }
      }

      var stream = fs.createReadStream(tempFilePath)
      stream.on('close', function () {
        fs.unlink(tempFilePath)
      })

      stream.pipe(request.put(requestOptions, function () {
        fn(source.source_blob.get_url)
      }))
    })
  })
}

function create (context, heroku) {
  let app = heroku.apps(context.app)

  var sourceUrl = context.flags['source-url']
  var tar = context.flags['tar'] || 'tar'

  var sourceUrlPromise = sourceUrl
    ? new Promise(function (resolve) { resolve(sourceUrl) })
    : new Promise(function (resolve) { uploadCwdToSource(app, context.cwd, tar, resolve) })

  return sourceUrlPromise.then(function (sourceGetUrl) {
    return app.builds().create({
      source_blob: {
        url: sourceGetUrl,
        // TODO provide better default, eg. archive md5
        version: context.flags.version || ''
      }
    })
  })
  .then(function (build) {
    request.get(build.output_stream_url).pipe(process.stderr)
  })
}

module.exports = {
  topic: 'builds',
  command: 'create',
  needsAuth: true,
  needsApp: true,
  help: 'Create build from contents of current dir',
  description: 'create build',
  flags: [
    { name: 'source-url', description: 'Source URL that points to the tarball of your application\'s source code', hasValue: true },
    { name: 'tar', description: 'Path to the executable GNU tar', hasValue: true },
    { name: 'version', description: 'Description of your new build', hasValue: true }
  ],
  run: cli.command(create)
}
