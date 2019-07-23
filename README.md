# compressed-json

JSON key compressor

## Install

```bash
npm i compressed-json
```

## Usage

```js
'use strict'

const cjson = require('compressed-json')

// Convert json object
const compressed = cjson.compress({ /* Large json */ })
const restored = cjson.decompress(compressed)

// Convert json string

const compressedString = cjson.compress.toString({ /* Some large json */ })
const restoredFromString = cjson.decompress.fromString(compressedString)

```

## How It Works

compressed-json has two logics:

* [Key-Compression](#key-compression-logic)
* [String-Value-Pointing](#string-value-pointing-logic)

### Example compression

**example-src.json**

```json
{
  "description": "This is example json",
  "entities": [
    {
      "id": 1,
      "name": "Dog",
      "desc": "This is desc of dog",
      "tag": ["animal"]
    },
    {
      "id": 1,
      "name": "Cat",
      "desc": "This is desc of cat",
      "tag": ["animal"]
    }
  ],
  "notes": [
    "Unique string will be kept as is",
    "Duplicated string will be combined",
    "Duplicated string will be combined",
    "p: string start with 'p:' will be escaped "
  ]
}

```

**example-compressed.json**

```json
{
  "_": {
    "0": "This is example json",
    "1": [
      {
        "2": 1,
        "3": "Dog",
        "4": "This is desc of dog",
        "5": [
          "p:0"
        ]
      },
      {
        "2": 1,
        "3": "Cat",
        "4": "This is desc of cat",
        "5": [
          "p:0"
        ]
      }
    ],
    "6": [
      "Unique string will be kept as is",
      "p:1",
      "p:1",
      "e:p: string start with 'p:' will be escaped "
    ]
  },
  "K": [
    "description",
    "entities",
    "id",
    "name",
    "desc",
    "tag",
    "notes"
  ],
  "P": [
    "animal",
    "Duplicated string will be combined"
  ]
}
```

### Structure of compressed json

| Key | Description |
| --- | ----------- |
| `K` | Array of original keys |
| `P` | Pointed string values |
| `_` | Compressed payload |


<a name="key-compression-logic"/>
### Key-Compression logic

All object keys are replaced with index of array stored in `K` of compressed JSON.

<a name="string-value-pointing-logic" />
### String-Value-Pointing

String values appeared at least two will replaced with pointer string with contains index of array stored in `P` of compressed JSON.
