/**
 * @memberof module:compressed-json
 * @function compress
 * @param {Object} data
 */
'use strict'

/** @lends module:compressed-json.compress */
function compress (src) {
  const keyDict = {}
  let keyNumber = 0
  const shortKeyFor = (key) => {
    if (key in keyDict) {
      return keyDict[key]
    }
    const shortKey = (keyNumber).toString(36)
    keyDict[key] = shortKey
    keyNumber += 1
    return shortKey
  }
  const convert = (values) => {
    if (Array.isArray(values)) {
      return values.map((v) => convert(v))
    }
    if (values === null) {
      return null
    }
    const type = typeof values
    switch (type) {
      case 'function':
        return null
      case 'object': {
        const compressed = {}
        const keys = Object.keys(values)
        for (const key of keys) {
          const value = values[key]
          const shortKey = shortKeyFor(key)
          compressed[shortKey] = convert(value)
        }
        return compressed
      }
      default:
        return values
    }
  }
  const converted = convert(src)
  return {
    $:{
      K: Object.entries(keyDict).map((kv) => kv.reverse().join('=')).join('&')
    },
    ...converted,
  }
}

compress.toString = function compressToString (data) {
  const compressed = compress(data)
  return JSON.stringify(compressed)
}

module.exports = compress
