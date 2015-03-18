'use strict';

let Heroku = require('heroku-client');
let archiver = require('archiver');
let request = require('request');
var fs = require('fs');
let uuid = require('node-uuid');
var os = require('os');

function uploadCwdToSource(app, cwd) {
    let tempFilePath = os.tmpdir() + uuid.v4() + '.tar.gz';

    return app.sources().create({})
	.then(function(source){
	    let archive = archiver('tar', { gzip: true });
	    archive.on('finish', function (err) {
		if (err) {
		    throw err;
		}
		let filesize = fs.statSync(tempFilePath).size;
		let request_options = {
		    url: source.source_blob.put_url,
		    headers: {
			'Content-Type': '',
			'Content-Length': filesize
		    }
		};

		fs.createReadStream(tempFilePath)
		    .pipe(request.put(request_options));
	    });
	    let output = fs.createWriteStream(tempFilePath);
	    archive.pipe(output);
	    // TODO: Don't add things that we don't want
	    // eg. `.git` and things in `.gitignore`
	    archive.directory(cwd, false).finalize();

	    return source.source_blob.get_url;
	});
    // TODO: Clean up tmp archive file
}

function create(context) {
    let heroku = new Heroku({ token: context.auth.password });
    let app = heroku.apps(context.app);

    var sourceUrl = context.args['source-url'];

    var sourceUrlPromise = sourceUrl ?
	new Promise(function(resolve) { resolve(sourceUrl);}) :
	uploadCwdToSource(app, context.cwd);

    sourceUrlPromise
	.then(function(sourceGetUrl) {
	    // TODO we have to bail out to `request` to get edge version
	    heroku.request({
		path: '/apps/' + context.app + '/builds',
		method: 'POST',
		headers: {
		    'Accept': 'application/vnd.heroku+json; version=edge'
		},
		parseJSON: true,
		body: {
		    source_blob: {
			url: sourceGetUrl,
			version: "" // TODO
		    }
		}
	    }).then(function(build) {
		request.get(build.stream_url).pipe(process.stderr);
	    }).done();
	});
}

module.exports = {
    topic: 'builds',
    command: 'create',
    needsAuth: true,
    needsApp: true,
    help: 'Create archive from current dir and build and release it to Heroku app',
    description: 'create build',
    flags: [],
    args: [
	{ name: 'source-url', optional: true }
    ],
    run: create
};
