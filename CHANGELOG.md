# Change Log

## [2.0.0](https://github.com/heroku/heroku-builds/compare/v1.0.10...v2.0.0) (2026-06-30)


### ⚠ BREAKING CHANGES

* migrate to ESM, oclif v4, dist build, and npm ([#252](https://github.com/heroku/heroku-builds/issues/252))

### Features

* migrate to ESM, oclif v4, dist build, and npm ([#252](https://github.com/heroku/heroku-builds/issues/252)) ([e155250](https://github.com/heroku/heroku-builds/commit/e15525036f8a6a5c61f87caec81c5b10f73f8f01))


### Bug Fixes

* address high security vulns reported by Dependabot ([#240](https://github.com/heroku/heroku-builds/issues/240)) ([40fefac](https://github.com/heroku/heroku-builds/commit/40fefaccb3b560b2188cc003db821f079f74a74b))
* Fix SyntaxError being thrown ([#192](https://github.com/heroku/heroku-builds/issues/192)) ([123a0fc](https://github.com/heroku/heroku-builds/commit/123a0fc06394e72a073782aeb8017e54cf8dccbc))
* ignore workflows-repo directory in eslint config ([#251](https://github.com/heroku/heroku-builds/issues/251)) ([f93edd6](https://github.com/heroku/heroku-builds/commit/f93edd66bdd64c32229a6914bbcf58d6aad14ded))
* update plugin to work with node 16 ([#157](https://github.com/heroku/heroku-builds/issues/157)) ([7483874](https://github.com/heroku/heroku-builds/commit/74838746aba7475767e7e3e228e5f5307d393ecb))


### Dependencies

* bump actions/checkout from 4 to 6 ([#246](https://github.com/heroku/heroku-builds/issues/246)) ([e9c2b46](https://github.com/heroku/heroku-builds/commit/e9c2b46c2b25ecc36e2579b5967451ab69ecb246))
* bump actions/setup-node from 4 to 6 ([#248](https://github.com/heroku/heroku-builds/issues/248)) ([9187e36](https://github.com/heroku/heroku-builds/commit/9187e366c966fe2c9e609c9be7e92f9d713af7c3))
* bump fast-xml-builder from 1.1.5 to 1.2.0 ([#256](https://github.com/heroku/heroku-builds/issues/256)) ([f5b5789](https://github.com/heroku/heroku-builds/commit/f5b57896d80ddcdb9eb1da49f69da05ac41f6bd4))
* bump tmp from 0.2.5 to 0.2.6 ([#259](https://github.com/heroku/heroku-builds/issues/259)) ([d36e213](https://github.com/heroku/heroku-builds/commit/d36e2135a7048d0b775df505c12076486dde4974))
* bump tmp from 0.2.6 to 0.2.7 ([#261](https://github.com/heroku/heroku-builds/issues/261)) ([976975c](https://github.com/heroku/heroku-builds/commit/976975c63cea6a2cf6bccc851d8c5510d60ff64a))
* update dependencies and dependabot.yml ([#245](https://github.com/heroku/heroku-builds/issues/245)) ([42327be](https://github.com/heroku/heroku-builds/commit/42327bea568e8b862b08e79edd82ba81e7b1247e))


### Miscellaneous Chores

* release 1.0.10  ([b7a2900](https://github.com/heroku/heroku-builds/commit/b7a2900252af00d90f4e6db865da663958241263))
* release 2.0.0 ([#270](https://github.com/heroku/heroku-builds/issues/270)) ([ecf7a58](https://github.com/heroku/heroku-builds/commit/ecf7a585816a539386992c37442734653e657512))

## [1.0.10](https://github.com/heroku/heroku-builds/compare/heroku-builds-v1.0.8...heroku-builds-v1.0.10) (2026-04-22)


### Bug Fixes

* address high security vulns reported by Dependabot ([#240](https://github.com/heroku/heroku-builds/issues/240)) ([40fefac](https://github.com/heroku/heroku-builds/commit/40fefaccb3b560b2188cc003db821f079f74a74b))
* Fix SyntaxError being thrown ([#192](https://github.com/heroku/heroku-builds/issues/192)) ([123a0fc](https://github.com/heroku/heroku-builds/commit/123a0fc06394e72a073782aeb8017e54cf8dccbc))
* ignore workflows-repo directory in eslint config ([#251](https://github.com/heroku/heroku-builds/issues/251)) ([f93edd6](https://github.com/heroku/heroku-builds/commit/f93edd66bdd64c32229a6914bbcf58d6aad14ded))
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
