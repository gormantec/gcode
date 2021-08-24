export * from './key_stores/index';
export * from './common-index';
export * from './connect';
import { Debug } from "wasmdom-globals";

import {Transaction,Action,createTransaction as _createTransaction} from "./transaction";
import { PublicKey } from './utils/key_pair';


export function createTransaction():i32{
    var tt:Transaction=_createTransaction("gormantec.testnet",PublicKey.fromString("x"),"x",14,[new Action({createAccount:null,deployContract:null,functionCall:null})],new Uint8Array(1));
    Debug.log("xxx:"+Transaction.toString(tt));
    return 0;
}

export {Transaction,PublicKey,Action };