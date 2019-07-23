/**
 * @module compressed-json
 */
'use strict'

const compress = require('./compress')
const decompress = require('./decompress')
const bind = require('./bind')

/** @lends module:compressed-json */
const compressedJSON = { bind, compress, decompress }

exports.compress = compress
exports.bind = bind
exports.decompress = decompress

module.exports = compressedJSON
