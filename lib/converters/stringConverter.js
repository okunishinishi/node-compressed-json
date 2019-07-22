/**
 * @memberof module:compressed-json.converters
 * @namespace stringConverter
 */
'use strict'

const Prefixes = require('../constants/Prefixes')

const PrefixValues = Object.values(Prefixes)

/** @lends module:compressed-json.converters.stringConverter */
const stringConverter = {
  toPointer: (index) => Prefixes.POINTER_PREFIX + (index).toString(36),
  toEscaped: (raw) => {
    const needsEscape = PrefixValues.some((v) => raw.startsWith(v))
    return needsEscape ? Prefixes.ESCAPED_PREFIX + raw : raw
  },
  fromEscaped: (escaped) => {
    const needsRestore = escaped.startsWith(Prefixes.ESCAPED_PREFIX)
    return needsRestore ? escaped.slice(Prefixes.ESCAPED_PREFIX.length) : escaped
  },
  fromPointer: (pointer) => {
    return pointer.slice(Prefixes.POINTER_PREFIX.length)
  },
  isPointer: (value) => {
    return value.startsWith(Prefixes.POINTER_PREFIX)
  }
}

module.exports = stringConverter
