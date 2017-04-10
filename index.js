exports.topic = {
  name: 'builds',
  description: 'manage builds'
}

exports.commands = [
  require('./commands/builds/create'),
  require('./commands/builds/index'),
  require('./commands/builds/output')
]
