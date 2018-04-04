"use strict";

var base62 = require("./ascii");
var base62custom = require("./custom");

// v1.x API
var Base62 = { // NB: mutable singleton
    encode: base62.encode,
    decode: base62.decode,
    setCharacterSet: function(charset) {
        if(charset.length !== 62) {
            throw Error("You must supply 62 characters.");
        }

        var uniq = {}; // poor man's `Set`
        var i, char;
        for(i = 0; i < charset.length; i++) {
            char = charset[i];
            if(uniq[char]) {
                throw Error("You must use unique characters.");
            }
            uniq[char] = true;
        }

        charset = base62custom.indexCharset(charset);
        Base62.encode = function(value) { return base62custom.encode(value, charset) };
        Base62.decode = function(value) { return base62custom.decode(value, charset) };
    }
};

module.exports = Base62;
