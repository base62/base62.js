"use strict";

// NB: does not validate input
exports.encode = function encode(int, charset) {
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
};

exports.decode = function decode(str, charset) {
    var byChar = charset.byChar,
        res = 0,
        length = str.length,
        i, char;
    for (i = 0; i < length; i++) {
        char = str[i];
        res += byChar[char] * Math.pow(62, (length - i - 1));
    }
    return res;
};

// NB: does not validate input
exports.indexCharset = function indexCharset(str) {
    var byCode = {},
        byChar = {},
        i, char;
    for (i = 0; i < str.length; i++) {
        char = str[i];
        byCode[i] = char;
        byChar[char] = i;
    }
    return { byCode: byCode, byChar: byChar };
};
