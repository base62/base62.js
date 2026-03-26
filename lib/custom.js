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
            var rem = int % max;
            res = byCode[Number(rem)] + res;
            int = (int - rem) / max;
        }
        return res;
    }

    if (int === 0) {
        return byCode[0];
    }

    var res = "",
        max = charset.length;
    while (int > 0) {
        var rem = int % max;
        res = byCode[rem] + res;
        int = (int - rem) / max;
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
            res = res * bigMax + BigInt(byChar[char]);
        }
        return res;
    }

    var res = 0;
    for (i = 0; i < length; i++) {
        char = str[i];
        res = res * max + byChar[char];
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
