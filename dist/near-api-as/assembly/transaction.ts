


//import SHA256 from "@chainsafe/as-sha256";
import { Enum, Assignable } from './utils/enums';
import { serialize, deserialize, BinaryWriter, Buffer,SchemaItem,SchemaSerializable } from 'borsh-as';
import { KeyType, PublicKey } from './utils/key_pair';
import { Signer } from './signer';
import {i256Safe as BN } from "as-bignum";
import { JSON } from "assemblyscript-json";
import { Debug } from "wasmdom-globals";



export class FunctionCallPermission {
    allowance: BN;
    receiverId: string;
    methodNames: string[];
}

export class FullAccessPermission {}

export class AccessKeyPermission extends Enum {
    functionCall: FunctionCallPermission;
    fullAccess: FullAccessPermission;
     getUint8Array(a:string):Uint8Array|null{return null;}
     getString(a:string):String|null{return null;}
     getU32(a:string):u32{return -1;}
     getArray<SchemaSerializable>(a:string ):SchemaSerializable[]|null{return null;}
}

export class AccessKey extends Assignable {
    nonce: number;
    permission: AccessKeyPermission;
}


export class IAction extends Assignable {}

export class CreateAccount {

    constructor()
    {

    }
}
export class DeployContract { code: Uint8Array; }
export class FunctionCall  { methodName: string; args: Uint8Array; gas: BN; deposit: BN; }
export class Transfer extends IAction { deposit: BN; }
export class Stake extends IAction { stake: BN; publicKey: PublicKey; }
export class AddKey extends IAction { publicKey: PublicKey; accessKey: AccessKey; }
export class DeleteKey extends IAction { publicKey: PublicKey; }
export class DeleteAccount extends IAction { beneficiaryId: string; }

export function createAccount(): Action {
    return new Action({
        
        createAccount: new CreateAccount(),
        deployContract:null,
        functionCall:null
     });
}

export function deployContract(code: Uint8Array): Action {
    return new Action({ 
        createAccount: null,
        deployContract: {code:code},
        functionCall:null
     });
}

/**
 * Constructs {@link Action} instance representing contract method call.
 *
 * @param methodName the name of the method to call
 * @param args arguments to pass to method. Can be either plain JS object which gets serialized as JSON automatically
 *  or `Uint8Array` instance which represents bytes passed as is.
 * @param gas max amount of gas that method call can use
 * @param deposit amount of NEAR (in yoctoNEAR) to send together with the call
 */
export function functionCall(methodName: string, args: Uint8Array, gas: BN, deposit: BN): Action {
    const anyArgs = args as any;
    const isUint8Array = anyArgs.byteLength !== undefined && anyArgs.byteLength === anyArgs.length;
    let o:JSON.Obj=new JSON.Obj();
    if(args instanceof Uint8Array)
    {
        for(var i:i32=0; i<args.length;i++)
        {
            o.set(i.toString(),args[i]);
        }
    }
    
    const serializedArgs:Uint8Array = isUint8Array ? args : Buffer.from(o.toString()).toArray();
    return new Action({
        createAccount: null,
        deployContract: null,
        functionCall: {methodName:methodName,args:serializedArgs,gas:gas,deposit:deposit }
    });
}



export class Signature extends Assignable {
    keyType: KeyType;
    data: Uint8Array;
}

class TransactionConfig {
    signerId: string;
    publicKey: PublicKey;
    nonce: u32;
    receiverId: string;
    actions: Action[];
    blockHash: Uint8Array;
}


export class Transaction extends SchemaSerializable {


    signerId: String;
    publicKey: PublicKey;
    nonce: u32;
    receiverId: String;
    actions: Action[];
    blockHash: Uint8Array;

    constructor(config:TransactionConfig)
    {
        super();
        this.signerId=config.signerId;
        this.publicKey=config.publicKey;
        this.nonce=config.nonce;
        this.receiverId=config.receiverId;
        this.actions=config.actions;
        this.blockHash=config.blockHash;
    }

    getString(a:string):String|null{
     
        if(a=="signerId"){
            return this.signerId;
        }
        else return null;
    }
     getUint8Array(a:string):Uint8Array|null{
     

        if(a=="blockHash"){
            return <Uint8Array>this.blockHash;
        }
        else return null;
    }
    
    getArray<SchemaSerializable>(a:string ):SchemaSerializable[]|null
    {
        if(a=="actions"){
            
            let rt:SchemaSerializable[]=[];
            for(let i:i32=0;i<this.actions.length;i++)
            {
                //@ts-ignore
                rt.push(<SchemaSerializable>this.actions[i]);
            }
            return rt;
            
        }
        else{
            return null;
        }
    }
    getU32(a:string):u32{
        if(a=="nonce"){
            return this.nonce;
        }
        else return -1;    
    }
    

    static encode(t:Transaction): Uint8Array {
        return serialize<Transaction>(SCHEMA, t);
    }

    static decode(bytes: Buffer): Transaction {
        return <Transaction>deserialize<Transaction>(SCHEMA, "Transaction", bytes.toArray().buffer);
    }
    static toString(t:Transaction):string
    {
        var x:Uint8Array=Transaction.encode(t);
        var pos:i32=0;
        var r:string="Transaction[";
        var ar:string[][]=SCHEMA.get("Transaction").fields;
        var field:i32 =0;
        
        while(pos<(x.length-4))
        {
    
            if(pos!=0)r=r+",";
            var lenArray=x.subarray(pos,pos+4);
            var len:u32=( lenArray[0] << 0 )+( lenArray[1] << 8 )+( lenArray[1] << 16 )+( lenArray[1] << 24 );

            Debug.log("---->"+lenArray.length.toString()+":"+len.toString());
            Debug.log("-->"+ar[field][1]);
            if(ar[field][1]=="u32")
            {
                r=r+ar[field][0]+"<"+ar[field][1]+">"+"="+len.toString();
                pos=pos+4;
            }
            else{
                var s:string=String.UTF8.decode( x.slice(pos+4,pos+len+4).buffer );
                r=r+ar[field][0]+"<"+ar[field][1]+">"+"="+s;
                pos=pos+len+4;
            }

            
            field++;
            
        }
        r=r+"]";
        return r;
    }

}

export class SignedTransaction extends Assignable {
    transaction: Transaction;
    signature: Signature;

    encode(): Uint8Array {
        return serialize(SCHEMA, this);
    }

    static decode(bytes: Buffer): SignedTransaction | null {
        return deserialize(SCHEMA, "SignedTransaction", bytes.toArray());
    }
}
class ActionConfig {
    createAccount: CreateAccount|null;
    deployContract: DeployContract|null;
    functionCall: FunctionCall|null;
}
/**
 * Contains a list of the valid transaction Actions available with this API
 * @see {@link https://nomicon.io/RuntimeSpec/Actions.html | Actions Spec}
 */
export class Action extends Enum {
    createAccount: CreateAccount|null;
    deployContract: DeployContract|null;
    functionCall: FunctionCall|null;
    transfer: Transfer|null;
    stake: Stake|null;
    addKey: AddKey|null;
    deleteKey: DeleteKey|null;
    deleteAccount: DeleteAccount|null;

    constructor(config:ActionConfig)
    {
        super("");
        this.createAccount=config.createAccount;
        this.deployContract=config.deployContract;
        this.functionCall=config.functionCall;
        
    }

    getUint8Array(a:string):Uint8Array|null{return null;}
    getString(a:string):String|null{return null;}
    getU32(a:string):u32{return -1;}
    getArray<SchemaSerializable>(a:string ):SchemaSerializable[]|null{return null;}
}

let a:Action=new Action({createAccount:new CreateAccount(),deployContract:null,functionCall:null});
/*
export const SCHEMA = new Map<(o:Transaction,w:BinaryWriter)=>void, string>();
SCHEMA.set((o:Transaction,w:BinaryWriter)=>{
    var x:string="";
    if(o.publicKey!=null){
        x=(<PublicKey>o.publicKey).toString();
    }
    var signerId:string="";
    if(o.publicKey!=null){
        signerId=<string>o.signerId;
    }
    x='{ "class":"Transaction",'+
       ' "signerId":"'+signerId+'",'+
       ' "publicKey":"'+x+'" }';
    w.writeString(x);
},"Transaction");
*/
export function createTransaction(signerId: string, publicKey: PublicKey, receiverId: string, nonce: i32, actions: Action[], blockHash: Uint8Array): Transaction {
    return new Transaction({ signerId, publicKey, nonce, receiverId, actions, blockHash });
}

export const SCHEMA:Map<string,SchemaItem> = new Map<string,SchemaItem>();
SCHEMA.set("Transaction",{kind:'struct',fields:[
    ['signerId', 'string'],
    ['publicKey', 'PublicKey'],
    ['nonce', 'u32'],
    ['receiverId', 'string'],
    ['actions', 'Action[]'],
    ['blockHash', 'Uint8Array'],
]});

SCHEMA.set("Action",{kind:'struct',fields:[
    ['createAccount', 'string']
]});
