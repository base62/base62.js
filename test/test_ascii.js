"use strict";

var { describe, it } = require("node:test");
var assert = require("node:assert");

var base62 = require("../lib/ascii");
var encode = base62.encode;
var decode = base62.decode;

describe("Base62 codec (ASCII)", function() {
    it("should encode numbers", function() {
        assert.strictEqual(encode(0), "0");
        assert.strictEqual(encode(7), "7");
        assert.strictEqual(encode(16), "g");
        assert.strictEqual(encode(61), "Z");
        assert.strictEqual(encode(65), "13");
        assert.strictEqual(encode(999), "g7");
        assert.strictEqual(encode(9999), "2Bh");
        assert.strictEqual(encode(238327), "ZZZ");
        assert.strictEqual(encode(10000000000001), "2Q3rKTOF");
        assert.strictEqual(encode(10000000000002), "2Q3rKTOG");
    });

    it("should decode strings", function() {
        assert.strictEqual(decode("0"), 0);
        assert.strictEqual(decode("7"), 7);
        assert.strictEqual(decode("g"), 16);
        assert.strictEqual(decode("Z"), 61);
        assert.strictEqual(decode("13"), 65);
        assert.strictEqual(decode("0013"), 65); // ignore leading zeros
        assert.strictEqual(decode("g7"), 999);
        assert.strictEqual(decode("2Bh"), 9999);
        assert.strictEqual(decode("ZZZ"), 238327);
        assert.strictEqual(decode("2Q3rKTOF"), 10000000000001);
        assert.strictEqual(decode("2Q3rKTOH"), 10000000000003);
    });

    it("should encode BigInt values", function() {
        assert.strictEqual(encode(0n), "0");
        assert.strictEqual(encode(999n), "g7");
        assert.strictEqual(encode(238327n), "ZZZ");
        assert.strictEqual(encode(9007199254740993n), "FfGNdXsE9");
    });

    it("should decode to BigInt when requested", function() {
        assert.strictEqual(decode("0", { bigint: true }), 0n);
        assert.strictEqual(decode("g7", { bigint: true }), 999n);
        assert.strictEqual(decode("ZZZ", { bigint: true }), 238327n);
        assert.strictEqual(decode("FfGNdXsE9", { bigint: true }), 9007199254740993n);
    });

    it("should roundtrip BigInt values beyond Number.MAX_SAFE_INTEGER", function() {
        var big = 123456789012345678901234567890n;
        var encoded = encode(big);
        var decoded = decode(encoded, { bigint: true });
        assert.strictEqual(decoded, big);
    });
});
