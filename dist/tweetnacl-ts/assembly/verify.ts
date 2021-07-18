import { ByteArray } from './array';
//import { checkArrayTypes } from './check';

function vn(x: ByteArray, xi: i32, y: ByteArray, yi: i32, n: i32): i32 {
    let i:i32, d:i32 = 0;

    for (i = 0; i < n; i++) d |= x[xi + i] ^ y[yi + i];

    return (1 & ((d - 1) >>> 8)) - 1;
}

export function _verify_16(x: ByteArray, xi: i32, y: ByteArray, yi: i32): i32 {
    return vn(x, xi, y, yi, 16);
}

export function _verify_32(x: ByteArray, xi: i32, y: ByteArray, yi: i32): i32 {
    return vn(x, xi, y, yi, 32);
}

export function verify(x: ByteArray, y: ByteArray): boolean {
    //checkArrayTypes(x, y);

    // Zero length arguments are considered not equal
    return x.length > 0 && y.length > 0 &&
        x.length == y.length &&
        vn(x, 0, y, 0, x.length) == 0;
}
