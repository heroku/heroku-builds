exports.topics = [{
  name: 'builds',
  description: 'manage builds'
}];

exports.commands = [
  require('./lib/commands/build')
    require('./lib/commands/index')
];
