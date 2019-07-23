/**
 * @memberof module:compressed-json
 * @function compress
 * @param {Object} data
 * @param {Object} [options={}] - Optional settings
 */
'use strict'

const stringConverter = require('./converters/stringConverter')

/** @lends module:compressed-json.compress */
function compress (src, options = {}) {
  const {
    reservedKeys = [],
    reservedValues = [],
  } = options
  const MIN_SHARE_STRING_LENGTH = 4
  const MAX_SHARE_STRING_LENGTH = 512
  const keysDict = {}
  const knownValuesDict = {}
  const pointers = []
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
  reservedKeys.forEach(reservedKey=> shortKeyFor(reservedKey))
  const stringValueFor = (value, keyPath) => {
    const canBeShared = MIN_SHARE_STRING_LENGTH <= value.length &&
      value.length <= MAX_SHARE_STRING_LENGTH
    if (canBeShared) {
      if (value in knownValuesDict) {
        if (knownValuesDict[value].shared) {
          return knownValuesDict[value].pointer
        }
        const index = pointers.length
        pointers.push(value)
        const pointer = stringConverter.toPointer(index)
        knownValuesDict[value].pointer = pointer
        knownValuesDict[value].shared = true
        return pointer
      }
    }
    knownValuesDict[value] = { keyPath, shared: false, pointer: null }
    return stringConverter.toEscaped(value)
  }
  reservedValues.forEach(reservedValue => stringValueFor(reservedValue))
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
        if (values instanceof Date) {
          return values.toJSON()
        }
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
  for (const { pointer, shared, keyPath } of Object.values(knownValuesDict)) {
    if (shared && keyPath) {
      const keys = keyPath.split('/')
      const lastKey = keys.pop()
      const wrapper = wrappers[keys.join('/')]
      wrapper[lastKey] = pointer
    }
  }
  const K = keys.slice(reservedKeys.length)
  const P = pointers.slice(reservedValues.length)
  return {
    ...(K.length > 0) ? { K } : {},
    ...(P.length > 0 ? { P } : {}),
    _: converted,
  }
}

compress.toString = function compressToString (data, options={}) {
  const compressed = compress(data, options)
  return JSON.stringify(compressed)
}

module.exports = compress
