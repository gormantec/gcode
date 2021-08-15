import {i256Safe as BN } from "as-bignum";
import * as bs58 from "as-base58";
import { Debug } from "wasmdom-globals";
import { Transaction,PublicKey,Action } from "near-api-as";

// TODO: Make sure this polyfill not included when not required
import { TextDecoder }  from 'text-encoding-utf-8';

const textDecoder = new TextDecoder('utf-8', { fatal: true });

export class Buffer {

    data:StaticArray<u8>;

    constructor(s:i32)
    {
        this.data=new StaticArray<u8>(s);
    }

    get length():i32{
        return this.data.length;
    }

    static fromStaticArray(data:StaticArray<u8>):Buffer
    {
        var b:Buffer=new Buffer(data.length);
        b.data=data;
        return b;
    }

    public writeUInt32LE(word:u32,pos:i32):void
    {
        this.data[pos+0]=<u8>(word >>> 0 & 0xff);
        this.data[pos+1]=<u8>(word >>> 8 & 0xff);
        this.data[pos+2]=<u8>(word >>> 16 & 0xff);
        this.data[pos+3]=<u8>(word >>> 24 & 0xff);
    }
    public subarray(pos:i32,len:i32):Buffer
    {
        return <Buffer>Buffer.slice(this,pos,pos+len);
    }
    static slice(buf:Buffer,pos:i32,len:i32):Buffer
    {
        return Buffer.fromStaticArray(StaticArray.slice(buf.data,pos,len));
    }
    public toArray():Uint8Array
    {
        var array:Uint8Array=new Uint8Array(this.data.length);
        for(var i:i32=0;i<this.data.length;i++)
        {
            array[i]=this.data[i];
        }
        return array;
    }
    static from<T>(a:T):Buffer
    {
        var aBuffer=new Buffer(0);
        if(a instanceof Uint8Array)
        {
            aBuffer=new Buffer(a.byteLength);
            for(var i:i32=0;i<a.byteLength;i++)
            {
                aBuffer.data[i]=a[i];
            }
        }
        else if(a instanceof String)
        {
            aBuffer=new Buffer(a.length);
            for(var i:i32=0;i<a.length;i++)
            {
                aBuffer.data[i]=a.charCodeAt(i);
            }
        }
        return aBuffer;
    }
    static concat(a:Buffer,b:Buffer):Buffer
    {
        return Buffer.fromStaticArray(StaticArray.concat(a.data,b.data));
    }
    static concatV2(b:Buffer[]):Buffer
    {
        var aBuffer:StaticArray<u8>=new StaticArray<u8>(0);
        for(var i:i32=0;i<b.length;i++)
        {
            aBuffer=StaticArray.concat(aBuffer,b[i].data);
        }
        return Buffer.fromStaticArray(aBuffer);
    }
}

export function baseEncode(value: Uint8Array): string {
    return bs58.encode(value);
}

export function baseDecode(value: string): Uint8Array{
    return bs58.decode(value);
}

const INITIAL_LENGTH = 1024;
export class SchemaItem{kind:string;fields:string[][];}
export type Schema = Map<string, SchemaItem>;


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
    buf: Buffer;
    length: i32;

    public constructor() {
        this.buf = new Buffer(INITIAL_LENGTH);
        this.length = 0;
    }

    maybeResize():void {
        if (this.buf.length < 16 + this.length) {
            this.buf=<Buffer>Buffer.concat(this.buf,new Buffer(INITIAL_LENGTH));
        }
    }
/*
    public writeU8(value: i32):void {
        this.maybeResize();
        this.buf.writeUInt8(value, this.length);
        this.length += 1;
    }

    public writeU16(value: i32):void {
        this.maybeResize();
        this.buf.writeUInt16LE(value, this.length);
        this.length += 2;
    }
*/
    public writeU32(value: u32):void {
        this.maybeResize();
        this.buf.writeUInt32LE(value, <i32>this.length);
        this.length += 4;
    }
/*
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

*/
    private writeBuffer(buffer: Buffer):void {
        // Buffer.from is needed as this.buf.subarray can return plain Uint8Array in browser
        this.buf = Buffer.concatV2([this.buf.subarray(0, this.length), buffer, new Buffer(INITIAL_LENGTH)]);
        this.length += buffer.length;
    }

    public writeString(str: string):void  {
        this.maybeResize();
        const b:Buffer = Buffer.from(Uint8Array.wrap(String.UTF8.encode(str)));
        this.writeU32(b.length);
        this.writeBuffer(b);
    }



    public writeFixedArray(array: Uint8Array):void  {
        this.writeBuffer(Buffer.from(array));
    }
/*
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
        return this.buf.subarray(0, this.length).toArray();
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
    offset: i32;

    public constructor(buf: ArrayBuffer)  {
        this.buf = buf;
        this.offset = 0;
    }

/*
    readU8(): i32 {
        const value = this.buf.readUInt8(this.offset);
        this.offset += 1;
        return value;
    }


    readU16(): i32 {
        const value = this.buf.readUInt16LE(this.offset);
        this.offset += 2;
        return value;
    }


    readU32(): i32 {
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

    private readBuffer(len: i32): Buffer {
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


    readFixedArray(len: i32): Uint8Array {
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



function serializeField<T>(schema: Schema, fieldName: string, fieldValue:T, fieldType: string, writer: BinaryWriter):void {

    if (fieldValue instanceof Uint8Array) {
            var arrayValue:Uint8Array=fieldValue;
            writer.writeFixedArray(arrayValue);
    }
    else if (fieldValue instanceof u32) {
        //@ts-ignore
        writer.writeU32(<u32>fieldValue);
    }
    else if(fieldValue instanceof String && fieldType=="string")
    {
        writer.writeString(<string>fieldValue);
    }
    else if(fieldType=="Action[]" && fieldValue instanceof String)
    {
        writer.writeString(<string>fieldValue);
    }
    else if(fieldType=="PublicKey" && fieldValue instanceof String)
    {
        writer.writeString(<string>fieldValue);
    }
/*
                        writer.writeString("fieldName:\""+fieldName+"\";");
                        writer.writeString("fieldType:\""+fieldType+"\";");
                        if(fieldValue)
                        {
                            writer.writeString("fieldValue:\""+fieldValue+"\";");
                        }
                        else
                        {
                            writer.writeString("fieldValue:null;");
                        }
                        */
}

function serializeStruct<T>(schema: Schema, obj: T,objType:string, writer: BinaryWriter):void {
   //if (typeof obj.borshSerialize === 'function') {
  //    obj.borshSerialize(writer);
  //   return;
  //  }
  Debug.log(nameof(obj));
    const structSchema:SchemaItem = schema.get(objType);
    if (!structSchema) {
        throw new BorshError(`Class ${nameof(obj)} is missing in schema`);
    }

    if (structSchema.kind == 'struct' && obj instanceof SchemaSerializable) {

        for(var i:i32=0;i<structSchema.fields.length;i++)
        {
            var fieldName:string=structSchema.fields[i][0];
            var fieldType:string=structSchema.fields[i][1];
            //(<SchemaSerializable>obj).get(fieldName);
            
            //if(s==null)s="";
            Debug.log("-----------"+fieldType+":"+typeof(obj) +" "+isArray(obj).toString()+ "----------");
            if(fieldType=="Uint8Array")
            {
                var s1:Uint8Array|null=obj.getUint8Array(fieldName);
                if(s1==null)s1=Uint8Array.wrap(new ArrayBuffer(0));
                serializeField<Uint8Array>(schema, fieldName,Uint8Array.wrap(new ArrayBuffer(1)), fieldType, writer);
            }
            else if(fieldType=="u32")
            {
                var s3:u32=obj.getU32(fieldName);
                serializeField<u32>(schema, fieldName,s3, fieldType, writer);
            }
            else if(fieldType.endsWith("[]"))
            {
                let s4:SchemaSerializable[]|null=obj.getArray<SchemaSerializable>(fieldName);
                if(s4==null)s4=[];
                let arrayType:string=fieldType.substring(0,fieldType.length-2);
                for(let i:i32=0;i<s4.length;i++)
                {
                    serializeStruct(schema,s4[i],arrayType,writer);
                }
            }
            else{
                var s2:String|null=obj.getString(fieldName);
                if(s2==null)s2="";
                serializeField<String>(schema, fieldName,<String>s2, fieldType, writer);
            }
            
        }
        
    } else if (structSchema.kind === 'enum') {
        //const name = obj[structSchema.field];
        /*for (let idx = 0; idx < structSchema.values.length; ++idx) {
            const [fieldName, fieldType]: [any, any] = structSchema.values[idx];
            if (fieldName === name) {
                writer.writeU8(idx);
                serializeField(schema, fieldName, obj[fieldName], fieldType, writer);
                break;
            }
        }*/
    } else {
        throw new BorshError(`Unexpected schema kind: ${structSchema.kind} for ${nameof(obj)}`);
    }
}


export abstract class SchemaSerializable{
    abstract getUint8Array(a:string):Uint8Array|null;
    abstract getString(a:string):String|null;
    abstract getU32(a:string):u32;
    abstract getArray<SchemaSerializable>(a:string ):SchemaSerializable[]|null;
}

export function serialize<T>(schema: Schema, obj: T): Uint8Array {
    const writer = new BinaryWriter();
    serializeStruct(schema, obj,nameof(obj), writer);
    return writer.toArray();
}



/// Deserializes object from bytes using schema.
export function deserialize<T>(schema: Schema, classType: string, buffer: ArrayBuffer): T|null {
    const reader = new BinaryReader(buffer);
    //const result = deserializeStruct(schema, classType, reader);
    //if (reader.offset < buffer.length) {
    //    throw new BorshError(`Unexpected ${buffer.length - reader.offset} bytes after deserialized data`);
    //}
    if( nameof(classType) == "Transaction" ){
        //return new Transaction();
    }
    return null;
}
