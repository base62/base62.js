"use strict";

var { describe, it } = require("node:test");
var assert = require("node:assert");

var base62 = require("../lib/custom");
var encode = base62.encode;
var decode = base62.decode;

var charset = "9876543210ABCDEFGHIJKLMNOPQRSTU$#@%!abcdefghijklmnopqrstuvw-=~";
charset = base62.indexCharset(charset);

describe("Base62 codec (custom character set)", function() {
    it("should encode numbers", function() {
        assert.strictEqual(encode(0, charset), "9");
        assert.strictEqual(encode(7, charset), "2");
        assert.strictEqual(encode(16, charset), "G");
        assert.strictEqual(encode(999, charset), "G2");
        assert.strictEqual(encode(9999, charset), "7bH");
        assert.strictEqual(encode(238327, charset), "~~~");
    });

    it("should decode strings", function() {
        assert.strictEqual(decode("9", charset), 0);
        assert.strictEqual(decode("2", charset), 7);
        assert.strictEqual(decode("G", charset), 16);
        assert.strictEqual(decode("G2", charset), 999);
        assert.strictEqual(decode("7bH", charset), 9999);
        assert.strictEqual(decode("~~~", charset), 238327);
    });

    it("should encode BigInt values", function() {
        assert.strictEqual(encode(0n, charset), "9");
        assert.strictEqual(encode(999n, charset), "G2");
        assert.strictEqual(encode(238327n, charset), "~~~");
    });

    it("should decode to BigInt when requested", function() {
        assert.strictEqual(decode("9", charset, { bigint: true }), 0n);
        assert.strictEqual(decode("G2", charset, { bigint: true }), 999n);
        assert.strictEqual(decode("~~~", charset, { bigint: true }), 238327n);
    });

    it("should roundtrip BigInt values beyond Number.MAX_SAFE_INTEGER", function() {
        var big = 123456789012345678901234567890n;
        var encoded = encode(big, charset);
        var decoded = decode(encoded, charset, { bigint: true });
        assert.strictEqual(decoded, big);
    });
});

describe("arbitrary-length charsets (e.g. Base66)", function() {
    var ascii = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    var charset = ascii + "äöüß";
    charset = base62.indexCharset(charset);

    it("should encode numbers", function() {
        assert.strictEqual(encode(10, charset), "A");
        assert.strictEqual(encode(65, charset), "ß");
        assert.strictEqual(encode(70, charset), "14");
    });

    it("should decode strings", function() {
        assert.strictEqual(decode("A", charset), 10);
        assert.strictEqual(decode("ß", charset), 65);
        assert.strictEqual(decode("14", charset), 70);
    });
});
