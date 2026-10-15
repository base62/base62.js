"use strict";

var { describe, it, afterEach } = require("node:test");
var assert = require("node:assert");

var Base62 = require("../");
var defaultEncode = Base62.encode;
var defaultDecode = Base62.decode;

afterEach(function() {
    Base62.encode = defaultEncode;
    Base62.decode = defaultDecode;
});

describe("encode", function() {
    it("should encode a number to a Base62 string", function() {
        assert.strictEqual(Base62.encode(0), '0');
        assert.strictEqual(Base62.encode(999), 'g7');
        assert.strictEqual(Base62.encode(65), '13');
        assert.strictEqual(Base62.encode(10000000000001), "2Q3rKTOF");
        assert.strictEqual(Base62.encode(10000000000002), "2Q3rKTOG");
    });
});

describe("decode", function() {
    it("should decode a number from a Base62 string", function() {
        assert.strictEqual(Base62.decode('0'), 0);
        assert.strictEqual(Base62.decode('g7'), 999);
        assert.strictEqual(Base62.decode('13'), 65);
        assert.strictEqual(Base62.decode('0013'), 65);
        assert.strictEqual(Base62.decode("2Q3rKTOF"), 10000000000001);
        assert.strictEqual(Base62.decode("2Q3rKTOH"), 10000000000003);
    });

    it("should decode to BigInt when requested", function() {
        assert.strictEqual(Base62.decode('g7', { bigint: true }), 999n);
        assert.strictEqual(Base62.decode("FfGNdXsE9", { bigint: true }), 9007199254740993n);
    });
});

describe("BigInt encode", function() {
    it("should encode BigInt values", function() {
        assert.strictEqual(Base62.encode(0n), '0');
        assert.strictEqual(Base62.encode(999n), 'g7');
        assert.strictEqual(Base62.encode(9007199254740993n), 'FfGNdXsE9');
    });
});

describe("setCharacterSet", function() {
    it("should update the character sequence", function() {
        Base62.setCharacterSet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz");

        assert.notStrictEqual(Base62.encode(999), 'g7');

        var testCases = {
            "G7": 999,
            "Lxf7": 5234233,
            "qx": 3283,
            "29": 133,
            "1S": 90,
            "3k": 232,
            "4I": 266,
            "2X": 157,
            "1E": 76,
            "1L": 83
        };

        Object.keys(testCases).forEach(function(base62String) {
            assert.strictEqual(Base62.encode(testCases[base62String]), base62String);
            assert.strictEqual(Base62.decode(base62String), testCases[base62String]);
        });
    });

    it("should throw exceptions on invalid strings", function() {
        assert.throws(function() {
            Base62.setCharacterSet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxy");
        }, /You must supply 62 characters/);

        assert.throws(function() {
            Base62.setCharacterSet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz;");
        }, /You must supply 62 characters/);

        assert.throws(function() {
            Base62.setCharacterSet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxzz");
        }, /You must use unique characters/);
    });
});

describe("input validation", function() {
    it("should reject invalid encode input", function() {
        assert.throws(function() { Base62.encode(-1); }, RangeError);
        assert.throws(function() { Base62.encode(-1n); }, RangeError);
        assert.throws(function() { Base62.encode(1.5); }, RangeError);
        assert.throws(function() { Base62.encode(NaN); }, RangeError);
        assert.throws(function() { Base62.encode(Infinity); }, RangeError);
        assert.throws(function() { Base62.encode("999"); }, TypeError);
        assert.throws(function() { Base62.encode(undefined); }, TypeError);
    });

    it("should reject numbers above MAX_SAFE_INTEGER", function() {
        assert.strictEqual(Base62.encode(Number.MAX_SAFE_INTEGER), "FfGNdXsE7");
        assert.throws(function() { Base62.encode(Number.MAX_SAFE_INTEGER + 1); }, /pass a BigInt/);
        assert.strictEqual(Base62.encode(BigInt(Number.MAX_SAFE_INTEGER) + 1n), "FfGNdXsE8");
    });

    it("should reject invalid decode input", function() {
        assert.throws(function() { Base62.decode(""); }, RangeError);
        assert.throws(function() { Base62.decode(undefined); }, TypeError);
        assert.throws(function() { Base62.decode(999); }, TypeError);
        assert.throws(function() { Base62.decode("g7 "); }, /Invalid character " "/);
        assert.throws(function() { Base62.decode("!g7"); }, /Invalid character "!"/);
        assert.throws(function() { Base62.decode("g{"); }, /Invalid character/);
        assert.throws(function() { Base62.decode("gé"); }, /Invalid character "é"/);
        assert.throws(function() { Base62.decode("g7!", { bigint: true }); }, /Invalid character "!"/);
        assert.throws(function() { Base62.decode("", { bigint: true }); }, RangeError);
    });

    it("should reject decoded values above MAX_SAFE_INTEGER", function() {
        assert.strictEqual(Base62.decode("FfGNdXsE7"), Number.MAX_SAFE_INTEGER);
        assert.throws(function() { Base62.decode("FfGNdXsE8"); }, /use \{ bigint: true \}/);
        assert.throws(function() { Base62.decode("Z".repeat(100000)); }, RangeError);
        assert.strictEqual(Base62.decode("FfGNdXsE8", { bigint: true }), 9007199254740992n);
    });

    it("should still accept leading zeros", function() {
        assert.strictEqual(Base62.decode("0000000000000000g7"), 999);
    });

    it("should validate input with a custom character set", function() {
        Base62.setCharacterSet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz");
        assert.throws(function() { Base62.encode(-1); }, RangeError);
        assert.throws(function() { Base62.decode("G7!"); }, /Invalid character "!"/);
        assert.throws(function() { Base62.decode("G7!", { bigint: true }); }, /Invalid character "!"/);
        assert.throws(function() { Base62.decode(""); }, RangeError);
    });
});

describe("setCharacterSet with astral characters", function() {
    it("should count code points, not UTF-16 units", function() {
        Base62.setCharacterSet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxy😀");
        assert.strictEqual(Base62.encode(61), "😀");
        assert.strictEqual(Base62.encode(62 * 61 + 61), "😀😀");
        assert.strictEqual(Base62.decode("😀😀"), 62 * 61 + 61);
        assert.strictEqual(Base62.decode("1😀", { bigint: true }), 123n);
    });
});

describe("create", function() {
    it("should return a codec without changing the default", function() {
        var codec = Base62.create("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz");
        assert.strictEqual(codec.encode(999), "G7");
        assert.strictEqual(codec.decode("G7"), 999);
        assert.strictEqual(codec.decode("G7", { bigint: true }), 999n);
        assert.strictEqual(Base62.encode(999), "g7");
        assert.strictEqual(Base62.decode("g7"), 999);
    });

    it("should be unaffected by setCharacterSet", function() {
        var codec = Base62.create("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ");
        Base62.setCharacterSet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz");
        assert.strictEqual(codec.encode(999), "g7");
    });

    it("should accept character sets of other lengths", function() {
        var hex = Base62.create("0123456789abcdef");
        assert.strictEqual(hex.encode(255), "ff");
        assert.strictEqual(hex.decode("ff"), 255);
    });

    it("should reject invalid character sets", function() {
        assert.throws(function() { Base62.create("0"); }, /at least 2 characters/);
        assert.throws(function() { Base62.create("0123456789abcdee"); }, /unique characters/);
    });
});
