'use strict'

function ago (since) {
  const strftime = require('strftime')
  let elapsed = Math.floor((new Date() - since) / 1000)
  let message = strftime('%Y/%m/%d %H:%M:%S %z', since)
  if (elapsed < 60) return `${message} (~ ${Math.floor(elapsed)}s ago)`
  else if (elapsed < 60 * 60) return `${message} (~ ${Math.floor(elapsed / 60)}m ago)`
  else if (elapsed < 60 * 60 * 25) return `${message} (~ ${Math.floor(elapsed / 60 / 60)}h ago)`
  else return message
}

module.exports = {
  ago
}
