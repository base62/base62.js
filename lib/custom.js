"use strict";

// NB: does not validate input
exports.encode = function encode(int, charset) {
    var byCode = charset.byCode;

    if (typeof int === "bigint") {
        if (int === 0n) {
            return byCode[0];
        }
        var res = "",
            max = BigInt(charset.length);
        while (int > 0n) {
            res = byCode[Number(int % max)] + res;
            int = int / max;
        }
        return res;
    }

    if (int === 0) {
        return byCode[0];
    }

    var res = "",
        max = charset.length;
    while (int > 0) {
        res = byCode[int % max] + res;
        int = Math.floor(int / max);
    }
    return res;
};

exports.decode = function decode(str, charset, options) {
    var byChar = charset.byChar,
        length = str.length,
        max = charset.length,
        i, char;

    if (options && options.bigint) {
        var res = 0n,
            bigMax = BigInt(max);
        for (i = 0; i < length; i++) {
            char = str[i];
            res += BigInt(byChar[char]) * bigMax ** BigInt(length - i - 1);
        }
        return res;
    }

    var res = 0;
    for (i = 0; i < length; i++) {
        char = str[i];
        res += byChar[char] * Math.pow(max, (length - i - 1));
    }
    return res;
};

// NB: does not validate input
exports.indexCharset = function indexCharset(str) {
    var byCode = {},
        byChar = {},
        length = str.length,
        i, char;
    for (i = 0; i < length; i++) {
        char = str[i];
        byCode[i] = char;
        byChar[char] = i;
    }
    return { byCode: byCode, byChar: byChar, length: length };
};
