# [Base62.js](http://libraries.io/npm/base62)
[![build status](https://secure.travis-ci.org/base62/base62.js.svg)](http://travis-ci.org/base62/base62.js)
[![npm version](https://badge.fury.io/js/base62.svg)](http://badge.fury.io/js/base62)
[![devDependency Status](https://david-dm.org/base62/base62.js/dev-status.svg?theme=shields.io)](https://david-dm.org/base62/base62.js#info=devDependencies)
[![Gitter chat](http://img.shields.io/badge/gitter-base62/base62.js-brightgreen.svg)](https://gitter.im/base62/base62.js)

A JavaScript Base62 encode/decoder


## What is Base62 encoding?

Base62 encoding converts numbers to ASCII strings (0-9, a-z and A-Z) and vice
versa, which typically results in comparatively short strings. Such identifiers
also tend to more readily identifiable by humans.

* `999` ≙ `"g7"`
* `9999` ≙ `"2Bh"`
* `238327` ≙ `"ZZZ"`


## Installation

```shell
npm install base62
```

alternatively using Yarn:

```shell
yarn add base62
```


## Usage

For backwards compatibility, Base62.js exposes v1.x's API by default – see
[Legacy API](#legacy-api) below. For efficiency, v2.x's modernized API allows
selectively importing individual modules instead:

```javascript
var base62 = require("base62/lib/ascii");

base62.encode(999);  // "g7"
base62.decode("g7"); // 999
```

This uses the default **ASCII character set** for encoding/decoding.

It's also possible to define a **custom character set** instead:

```javascript
var base62 = require("base62/lib/custom");

var charset = "~9876543210ABCDEFGHIJKLMNOPQRSTU$#@%!abcdefghijklmnopqrstuvw-=";
charset = base62.indexCharset(charset);

base62.encode(999, charset);  // "F3"
base62.decode("F3", charset); // 999
```

Note that `indexCharset` typically expects the respective string to contain
exactly 62 unique character, but does not validate this for efficieny. In fact,
it's also possible to use characters sets with more than 62 characters in order
to achieve shorter identifiers for large numbers.


### Legacy API

Base62.js v1.x's API is maintained for backwards compatibility.

```javascript
var base62 = require("base62");

base62.encode(999);  // "g7"
base62.decode("g7"); // 999
```

This uses the default **ASCII character set** for encoding/decoding.

It's also possible to define a **custom character set** instead:

```javascript
var base62 = require("base62");

var charset = "~9876543210ABCDEFGHIJKLMNOPQRSTU$#@%!abcdefghijklmnopqrstuvw-=";
base62.setCharacterSet(charset);

base62.encode(999);  // "F3"
base62.decode("F3"); // 999
```

`setCharacterSet` ensures that the respective string contains exactly 62 unique
characters.


## Development

Source code is hosted on [GitHub](http://github.com/base62/base62.js).
Please report issues or feature requests in
[GitHub Issues](http://github.com/base62/base62.js.issues).


### Note on Patches/Pull Requests

 * Fork the project.
 * Make your feature addition or bug fix.
 * Add tests for it. This is important so I don't break it in a future version
   unintentionally.
 * Send me a pull request. Bonus points for topic branches.


### Release Process for Maintainers

 * Update the version number in `package.json`.
 * Commit this change with the respective version number as commit message
   (e.g. "1.2.3").
 * Create an annotated tag, using the prefixed version number (e.g.
   `git tag -am "1.2.3" v1.2.3`).
 * Publish the new version: `git push --tags origin master` and `npm publish`.


## Copyright

Copyright (c) 2016 Andrew Nesbitt. See [LICENSE](https://github.com/base62/base62.js/blob/master/LICENSE) for details.
