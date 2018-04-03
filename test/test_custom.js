/* global describe, it */
import { encode, decode, indexCharset } from "../src/custom";
import assert from "assert";

var assertSame = assert.strictEqual;

var charset = "9876543210ABCDEFGHIJKLMNOPQRSTU$#@%!abcdefghijklmnopqrstuvw-=~";
charset = indexCharset(charset);

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
