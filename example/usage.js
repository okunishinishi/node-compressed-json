'use strict'

const cjson = require('compressed-json')

// Convert json object
const compressed = cjson.compress({ /* Large json */ })
const restored = cjson.decompress(compressed)

// Convert json string
const compressedString = cjson.compress.toString({ /* Some large json */ })
const restoredFromString = cjson.decompress.fromString(compressedString)
