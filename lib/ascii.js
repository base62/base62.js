"use strict";

var CHARSET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// NB: does not validate input
exports.encode = function encode(int) {
    if (typeof int === "bigint") {
        if (int === 0n) {
            return CHARSET[0];
        }
        var res = "";
        while (int > 0n) {
            res = CHARSET[Number(int % 62n)] + res;
            int = int / 62n;
        }
        return res;
    }

    if (int === 0) {
        return CHARSET[0];
    }

    var res = "";
    while (int > 0) {
        res = CHARSET[int % 62] + res;
        int = Math.floor(int / 62);
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
            char = str.charCodeAt(i);
            if (char < 58) {
                char = char - 48;
            } else if (char < 91) {
                char = char - 29;
            } else {
                char = char - 87;
            }
            res += BigInt(char) * 62n ** BigInt(length - i - 1);
        }
        return res;
    }

    var res = 0;
    for (i = 0; i < length; i++) {
        char = str.charCodeAt(i);
        if (char < 58) { // 0-9
            char = char - 48;
        } else if (char < 91) { // A-Z
            char = char - 29;
        } else { // a-z
            char = char - 87;
        }
        res += char * Math.pow(62, length - i - 1);
    }
    return res;
};
