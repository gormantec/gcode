//import SHA256 from "@chainsafe/as-sha256";

import { Debug, Promise, Response, ResolveFuncType } from "wasmdom-globals";

import { Enum, Assignable } from './utils/enums';
import { serialize, deserialize } from 'borsh';
import { KeyType, PublicKey } from './utils/key_pair';
import { Signer } from './signer';
import {i256Safe as BN } from "as-bignum";
import { JSON } from "assemblyscript-json";


export class FunctionCallPermission {
    allowance: BN;
    receiverId: string;
    methodNames: string[];
}

export class FullAccessPermission {}

export class AccessKeyPermission extends Enum {
    functionCall: FunctionCallPermission;
    fullAccess: FullAccessPermission;
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
    
    const serializedArgs:Uint8Array = isUint8Array ? args : Buffer.from(o.toString());
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
    nonce: i32;
    receiverId: string;
    actions: Action[];
    blockHash: Uint8Array;
}

export class Transaction {
    signerId: string|null;
    publicKey: PublicKey|null;
    nonce: string|null;
    receiverId: string|null;
    actions: Action[]|null;
    blockHash: Uint8Array|null;

    constructor(config:TransactionConfig)
    {

    }



    encode(): Uint8Array {
        return serialize(SCHEMA, this);
    }

    static decode(bytes: Buffer): Transaction {
        return deserialize(SCHEMA, Transaction, bytes);
    }
}

export class SignedTransaction extends Assignable {
    transaction: Transaction;
    signature: Signature;

    encode(): Uint8Array {
        return serialize(SCHEMA, this);
    }

    static decode(bytes: Buffer): SignedTransaction {
        return deserialize(SCHEMA, SignedTransaction, bytes);
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
}

export const SCHEMA = new Map<()=>void, string>();

export function createTransaction(signerId: string, publicKey: PublicKey, receiverId: string, nonce: i32, actions: Action[], blockHash: Uint8Array): Transaction {
    return new Transaction({ signerId, publicKey, nonce, receiverId, actions, blockHash });
}

