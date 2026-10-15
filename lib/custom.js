"use strict";

var validate = require("./validate");

var MAX_SAFE = Number.MAX_SAFE_INTEGER;

exports.encode = function encode(int, charset) {
    validate.encodeInput(int);

    var byCode = charset.byCode;
    var res = "";

    if (typeof int === "bigint") {
        if (int === 0n) {
            return byCode[0];
        }
        var bigMax = BigInt(charset.length);
        while (int > 0n) {
            res = byCode[Number(int % bigMax)] + res;
            int /= bigMax;
        }
        return res;
    }

    if (int === 0) {
        return byCode[0];
    }
    var max = charset.length;
    while (int > 0) {
        var rem = int % max;
        res = byCode[rem] + res;
        int = (int - rem) / max;
    }
    return res;
};

exports.decode = function decode(str, charset, options) {
    validate.decodeInput(str);

    var byChar = charset.byChar,
        max = charset.length,
        // code points only matter if the charset has astral characters
        chars = charset.astral ? Array.from(str) : str,
        length = chars.length,
        i, char, val;

    if (options && options.bigint) {
        var big = 0n,
            bigMax = BigInt(max);
        for (i = 0; i < length; i++) {
            char = chars[i];
            val = byChar[char];
            if (val === undefined) {
                throw validate.invalidChar(str, char);
            }
            big = big * bigMax + BigInt(val);
        }
        return big;
    }

    var res = 0;
    for (i = 0; i < length; i++) {
        char = chars[i];
        val = byChar[char];
        if (val === undefined) {
            throw validate.invalidChar(str, char);
        }
        res = res * max + val;
        if (res > MAX_SAFE) {
            throw validate.unsafeResult(str);
        }
    }
    return res;
};

exports.indexCharset = function indexCharset(str) {
    var chars = Array.from(str),
        byChar = Object.create(null),
        length = chars.length,
        i;
    if (length < 2) {
        throw new RangeError("You must supply at least 2 characters.");
    }
    for (i = 0; i < length; i++) {
        if (byChar[chars[i]] !== undefined) {
            throw new RangeError("You must use unique characters.");
        }
        byChar[chars[i]] = i;
    }
    return { byCode: chars, byChar: byChar, length: length, astral: chars.some(function(c) { return c.length > 1; }) };
};
