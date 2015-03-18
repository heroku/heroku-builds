exports.topics = [{
  name: 'builds',
  description: 'manage builds'
}];

exports.commands = [
    require('./lib/commands/create'),
    require('./lib/commands/index')
];
