/**
 * @memberof module:compressed-json
 * @function decompress
 * @param {Object} compressed
 */
'use strict'

/** @lends module:compressed-json.decompress */
function decompress (compressed) {
  if (!compressed) {
    return null
  }
  const { _: values, ...keyDict } = compressed
  const keyDictReversed =  {}
  for(const [k,v]of Object.entries(keyDict)){
    keyDictReversed[v] = k
  }
  const convert = (values) => {
    if (Array.isArray(values)) {
      return values.map((v) => convert(v))
    }
    if(values === null){
      return null
    }
    switch (typeof values) {
      case 'undefined':{
        return
      }
      case 'number':
        return values
      case 'string':
        return values
      case 'function':
        return null
      case 'object': {
        const decompressed = {}
        const shortKeys = Object.keys(values)
        for (const shortKey of shortKeys) {
          const value = values[shortKey]
          const key = keyDictReversed[shortKey]
          decompressed[key] = convert(value)
        }
        return decompressed
      }
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
