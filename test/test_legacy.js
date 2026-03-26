"use strict";

var { describe, it } = require("node:test");
var assert = require("node:assert");

var Base62 = require("../");

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

describe("setCharacterSequence", function() {
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
