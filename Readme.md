[![build status](https://secure.travis-ci.org/andrew/base62.js.png)](http://travis-ci.org/andrew/base62.js)
# Base62.js

A javascript Base62 encode/decoder for node.js

## Install

    npm install base62

## Usage

    Base62 = require('base62')
    Base62.encode(999)  // 'g7'
    Base62.decode('g7') // 999
