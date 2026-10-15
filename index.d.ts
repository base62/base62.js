declare namespace base62 {
    interface Codec {
        encode(number: number | bigint): string
        decode(string: string): number
        decode(string: string, options: { bigint: true }): bigint
        decode(string: string, options?: { bigint?: boolean }): number | bigint
    }

    export function create(characters: string): Codec
    export function setCharacterSet(characters: string): void
    export function encode(number: number | bigint): string
    export function decode(string: string): number
    export function decode(string: string, options: { bigint: true }): bigint
    export function decode(string: string, options?: { bigint?: boolean }): number | bigint
}

export = base62
