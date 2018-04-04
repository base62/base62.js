var base62 = require('../lib/ascii');
var base62custom = require('../lib/custom');

var encode = base62.encode;
var decode = base62.decode;
var encodeCustom = base62custom.encode;
var decodeCustom = base62custom.decode;
var indexCharset = base62custom.indexCharset;

var intResult, strResult, now, delta, i;
var charset = indexCharset('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz');

function performanceNow() {
    var t = process.hrtime();
    return t[0] * 1000 + t[1] / 1000000;
}

// decode with default charset (ASCII)

now = performanceNow();
for (intResult = 0, i = 0; i < 1000000; i++) {
    intResult += decode('00thing');
}

delta = performanceNow() - now;
console.log('|', 'decoding with default charset (1000000x)', '|',
        intResult === 432635954000000 ? 'correct' : 'incorrect', '|',
        delta.toFixed(2), 'ms', '|');

// encode with default charset (ASCII)

now = performanceNow();
for (strResult = '', i = 0; i < 1000000; i++) {
    strResult = encode(i);
}

delta = performanceNow() - now;
console.log('|', 'encoding with default charset (1000000x)', '|',
        strResult === '4c91' ? 'correct' : 'incorrect', '|',
        delta.toFixed(2), 'ms', '|');

// decode with custom charset

now = performanceNow();
for (intResult = 0, i = 0; i < 1000000; i++) {
    intResult += decodeCustom('00thing', charset);
}

delta = performanceNow() - now;
console.log('|', 'decoding with custom charset (1000000x)', '|',
        intResult === 823118800000000 ? 'correct' : 'incorrect', '|',
        delta.toFixed(2), 'ms', '|');

// encode with custom charset

now = performanceNow();
for (strResult = '', i = 0; i < 1000000; i++) {
    strResult = encodeCustom(i, charset);
}

delta = performanceNow() - now;
console.log('|', 'encoding with custom charset (1000000x)', '|',
        strResult === '4C91' ? 'correct' : 'incorrect', '|',
        delta.toFixed(2), 'ms', '|');
