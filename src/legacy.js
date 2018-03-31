import { encode, decode } from "./ascii";
import * as custom from "./custom";

// v1.x API
let Base62 = { // NB: mutable singleton
    encode,
    decode,
    setCharacterSet: charset => {
        if(charset.length !== 62) {
            throw Error("You must supply 62 characters.");
        }

        let uniq = {}; // poor man's `Set`
        for(let i = 0; i < charset.length; i++) {
            let char = charset[i];
            if(uniq[char]) {
                throw Error("You must use unique characters.");
            }
            uniq[char] = true;
        }

        charset = custom.indexCharset(charset);
        let { encode, decode } = custom;
        Base62.encode = value => encode(value, charset);
        Base62.decode = value => decode(value, charset);
    }
};

export default Base62;
