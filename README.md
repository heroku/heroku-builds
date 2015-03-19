# Heroku Builds

Heroku CLI plugin to list and create builds for Heroku apps.

# Installation

    heroku plugins:install heroku-builds

### List builds

    heroku builds -a example-app

Lists 10 most recently created apps for `example-app`

### Create build from local dir

    heroku builds:create -a example-app

Creates a `.tar.gz` archive from the current working directory, uploads the archive to Heroku and creates a build from the contents of the archive. Build output is streamed to `stderr`. Hitting ctrl+c will not cancel the build and release. Currently the entire contents of the directory is added to the archive, including `.git`. Items matching `.gitignore` or not excluded.

You can pass an optional `--version` argument in lieu of a git commit messages. Example:

    heroku builds:create --version "added foo feature" -a example-app

### Create build from tarball URL

If you pass a `--source-url` argument to the `create` command, a build will be created from the contents of a tarball found at the URL. The current working directory contents is not used. Example:

    builds:create --source-url https://github.com/heroku/node-js-sample/archive/master.tar.gz -a example-app

As above, build output is streamed to `stderr` and an optional `--version` argument is supported.

# Contributing

Contributions to the plugin are welcome. Report bugs and suggestions using GitHub Issues on this repository.

# FAQ

### How come archive -> build upload is not streamed?

A `Content-Size` header is required when uploading to pre-signed S3 urls, so we have to create the archive and figure out how big it is before upload can begin.
