/**
 * @memberof module:compressed-json
 * @function decompress
 * @param {Object} compressed
 */
'use strict'

const stringConverter = require('./converters/stringConverter')

/** @lends module:compressed-json.decompress */
function decompress (compressed) {
  if (!compressed) {
    return null
  }
  const { K: keys = [], P: pointers = [], _: values } = compressed
  const stringValueFor = (value) => {
    if (stringConverter.isPointer(value)) {
      const index = stringConverter.fromPointer(value)
      return pointers[index]
    }
    return stringConverter.fromEscaped(value)
  }
  const convert = (values, { keyPath = '' } = {}) => {
    if (Array.isArray(values)) {
      return values.map((v, i) => convert(v, { keyPath: [keyPath, i].join('/') }))
    }
    if (values === null) {
      return null
    }
    switch (typeof values) {
      case 'undefined': {
        return
      }
      case 'function':
        return null
      case 'object': {
        const decompressed = {}
        const shortKeys = Object.keys(values)
        for (const shortKey of shortKeys) {
          const value = values[shortKey]
          const key = keys[parseInt(shortKey, 36)]
          decompressed[key] = convert(value, { keyPath: [keyPath, shortKey].join('/') })
        }
        return decompressed
      }
      case 'string':
        return stringValueFor(values, keyPath)
      default:
        return values
    }
  }
  return convert(values)
}

decompress.fromString = function decompressFromString (compressedString) {
  return decompress(JSON.parse(compressedString))
}

module.exports = decompress
