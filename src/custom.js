// NB: does not validate input
export function encode(int, { byCode }) {
    if (int === 0) {
        return byCode[0];
    }

    let res = "";
    while (int > 0) {
        res = byCode[int % 62] + res;
        int = Math.floor(int / 62);
    }
    return res;
}

export function decode(str, { byChar }) {
    let res = 0;
    let { length } = str;
    for (let i = 0; i < length; i++) {
        let char = str[i];
        res += byChar[char] * (62 ** (length - i - 1));
    }
    return res;
}

// NB: does not validate input
export function indexCharset(str) {
    let byCode = {};
    let byChar = {};
    for (let i = 0; i < str.length; i++) {
        let char = str[i];
        byCode[i] = char;
        byChar[char] = i;
    }
    return { byCode, byChar };
}
