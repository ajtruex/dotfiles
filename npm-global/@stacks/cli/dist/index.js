
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./cli.cjs.production.min.js')
} else {
  module.exports = require('./cli.cjs.development.js')
}
