# Base62.js
[![npm version](https://badge.fury.io/js/base62.svg)](https://badge.fury.io/js/base62)
[![CI](https://github.com/base62/base62.js/actions/workflows/ci.yml/badge.svg)](https://github.com/base62/base62.js/actions/workflows/ci.yml)
[![npm downloads](https://img.shields.io/npm/dm/base62.svg)](https://www.npmjs.com/package/base62)
[![license](https://img.shields.io/npm/l/base62.svg)](https://github.com/base62/base62.js/blob/main/LICENSE)

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

`encode` accepts non-negative integers up to `Number.MAX_SAFE_INTEGER`, or any non-negative BigInt. Anything else throws: negatives, fractions, `NaN`, `Infinity`, strings, and numbers above the safe range, which JavaScript can't represent exactly. If a large ID arrives as a string, convert it with `BigInt(str)` rather than `Number(str)`, since `Number` has already rounded it.

`decode` throws on an empty string, on any character outside the character set, and on results above `Number.MAX_SAFE_INTEGER` unless `{ bigint: true }` is passed:

```javascript
base62.decode("g7!");        // RangeError: Invalid character "!" in "g7!"
base62.decode("FfGNdXsE8");  // RangeError: "FfGNdXsE8" decodes above Number.MAX_SAFE_INTEGER, use { bigint: true }
```

Leading zeros are ignored, so `"0g7"` and `"g7"` both decode to 999. Pad with `encoded.padStart(n, "0")` if you need fixed-length output. Decoding with `{ bigint: true }` takes time quadratic in the input length, so cap the length of untrusted input before decoding it.


## Custom character sets

`create` returns an `encode`/`decode` pair for a character set of any length (at least 2 unique characters):

```javascript
var base62 = require("base62");
var codec = base62.create("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz");

codec.encode(999);  // "G7"
codec.decode("G7"); // 999
```

`setCharacterSet` changes the character set of the shared module instead, for every caller in the process, including other dependencies that use base62. It expects exactly 62 unique characters and replaces `base62.encode` and `base62.decode`, so references taken before the call keep the old character set. Prefer `create` in libraries.

```javascript
base62.setCharacterSet("~9876543210ABCDEFGHIJKLMNOPQRSTU$#@%!abcdefghijklmnopqrstuvw-=");

base62.encode(999);  // "F3"
base62.decode("F3"); // 999
```

Characters outside the Basic Multilingual Plane, such as emoji, count as one character each.


## Upgrading to 3.0

Version 3.0 adds the input checks above. Earlier versions returned wrong values without an error: `decode("g7 ")` gave 61922, `decode("!g7")` gave -56661, `encode(1.5)` gave `"undefined"`, and numbers past `Number.MAX_SAFE_INTEGER` lost precision. Version 3.0 also adds BigInt support and `create`, and requires Node 18 or later. Output for valid input in the safe range is unchanged from 1.x and 2.x.


## Development

Source code is hosted on [GitHub](http://github.com/base62/base62.js).
Please report issues or feature requests in
[GitHub Issues](https://github.com/base62/base62.js/issues).

 * Fork the project.
 * Make your feature addition or bug fix.
 * Add tests for it.
 * Send a pull request.


## License

MIT. Copyright (c) 2026 Andrew Nesbitt. See [LICENSE](https://github.com/base62/base62.js/blob/main/LICENSE) for details.
