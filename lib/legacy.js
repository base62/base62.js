"use strict";

var base62 = require("./ascii");
var base62custom = require("./custom");

var Base62 = { // NB: mutable singleton, `create` avoids it
    encode: base62.encode,
    decode: base62.decode,
    create: function(charset) {
        charset = base62custom.indexCharset(charset);
        return {
            encode: function(value) { return base62custom.encode(value, charset); },
            decode: function(value, options) { return base62custom.decode(value, charset, options); }
        };
    },
    setCharacterSet: function(charset) {
        if(Array.from(charset).length !== 62) {
            throw new RangeError("You must supply 62 characters.");
        }

        var codec = Base62.create(charset);
        Base62.encode = codec.encode;
        Base62.decode = codec.decode;
    }
};

module.exports = Base62;
