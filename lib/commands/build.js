'use strict';

let Heroku = require('heroku-client');
let archiver = require('archiver');
let request = require('request');
var fs = require('fs');
let uuid = require('node-uuid');
var os = require('os');

module.exports = {
    topic: 'build',
    command: 'create',
    needsAuth: true,
    needsApp: true,
    help: `Archive current dir and build and release it to Heroku app`,
    flags: [
    ],
    args: [],
    run: function (context) {
	let heroku = new Heroku({ token: context.auth.password });
	let app = heroku.apps(context.app);	
	let tempFilePath = os.tmpdir() + uuid.v4() + '.tar.gz';

	app.sources().create({})
	    .then(function(source){
		let archive = archiver('tar', { gzip: true });
		archive.on('error', function(err) {
		    throw err;
		});
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
				url: source.source_blob.get_url,
				version: "" // TODO
			    }
			}
		    }).then(function(build) {
			request.get(build.stream_url).pipe(process.stderr);
		    }).done();
		});
		let output = fs.createWriteStream(tempFilePath);
		archive.pipe(output);
		// TODO: Don't add things that we don't want
		// eg. `.git` and things in `.gitignore`
		archive.directory(context.cwd, false).finalize();
	    }).done();
	// TODO: Clean up tmp archive file
    }
};
