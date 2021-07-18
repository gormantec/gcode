import {i256Safe as BN } from "as-bignum";
import * as bs58 from "as-base58";

// TODO: Make sure this polyfill not included when not required
import { TextDecoder }  from 'text-encoding-utf-8';

const textDecoder = new TextDecoder('utf-8', { fatal: true });

export function baseEncode(value: Uint8Array): string {
    return bs58.encode(value);
}

export function baseDecode(value: string): Uint8Array{
    return bs58.decode(value);
}

const INITIAL_LENGTH = 1024;

export type Schema = Map<Function, any>;

export class BorshError extends Error {
    originalMessage: string;
    fieldPath: string[] = [];

    constructor(message: string) {
        super(message);
        this.originalMessage = message;
    }

    addToFieldPath(fieldName: string):void {
        this.fieldPath.unshift(fieldName);
        // NOTE: Modifying message directly as jest doesn't use .toString()
        this.message = this.originalMessage + ': ' + this.fieldPath.join('.');
    }
}

/// Binary encoder.
export class BinaryWriter {
    buf: Uint8Array;
    length: number;

    public constructor() {
        this.buf = new Uint8Array(INITIAL_LENGTH);
        this.length = 0;
    }

    maybeResize():void {
        if (this.buf.byteLength < 16 + this.length) {
            var nb = new Uint8Array(this.buf.byteLength+INITIAL_LENGTH);
            nb.set(this.buf);
            this.buf=nb;
        }
    }
/*
    public writeU8(value: number):void {
        this.maybeResize();
        this.buf.writeUInt8(value, this.length);
        this.length += 1;
    }

    public writeU16(value: number):void {
        this.maybeResize();
        this.buf.writeUInt16LE(value, this.length);
        this.length += 2;
    }

    public writeU32(value: number):void {
        this.maybeResize();
        this.buf.writeUInt32LE(value, this.length);
        this.length += 4;
    }

    public writeU64(value: i64):void {
        this.maybeResize();
        this.writeBuffer(Buffer.from(new BN().toArray('le', 8)));
    }

    public writeU128(value: BN):void {
        this.maybeResize();
        this.writeBuffer(Buffer.from(new BN(value).toArray('le', 16)));
    }

    public writeU256(value: BN):void {
        this.maybeResize();
        this.writeBuffer(Buffer.from(new BN(value).toArray('le', 32)));
    }

    public writeU512(value: BN):void {
        this.maybeResize();
        this.writeBuffer(Buffer.from(new BN(value).toArray('le', 64)));
    }


    private writeBuffer(buffer: Buffer):void {
        // Buffer.from is needed as this.buf.subarray can return plain Uint8Array in browser
        this.buf = Buffer.concat([Buffer.from(this.buf.subarray(0, this.length)), buffer, Buffer.alloc(INITIAL_LENGTH)]);
        this.length += buffer.length;
    }

    public writeString(str: string):void  {
        this.maybeResize();
        const b = Buffer.from(str, 'utf8');
        this.writeU32(b.length);
        this.writeBuffer(b);
    }

    public writeFixedArray(array: Uint8Array):void  {
        this.writeBuffer(Buffer.from(array));
    }

    public writeArray(array: any[], fn: any):void  {
        this.maybeResize();
        this.writeU32(array.length);
        for (const elem of array) {
            this.maybeResize();
            fn(elem);
        }
    }
    */
    public toArray(): Uint8Array {
        return this.buf.subarray(0, this.length);


    }

}
/*
function handlingRangeError(target: any, propertyKey: string, propertyDescriptor: PropertyDescriptor):void  {
    const originalMethod = propertyDescriptor.value;
    propertyDescriptor.value = function (...args: any[]) {
        try {
            return originalMethod.apply(this, args);
        } catch (e) {
            if (e instanceof RangeError) {
                const code = (e as any).code;
                if (['ERR_BUFFER_OUT_OF_BOUNDS', 'ERR_OUT_OF_RANGE'].indexOf(code) >= 0) {
                    throw new BorshError('Reached the end of buffer when deserializing');
                }
            }
            throw e;
        }
    };
}
*/
export class BinaryReader {
    buf: ArrayBuffer;
    offset: number;

    public constructor(buf: ArrayBuffer)  {
        this.buf = buf;
        this.offset = 0;
    }

/*
    readU8(): number {
        const value = this.buf.readUInt8(this.offset);
        this.offset += 1;
        return value;
    }


    readU16(): number {
        const value = this.buf.readUInt16LE(this.offset);
        this.offset += 2;
        return value;
    }


    readU32(): number {
        const value = this.buf.readUInt32LE(this.offset);
        this.offset += 4;
        return value;
    }


    readU64(): BN {
        const buf = this.readBuffer(8);
        return new BN(buf, 'le');
    }


    readU128(): BN {
        const buf = this.readBuffer(16);
        return new BN(buf, 'le');
    }


    readU256(): BN {
        const buf = this.readBuffer(32);
        return new BN(buf, 'le');
    }


    readU512(): BN {
        const buf = this.readBuffer(64);
        return new BN(buf, 'le');
    }

    private readBuffer(len: number): Buffer {
        if ((this.offset + len) > this.buf.length) {
            throw new BorshError(`Expected buffer length ${len} isn't within bounds`);
        }
        const result = this.buf.slice(this.offset, this.offset + len);
        this.offset += len;
        return result;
    }


    readString(): string {
        const len = this.readU32();
        const buf = this.readBuffer(len);
        try {
            // NOTE: Using TextDecoder to fail on invalid UTF-8
            return textDecoder.decode(buf);
        } catch (e) {
            throw new BorshError(`Error decoding UTF-8 string: ${e}`);
        }
    }


    readFixedArray(len: number): Uint8Array {
        return new Uint8Array(this.readBuffer(len));
    }


    readArray(fn: any): any[] {
        const len = this.readU32();
        const result = Array<any>();
        for (let i = 0; i < len; ++i) {
            result.push(fn());
        }
        return result;
    }
    */
}
/*
function capitalizeFirstLetter(string):string {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
*/


/// Serialize given object using schema of the form:
/// { class_name -> [ [field_name, field_type], .. ], .. }

export function serialize<T>(schema: Map<()=>void, string>, obj: T): Uint8Array {
    const writer = new BinaryWriter();
    //serializeStruct(schema, obj, writer);
    return writer.toArray();
}



/// Deserializes object from bytes using schema.
export function deserialize<T>(schema: Map<()=>void, string>, classType: string, buffer: ArrayBuffer): T|null {
    const reader = new BinaryReader(buffer);
    //const result = deserializeStruct(schema, classType, reader);
    //if (reader.offset < buffer.length) {
    //    throw new BorshError(`Unexpected ${buffer.length - reader.offset} bytes after deserialized data`);
    //}
    if( classType == "Transaction" ){
        //return new Transaction();
    }
    return null;
}
