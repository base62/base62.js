"use strict";

var validate = require("./validate");

var CHARSET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
var MAX_SAFE = Number.MAX_SAFE_INTEGER;

// Lookup table: charCode -> value (e.g. '0'=48 -> 0, 'a'=97 -> 10, 'A'=65 -> 36)
var CHAR_TO_VAL = new Uint8Array(123).fill(255);
for (var ci = 0; ci < 62; ci++) {
    CHAR_TO_VAL[CHARSET.charCodeAt(ci)] = ci;
}

exports.encode = function encode(int) {
    validate.encodeInput(int);

    var res = "";
    if (typeof int === "bigint") {
        if (int === 0n) {
            return CHARSET[0];
        }
        while (int > 0n) {
            res = CHARSET[Number(int % 62n)] + res;
            int /= 62n;
        }
        return res;
    }

    if (int === 0) {
        return CHARSET[0];
    }
    while (int > 0) {
        var rem = int % 62;
        res = CHARSET[rem] + res;
        int = (int - rem) / 62;
    }
    return res;
};

exports.decode = function decode(str, options) {
    validate.decodeInput(str);

    var length = str.length;
    var i, val;

    if (options && options.bigint) {
        var big = 0n;
        for (i = 0; i < length; i++) {
            val = CHAR_TO_VAL[str.charCodeAt(i)];
            // out-of-range codes read as undefined, which also fails this check
            if (!(val < 62)) {
                throw validate.invalidChar(str, str[i]);
            }
            big = big * 62n + BigInt(val);
        }
        return big;
    }

    var res = 0;
    for (i = 0; i < length; i++) {
        val = CHAR_TO_VAL[str.charCodeAt(i)];
        if (!(val < 62)) {
            throw validate.invalidChar(str, str[i]);
        }
        res = res * 62 + val;
        if (res > MAX_SAFE) {
            throw validate.unsafeResult(str);
        }
    }
    return res;
};
