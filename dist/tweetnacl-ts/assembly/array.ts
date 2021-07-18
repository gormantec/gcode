export type ByteArray = Uint8Array;

export function ByteArray(n:i32): ByteArray {
    return new Uint8Array(<i32>n);
    
}
export function ByteArray_fromByteArray(n:ByteArray): ByteArray {
    var ba:ByteArray=ByteArray(n.length);
    for(var i:i32=0;i<n.length;i++) ba[i]=n[i];
    return ba;
    
}

export type HalfArray = Uint16Array;

export function HalfArray(n:i32): HalfArray {
    return new Uint16Array(n);
}

export type WordArray = Uint32Array;

export function WordArray(n: i32): WordArray {
    return new Uint32Array(n);
}

export type IntArray = Int32Array;

export function IntArray(n:i32): IntArray {
    return new Int32Array(n);
}

export type NumArray = Float64Array;

export function NumArray(n:i32): NumArray {
    return new Float64Array(n);
}
export function NumArray_fromNumArray(n:f64[]): NumArray {

    var ba:NumArray=NumArray(n.length);
    for(var i:i32=0;i<n.length;i++) ba[i]=n[i];
    return ba;
}