exports.topics = [{
  name: 'build',
  description: 'tar up local dir and build and release to Heroku app'
}];

exports.commands = [
  require('./lib/commands/build')
];
