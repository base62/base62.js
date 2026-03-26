/* global describe, it */
"use strict";

var base62 = require("../lib/ascii");
var assert = require("assert");

var encode = base62.encode;
var decode = base62.decode;
var assertSame = assert.strictEqual;

describe("Base62 codec (ASCII)", function() {
    it("should encode numbers", function() {
        assertSame(encode(0), "0");
        assertSame(encode(7), "7");
        assertSame(encode(16), "g");
        assertSame(encode(61), "Z");
        assertSame(encode(65), "13");
        assertSame(encode(999), "g7");
        assertSame(encode(9999), "2Bh");
        assertSame(encode(238327), "ZZZ");
        assertSame(encode(10000000000001), "2Q3rKTOF");
        assertSame(encode(10000000000002), "2Q3rKTOG");
    });

    it("should decode strings", function() {
        assertSame(decode("0"), 0);
        assertSame(decode("7"), 7);
        assertSame(decode("g"), 16);
        assertSame(decode("Z"), 61);
        assertSame(decode("13"), 65);
        assertSame(decode("0013"), 65); // ignore leading zeros
        assertSame(decode("g7"), 999);
        assertSame(decode("2Bh"), 9999);
        assertSame(decode("ZZZ"), 238327);
        assertSame(decode("2Q3rKTOF"), 10000000000001);
        assertSame(decode("2Q3rKTOH"), 10000000000003);
    });

    it("should encode BigInt values", function() {
        assertSame(encode(0n), "0");
        assertSame(encode(999n), "g7");
        assertSame(encode(238327n), "ZZZ");
        assertSame(encode(9007199254740993n), "FfGNdXsE9");
    });

    it("should decode to BigInt when requested", function() {
        assertSame(decode("0", { bigint: true }), 0n);
        assertSame(decode("g7", { bigint: true }), 999n);
        assertSame(decode("ZZZ", { bigint: true }), 238327n);
        assertSame(decode("FfGNdXsE9", { bigint: true }), 9007199254740993n);
    });

    it("should roundtrip BigInt values beyond Number.MAX_SAFE_INTEGER", function() {
        var big = 123456789012345678901234567890n;
        var encoded = encode(big);
        var decoded = decode(encoded, { bigint: true });
        assertSame(decoded, big);
    });
});
