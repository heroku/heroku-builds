exports.topic = {
  name: 'builds',
  description: 'manage builds'
}

exports.commands = [
  require('./commands/builds/cache-purge'),
  require('./commands/builds/cancel'),
  require('./commands/builds/create'),
  require('./commands/builds/index'),
  require('./commands/builds/info'),
  require('./commands/builds/output')
]
