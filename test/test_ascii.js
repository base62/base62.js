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
});
