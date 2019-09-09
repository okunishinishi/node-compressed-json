/**
 * Test for index
 */
'use strict'

const index = require('../lib/index')
const { ok, equal, deepEqual } = require('assert').strict
const { describe, it } = require('mocha')

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
            ['Hey', 12, null]
          ]
        ],
        fff: {
          ggg: { hhh: 'hoge' }
        }
      },
      jjjj: void (0),
      hhh: 'hoge2',
      nnn: 'hoge',
      asdf: 'hoge',
      jjj: 'hoge',
      n: 'p:143243',
      j: 'e:3',
      d: new Date('2019/09/09'),
      d2: 'd:1567954800000'
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
    equal(
      new Date(restored.d) - new Date('2019/09/09'),
      0
    )
    equal(restored.d2, 'd:1567954800000')
  })

  it('Handle array', () => {
    const { compress, decompress } = index

    const restored =
      decompress(
        compress([{ a: 1, b: 2 }, { c: 3 }])
      )
    ok(Array.isArray(restored), restored)
  })

  it('Large Array', () => {
    const { compress } = index
    const arr = new Array(10000).fill(null).map((_, i) => ({
      index: i,
      name: `This is item-${i}`,
      text: 'x#123143243234324324242t343234234',
      text2: 'x#123213',
      $$entity: true,
    }))
    ok(JSON.stringify(arr).length > compress.toString(arr).length)
    const rate = compress.toString(arr).length / JSON.stringify(arr).length
    console.log('\n[Large Array] compress rage', rate)
  })

  it('Large Object', () => {
    const { compress } = index
    const obj = Object.assign({},
      ...new Array(10000).fill(null).map((_, i) => ({
        [`k-${i}`]: {
          index: i,
          name: `This is item-${i}`,
          text: 'x#123143243234324324242t343234234',
          text2: 'x#123213',
          $$entity: true,
        }
      }))
    )
    ok(JSON.stringify(obj).length > compress.toString(obj).length)
    const rate = compress.toString(obj).length / JSON.stringify(obj).length
    console.log('\n[Large Object] compress rage', rate)
  })

  it('Empty object', () => {
    const { compress, decompress } = index
    const compressed = compress({})
    ok(compressed)
    const decompressed = decompress(compressed)
    deepEqual(decompressed, {})
  })

  it('Tiny object', () => {
    const { compress, decompress } = index
    const obj = { aa: 1, bb: 2 }
    const compressed = compress(obj)
    ok(compressed)
    const decompressed = decompress(compressed)
    deepEqual(decompressed, obj)
    // ok(JSON.stringify(obj).length > compress.toString(obj).length)
    const rate = compress.toString(obj).length / JSON.stringify(obj).length
    console.log('\n[Tiny Object] compress rage', rate)
  })

  it('Using reserved', () => {
    const { compress, decompress } = index
    const reservedKeys = ['name', 'description']
    const reservedValues = ['yamada']
    const obj = [
      { name: 'yamada', description: 'This is yamada', version: 1 },
      { name: 'tanaka', description: 'This is tanaka', respects: 'suzuki', version: 1 },
      { name: 'suzuki', description: 'This is suzuki', respects: 'yamada', version: 3 },
    ]
    ok(obj)
    const compressed = compress(obj, { reservedKeys, reservedValues })
    deepEqual(compressed.K, ['version', 'respects'])
    deepEqual(compressed.P, ['suzuki'])
    ok(compressed)
    const decompressed = decompress(compressed, { reservedKeys, reservedValues })
    deepEqual(decompressed, obj)
    ok(JSON.stringify(obj).length > compress.toString(obj).length)
    const rate = compress.toString(obj).length / JSON.stringify(obj).length
    console.log('\n[Reserved Object] compress rage', rate)
  })

  it('Using bind', () => {
    const { bind } = index

    const { compress, decompress } = bind({
      reservedKeys: ['name', 'description'],
      reservedValues: ['yamada'],
    })
    const obj = [
      { name: 'yamada', description: 'This is yamada', version: 1 },
      { name: 'tanaka', description: 'This is tanaka', respects: 'suzuki', version: 1 },
      { name: 'suzuki', description: 'This is suzuki', respects: 'yamada', version: 3 },
    ]
    ok(obj)
    const compressed = compress(obj)
    deepEqual(compressed.K, ['version', 'respects'])
    deepEqual(compressed.P, ['suzuki'])
    ok(compressed)
    const decompressed = decompress(compressed)
    deepEqual(decompressed, obj)

    const onceString = decompress.fromString(
      compress.toString(obj)
    )
    deepEqual(onceString, obj)
  })

  it('With large keys', () => {
    const { decompress } = index
    const compressed = require('../misc/mocks/large-data')
    const { reservedKeys, reservedValues } = require('../misc/mocks/large-reserved')
    const decompressed = decompress(compressed, { reservedKeys, reservedValues })
    equal(decompressed.trail.beacons[0].type, 'home')
  })
})

/* global describe, it */
