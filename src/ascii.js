let CHARSET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// NB: does not validate input
export function encode(int) {
    if (int === 0) {
        return CHARSET[0];
    }

    let res = "";
    while (int > 0) {
        res = CHARSET[int % 62] + res;
        int = Math.floor(int / 62);
    }
    return res;
}

export function decode(str) {
    let res = 0;
    let { length } = str;
    for (let i = 0; i < length; i++) {
        let char = str.charCodeAt(i);
        if (char < 58) {
            char = char - 48;
        } else if (char < 91) {
            char = char - 29;
        } else {
            char = char - 87;
        }
        res += char * (62 ** (length - i - 1));
    }
    return res;
}
