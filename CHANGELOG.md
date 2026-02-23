# Change Log

## [1.0.10](https://github.com/heroku/heroku-builds/compare/heroku-builds-v1.0.8...heroku-builds-v1.0.10) (2026-02-23)


### Bug Fixes

* Fix SyntaxError being thrown ([#192](https://github.com/heroku/heroku-builds/issues/192)) ([123a0fc](https://github.com/heroku/heroku-builds/commit/123a0fc06394e72a073782aeb8017e54cf8dccbc))
* update plugin to work with node 16 ([#157](https://github.com/heroku/heroku-builds/issues/157)) ([7483874](https://github.com/heroku/heroku-builds/commit/74838746aba7475767e7e3e228e5f5307d393ecb))


### Miscellaneous Chores

* release 1.0.10  ([b7a2900](https://github.com/heroku/heroku-builds/commit/b7a2900252af00d90f4e6db865da663958241263))

## 0.0.11 - 2015-08-06

- Use main version of Heroku API

## 0.0.10 - 2015-07-10

- Modify builds to display the build id
- Add builds:output <id> command

## 0.0.9 - 2015-06-15

- Use `heroku-cli-util`
- Stylistic changes

## 0.0.8 - 2015-04-29

### Fixed

- Include `dot` folders in the tar package.

## 0.0.7 - 2015-04-27

### Fixed

- Tar up everything in the folder recursivenly.

## 0.0.6 - 2015-04-22

### Changed

- Respect .gitignore
- Don't include .git folder when tarring up.
