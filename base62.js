'use strict';

if(typeof global === "undefined" && typeof window !== "undefined") {
	window.global = window;
}

var CHARSET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");


function encode(int) {
    if (int === 0) {
        return CHARSET[0];
    }

    var res = "";
    while (int > 0) {
        res = CHARSET[int % 62] + res;
        int = Math.floor(int / 62);
    }
    return res;
}

function decode(str) {
    var res = 0,
        length = str.length,
        i, char;
    for (i = 0; i < length; i++) {
        char = str.charCodeAt(i);
        if (char < 58) {
            char = char - 48;
        } else if (char < 91) {
            char = char - 29;
        } else {
            char = char - 87;
        }
        res += char * Math.pow(62, length - i - 1);
    }
    return res;
}

function encode$1(int, charset) {
    let byCode = charset.byCode;
    if (int === 0) {
        return byCode[0];
    }

    var res = "";
    while (int > 0) {
        res = byCode[int % 62] + res;
        int = Math.floor(int / 62);
    }
    return res;
}

function decode$1(str, charset) {
    var byChar = charset.byChar,
        res = 0,
        length = str.length,
        i, char;
    for (i = 0; i < length; i++) {
        char = str[i];
        res += byChar[char] * Math.pow(62, (length - i - 1));
    }
    return res;
}


function indexCharset(str) {
    var byCode = {},
        byChar = {},
        i, char;
    for (i = 0; i < str.length; i++) {
        char = str[i];
        byCode[i] = char;
        byChar[char] = i;
    }
    return { byCode: byCode, byChar: byChar };
}

var Base62 = {
    encode,
    decode,
    setCharacterSet: function(charset) {
        if(charset.length !== 62) {
            throw Error("You must supply 62 characters.");
        }

        var uniq = {};
        var i, char;
        for(i = 0; i < charset.length; i++) {
            char = charset[i];
            if(uniq[char]) {
                throw Error("You must use unique characters.");
            }
            uniq[char] = true;
        }

        charset = indexCharset(charset);
        Base62.encode = function(value) { return encode$1(value, charset) };
        Base62.decode = function(value) { return decode$1(value, charset) };
    }
};

module.exports = Base62;
