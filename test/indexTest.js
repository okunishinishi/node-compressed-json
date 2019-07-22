/**
 * Test for index
 */
'use strict'

const index = require('../lib/index')
const { ok, equal } = require('assert').strict

describe('index', () => {
  it('compress/decompress', () => {
    const { compress, decompress } = index
    ok(compress)
    ok(decompress)

    const compressed = compress({
      aaa: 1,
      bbb: 'str',
      ccc: null,
      ddd: {
        eee: [
          [
            ['Hey',12, null]
          ]
        ],
        fff: {
          ggg: { hhh: 'hoge' }
        }
      },
      jjjj: void (0),
      hhh:'hoge2',
      nnn:'hoge',
      asdf:'hoge',
      jjj:'hoge',
      n: 'p:143243',
      j: 'e:3'
    })
    ok(compressed)
    const restored = decompress(compressed)
    ok(restored)
    equal(restored.aaa, 1)
    equal(restored.bbb, 'str')
    equal(restored.ccc, null)
    ok(Array.isArray(restored.ddd.eee))
    ok(Array.isArray(restored.ddd.eee[0]))
    ok(Array.isArray(restored.ddd.eee[0][0]))
    equal(restored.ddd.eee[0][0][0], 'Hey')
    equal(restored.ddd.eee[0][0][1], 12)
    equal(restored.ddd.fff.ggg.hhh, 'hoge')
    equal(restored.jjj, 'hoge')
    equal(restored.nnn, 'hoge')
    equal(restored.n, 'p:143243')
    equal(restored.j, 'e:3')
  })

  it('Shrink with large data', () => {
    const { compress } = index
    const arr = new Array(10000).fill(null).map((_, i) => ({
      index: i,
      name: `This is item-${i}`,
      text:'x#123143243234324324242t343234234',
      text2:'x#123213',
      $$entity: true,
    }))
    ok(JSON.stringify(arr).length > compress.toString(arr).length)
    const rate = compress.toString(arr).length / JSON.stringify(arr).length
    console.log('compress rage',rate)
  })
})

/* global describe, it */
