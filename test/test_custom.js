/* global describe, it */
"use strict";

var base62 = require("../lib/custom");
var assert = require("assert");

var encode = base62.encode;
var decode = base62.decode;
var assertSame = assert.strictEqual;

var charset = "9876543210ABCDEFGHIJKLMNOPQRSTU$#@%!abcdefghijklmnopqrstuvw-=~";
charset = base62.indexCharset(charset);

describe("Base62 codec (custom character set)", function() {
    it("should encode numbers", function() {
        assertSame(encode(0, charset), "9");
        assertSame(encode(7, charset), "2");
        assertSame(encode(16, charset), "G");
        assertSame(encode(999, charset), "G2");
        assertSame(encode(9999, charset), "7bH");
        assertSame(encode(238327, charset), "~~~");
    });

    it("should decode strings", function() {
        assertSame(decode("9", charset), 0);
        assertSame(decode("2", charset), 7);
        assertSame(decode("G", charset), 16);
        assertSame(decode("G2", charset), 999);
        assertSame(decode("7bH", charset), 9999);
        assertSame(decode("~~~", charset), 238327);
    });
});

describe("arbitrary-length charsets (e.g. Base66)", function() {
    var ascii = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    var charset = ascii + "äöüß";
    charset = base62.indexCharset(charset);

    it("should encode numbers", function() {
        assertSame(encode(10, charset), "A");
        assertSame(encode(65, charset), "ß");
        assertSame(encode(70, charset), "14");
    });

    it("should decode strings", function() {
        assertSame(decode("A", charset), 10);
        assertSame(decode("ß", charset), 65);
        assertSame(decode("14", charset), 70);
    });
});
