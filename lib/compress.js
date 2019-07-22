/**
 * @memberof module:compressed-json
 * @function compress
 * @param {Object} data
 */
'use strict'

const stringConverter = require('./converters/stringConverter')

/** @lends module:compressed-json.compress */
function compress (src) {
  const MIN_SHARE_STRING_LENGTH = 4
  const MAX_SHARE_STRING_LENGTH = 512
  const keysDict = {}
  const knownValuesDict = {}
  const sharedStrings = []
  const keys = []
  const wrappers = {}
  const shortKeyFor = (key) => {
    if (key in keysDict) {
      return keysDict[key]
    }
    const keyIndex = keys.length
    const shortKey = (keyIndex).toString(36)
    keysDict[key] = shortKey
    keys.push(key)
    return shortKey
  }
  const stringValueFor = (value, keyPath) => {
    const canBeShared = MIN_SHARE_STRING_LENGTH <= value.length &&
      value.length <= MAX_SHARE_STRING_LENGTH
    if (canBeShared) {
      if (value in knownValuesDict) {
        if(knownValuesDict[value].shared){
          return knownValuesDict[value].pointer
        }
        const index = sharedStrings.length
        sharedStrings.push(value)
        const pointer = stringConverter.toPointer(index)
        knownValuesDict[value].pointer = pointer
        knownValuesDict[value].shared = true
        return pointer
      }
    }
    knownValuesDict[value] = { keyPath, shared: false, pointer:null }
    return stringConverter.toEscaped(value)
  }
  const convert = (values, { keyPath = '' } = {}) => {
    if (Array.isArray(values)) {
      const arr = values.map((v, i) => convert(v, { keyPath: [keyPath, i].join('/') }))
      wrappers[keyPath] = arr
      return arr
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
          compressed[shortKey] = convert(value, { keyPath: [keyPath, shortKey].join('/') })
        }
        wrappers[keyPath] = compressed
        return compressed
      }
      case 'string':
        return stringValueFor(values, keyPath)
      default:
        return values
    }
  }
  const converted = convert(src)
  for(const {pointer, shared, keyPath} of Object.values(knownValuesDict)){
    if(shared){
      const keys = keyPath.split('/')
      const lastKey = keys.pop()
      const wrapper = wrappers[keys.join('/')]
      wrapper[lastKey] = pointer
    }
  }
  return {
    $: {
      K: keys,
      S: sharedStrings,
    },
    ...converted,
  }
}

compress.toString = function compressToString (data) {
  const compressed = compress(data)
  return JSON.stringify(compressed)
}

module.exports = compress