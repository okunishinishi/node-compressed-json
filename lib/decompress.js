
'use strict'

const stringConverter = require('./converters/stringConverter')
const RADIX = 36

/**
 * @memberof module:compressed-json
 * @function decompress
 * @param {Object} compressed
 * @param {Object} [options={}] - Optional settings
 */
function decompress (compressed, options = {}) {
  const {
    reservedKeys = [],
    reservedValues = [],
  } = options
  if (!compressed) {
    return null
  }
  const { K = [], P = [], _: values } = compressed
  const keys = [...reservedKeys, ...K]
  const pointers = [...reservedValues, ...P]
  const stringValueFor = (value) => {
    if (stringConverter.isPointer(value)) {
      const index = parseInt(stringConverter.fromPointer(value), RADIX)
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
          const key = keys[parseInt(shortKey, RADIX)]
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

decompress.fromString = function decompressFromString (compressedString,options={}) {
  return decompress(JSON.parse(compressedString),options)
}

module.exports = decompress
