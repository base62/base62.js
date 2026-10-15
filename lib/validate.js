"use strict";

exports.encodeInput = function encodeInput(int) {
    if (typeof int === "bigint") {
        if (int < 0n) {
            throw new RangeError("Cannot encode negative value " + int);
        }
        return;
    }
    if (typeof int !== "number") {
        throw new TypeError("Expected a number or bigint, got " + typeof int);
    }
    if (!Number.isInteger(int)) {
        throw new RangeError("Expected an integer, got " + int);
    }
    if (int < 0) {
        throw new RangeError("Cannot encode negative value " + int);
    }
    if (int > Number.MAX_SAFE_INTEGER) {
        throw new RangeError(int + " is above Number.MAX_SAFE_INTEGER, pass a BigInt instead");
    }
};

exports.decodeInput = function decodeInput(str) {
    if (typeof str !== "string") {
        throw new TypeError("Expected a string, got " + typeof str);
    }
    if (str.length === 0) {
        throw new RangeError("Cannot decode an empty string");
    }
};

exports.charsetInput = function charsetInput(str) {
    if (typeof str !== "string") {
        throw new TypeError("Expected a string, got " + typeof str);
    }
};

// chars is str, or its code point array for astral charsets
exports.invalidChar = function invalidChar(str, chars, i) {
    var char = typeof chars === "string" ? String.fromCodePoint(chars.codePointAt(i)) : chars[i];
    return new RangeError("Invalid character " + JSON.stringify(char) + " in " + JSON.stringify(str));
};

exports.unsafeResult = function unsafeResult(str) {
    return new RangeError(JSON.stringify(str) + " decodes above Number.MAX_SAFE_INTEGER, use { bigint: true }");
};
