"use strict";

var CHARSET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

// Lookup table: charCode -> value (e.g. '0'=48 -> 0, 'a'=97 -> 10, 'A'=65 -> 36)
var CHAR_TO_VAL = new Uint8Array(123);
for (var ci = 0; ci < 62; ci++) {
    CHAR_TO_VAL[CHARSET[ci].charCodeAt(0)] = ci;
}

// NB: does not validate input
exports.encode = function encode(int) {
    if (typeof int === "bigint") {
        if (int === 0n) {
            return CHARSET[0];
        }
        var res = "";
        while (int > 0n) {
            var rem = int % 62n;
            res = CHARSET[Number(rem)] + res;
            int = (int - rem) / 62n;
        }
        return res;
    }

    if (int === 0) {
        return CHARSET[0];
    }

    var res = "";
    while (int > 0) {
        var rem = int % 62;
        res = CHARSET[rem] + res;
        int = (int - rem) / 62;
    }
    return res;
};

exports.decode = function decode(str, options) {
    var useBigInt = options && options.bigint;
    var length = str.length;
    var i, char;

    if (useBigInt) {
        var res = 0n;
        for (i = 0; i < length; i++) {
            res = res * 62n + BigInt(CHAR_TO_VAL[str.charCodeAt(i)]);
        }
        return res;
    }

    var res = 0;
    for (i = 0; i < length; i++) {
        res = res * 62 + CHAR_TO_VAL[str.charCodeAt(i)];
    }
    return res;
};
