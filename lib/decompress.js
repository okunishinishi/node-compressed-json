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
  const { $ = {}, ...values } = compressed
  const {K:keyDictString = ''} = $
  const keyDict = Object.assign({},
    ...keyDictString.split('&').map(kv => {
      const [k,v] = kv.split('=')
      return {[k]:v}
    })
  )
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
      case 'function':
        return null
      case 'object': {
        const decompressed = {}
        const shortKeys = Object.keys(values)
        for (const shortKey of shortKeys) {
          const value = values[shortKey]
          const key = keyDict[shortKey]
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
