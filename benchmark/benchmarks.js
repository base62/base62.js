"use strict";

var base62 = require("../lib/ascii");
var base62custom = require("../lib/custom");

var charset = base62custom.indexCharset("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz");

function bench(name, iterations, fn) {
    // warmup
    for (var w = 0; w < 1000; w++) { fn(w); }

    var start = process.hrtime.bigint();
    for (var i = 0; i < iterations; i++) {
        fn(i);
    }
    var ns = process.hrtime.bigint() - start;
    var ms = Number(ns) / 1e6;
    var opsPerSec = Math.round(iterations / (ms / 1000));
    console.log("  " + name.padEnd(30) + ms.toFixed(2).padStart(10) + "ms" + opsPerSec.toLocaleString().padStart(16) + " ops/sec");
}

var n = 5000000;

console.log("ASCII charset (" + n.toLocaleString() + " iterations)\n");

console.log("  Small numbers (0 to " + n.toLocaleString() + "):");
bench("encode", n, function(i) { base62.encode(i); });
bench("decode", n, function() { base62.decode("g7"); });
bench("encode bigint", n, function(i) { base62.encode(BigInt(i)); });
bench("decode bigint", n, function() { base62.decode("g7", { bigint: true }); });

console.log("  Large numbers (~10^13):");
bench("encode", n, function(i) { base62.encode(i + 10000000000000); });
bench("decode", n, function() { base62.decode("2Q3rKTOF"); });
bench("encode bigint", n, function(i) { base62.encode(BigInt(i) + 10000000000000n); });
bench("decode bigint", n, function() { base62.decode("2Q3rKTOF", { bigint: true }); });

console.log("  Very large bigints (~10^30):");
var bigOffset = 123456789012345678901234567890n;
bench("encode bigint", n, function(i) { base62.encode(BigInt(i) + bigOffset); });
bench("decode bigint", n, function() { base62.decode("3oPBaJPMWjmDE4RUeJ", { bigint: true }); });

console.log();
console.log("Custom charset (" + n.toLocaleString() + " iterations)\n");

console.log("  Small numbers (0 to " + n.toLocaleString() + "):");
bench("encode", n, function(i) { base62custom.encode(i, charset); });
bench("decode", n, function() { base62custom.decode("G2", charset); });
bench("encode bigint", n, function(i) { base62custom.encode(BigInt(i), charset); });
bench("decode bigint", n, function() { base62custom.decode("G2", charset, { bigint: true }); });

console.log("  Large numbers (~10^13):");
bench("encode", n, function(i) { base62custom.encode(i + 10000000000000, charset); });
bench("decode", n, function() { base62custom.decode("7c3RKTOQ", charset); });
bench("encode bigint", n, function(i) { base62custom.encode(BigInt(i) + 10000000000000n, charset); });
bench("decode bigint", n, function() { base62custom.decode("7c3RKTOQ", charset, { bigint: true }); });
