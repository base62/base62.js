# Base62.js
[![npm version](https://badge.fury.io/js/base62.svg)](http://badge.fury.io/js/base62)
[![CI](https://github.com/base62/base62.js/actions/workflows/ci.yml/badge.svg)](https://github.com/base62/base62.js/actions/workflows/ci.yml)
[![npm downloads](https://img.shields.io/npm/dm/base62.svg)](https://www.npmjs.com/package/base62)
[![license](https://img.shields.io/npm/l/base62.svg)](https://github.com/base62/base62.js/blob/master/LICENSE)

A JavaScript Base62 encode/decoder.

Base62 encoding converts numbers to ASCII strings (0-9, a-z and A-Z) and vice
versa, which typically results in comparatively short strings. Such identifiers
also tend to be more readily identifiable by humans.

* `999` -> `"g7"`
* `9999` -> `"2Bh"`
* `238327` -> `"ZZZ"`


## Installation

```shell
npm install base62
```


## Usage

```javascript
var base62 = require("base62");

base62.encode(999);  // "g7"
base62.decode("g7"); // 999
```

Both `encode` and `decode` support BigInt for values beyond `Number.MAX_SAFE_INTEGER`:

```javascript
base62.encode(9007199254740993n);                // "FfGNdXsE9"
base62.decode("FfGNdXsE9", { bigint: true });    // 9007199254740993n
```

You can also use a custom character set:

```javascript
var base62 = require("base62");

base62.setCharacterSet("~9876543210ABCDEFGHIJKLMNOPQRSTU$#@%!abcdefghijklmnopqrstuvw-=");

base62.encode(999);  // "F3"
base62.decode("F3"); // 999
```

`setCharacterSet` expects a string containing exactly 62 unique characters.


## Development

Source code is hosted on [GitHub](http://github.com/base62/base62.js).
Please report issues or feature requests in
[GitHub Issues](https://github.com/base62/base62.js/issues).

 * Fork the project.
 * Make your feature addition or bug fix.
 * Add tests for it.
 * Send a pull request.


## License

MIT. Copyright (c) 2026 Andrew Nesbitt. See [LICENSE](https://github.com/base62/base62.js/blob/master/LICENSE) for details.
