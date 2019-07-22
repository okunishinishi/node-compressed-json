/**
 * @module compressed-json
 */
'use strict'

const compress = require('./compress')
const decompress = require('./decompress')

/** @lends module:compressed-json */
const compressedJSON = { compress, decompress }

exports.compress = compress
exports.decompress = decompress

module.exports = compressedJSON
