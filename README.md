# Heroku Builds

Heroku CLI plugin to list and create builds for Heroku apps.

## Use

### Installation

    heroku plugins:install heroku-builds

### List builds

Lists 10 most recently created builds for `example-app`

    heroku builds -a example-app

Optionally show more builds with the `-n` flag:

    heroku builds -n 50 -a example-app

### Build info

Show details of the latest build (status, buildpacks, date):

    heroku builds:info -a example-app

For details of a specific build, provide an ID:

    heroku builds:info <id> -a example-app

### Create build from local dir

    heroku builds:create -a example-app

Creates a `.tar.gz` archive from the current working directory, uploads the archive to Heroku and creates a build from the contents of the archive. Build output is streamed to `stderr`. Hitting ctrl+c will not cancel the build and release. The `.git` directory (if present) is excluded from the upload, as are items matching entries in the `.gitignore` file (if present).

You can pass an optional `--version` argument in lieu of a git commit messages. Example:

    heroku builds:create --version "added foo feature" -a example-app

### Create build from tarball URL

If you pass a `--source-url` argument to the `create` command, a build will be created from the contents of a tarball found at the URL. The current working directory contents is not used. Example:

    heroku builds:create --source-url https://github.com/heroku/node-js-sample/archive/master.tar.gz -a example-app

As above, build output is streamed to `stderr` and an optional `--version` argument is supported.

### Create build from local tarball

If you pass a `--source-tar` argument to the `create` command, a build will be created from the contents of a tarball found at the path given. The current working directory contents is not used. Example:

    heroku builds:create --source-tar master.tar.gz -a example-app

As above, build output is streamed to `stderr` and an optional `--version` argument is supported.

### Show build output

For the latest build output on an app, use either of the following:

    heroku builds:output -a example-app
    heroku builds:output current -a example-app

To view the output for a specific build:

    heroku builds -a example-app # take note of the build ID you'd want to display
    heroku builds:output <id> -a example-app

### Purge build cache

    heroku builds:cache:purge -a example-app

Clears the build cache, used by buildpacks to store information across builds

### Cancel build

    heroku builds -a example-app # take note of the build ID you'd want to display
    heroku builds:cancel <id> -a example-app

Cancels the build for build <id>

## Contributing

Contributions to the plugin are welcome. Report bugs and suggestions using GitHub Issues on the repository.

## FAQ

### How come archive -> build upload is not streamed?

A `Content-Size` header is required when uploading to pre-signed S3 urls, so we have to create the archive and figure out how big it is before upload can begin.
