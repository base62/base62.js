declare namespace base62 {
    export function setCharacterSet(characters: string): void
    export function encode(number: number | bigint): string
    export function decode(string: string): number
    export function decode(string: string, options: { bigint: true }): bigint
}

export = base62
