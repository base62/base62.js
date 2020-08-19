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
        assertSame(encode(16), "G");
        assertSame(encode(61), "z");
        assertSame(encode(65), "13");
        assertSame(encode(999), "G7");
        assertSame(encode(9999), "2bH");
        assertSame(encode(238327), "zzz");
        assertSame(encode(10000000000001), "2q3Rktof");
        assertSame(encode(10000000000002), "2q3Rktog");
    });

    it("should decode strings", function() {
        assertSame(decode("0"), 0);
        assertSame(decode("7"), 7);
        assertSame(decode("G"), 16);
        assertSame(decode("z"), 61);
        assertSame(decode("13"), 65);
        assertSame(decode("0013"), 65); // ignore leading zeros
        assertSame(decode("G7"), 999);
        assertSame(decode("2bH"), 9999);
        assertSame(decode("zzz"), 238327);
        assertSame(decode("2q3Rktof"), 10000000000001);
        assertSame(decode("2q3Rktoh"), 10000000000003);
    });
});
