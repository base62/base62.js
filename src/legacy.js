import { encode, decode } from "./ascii";
import * as custom from "./custom";

// v1.x API
var Base62 = { // NB: mutable singleton
    encode,
    decode,
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

        charset = custom.indexCharset(charset);
        Base62.encode = function(value) { return custom.encode(value, charset) };
        Base62.decode = function(value) { return custom.decode(value, charset) };
    }
};

export default Base62;
