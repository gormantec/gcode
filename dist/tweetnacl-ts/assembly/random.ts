import { ByteArray } from './array';
//import { _randomBytes } from './server/random';

//export { _randomBytes };

export function randomBytes(n: i32): ByteArray {
    const b = ByteArray(n);

    
    for(var i:i32=0; i<n;i++)
    {
        b[i]=<u32>(Math.random()*4294967295);
    }
    return b;
}

export function _randomBytes(x:ByteArray, n:i32):void {
    var v = randomBytes(n);
    for (var i = 0; i < n; i++) {
        x[i] = v[i];
        v[i] = 0;
    }
}
