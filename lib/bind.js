/**
 * @memberof module:compressed-json
 * @function bind
 * @param {Object} config
 * @param {string[]} [config.reservedKeys=[]] - reservedKeys to bind
 * @param {string[]} [config.reservedValues=[]] - reservedValues to bind
 */
'use strict'

const compress = require('./compress')
const decompress = require('./decompress')

/** @lends module:compressed-json.bind */
function bind(config={}){
  const {
    reservedKeys = [],
    reservedValues = [],
  } = config

  const boundCompress = (src) => compress(src, {reservedKeys, reservedValues})
  boundCompress.toString = (compressed) => JSON.stringify(boundCompress(compressed))
  const boundDecompress = (src) => decompress(src, {reservedKeys, reservedValues})
  boundDecompress.fromString = (compressedString) => boundDecompress(JSON.parse(compressedString))
  return {
    compress: boundCompress,
    decompress: boundDecompress,
  }
}

module.exports = bind
