'use strict'

const expect = require('unexpected')
let cli = require('heroku-cli-util')

function exit (code, gen) {
  var actual
  return gen.catch(function (err) {
    expect(err, 'to be a', cli.exit.ErrorExit)
    actual = err.code
  }).then(function () {
    expect(actual, 'to equal', code)
  })
}

module.exports = exit
