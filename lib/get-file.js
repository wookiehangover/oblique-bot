'use strict'

let random = require('lodash/number/random')

module.exports = function getFile(usedStrategies, files) {
  let start = files.length <= 28 ? 0 : files.length - 28
  let end = files.length - 1

  return files[random(start, end)]
}
