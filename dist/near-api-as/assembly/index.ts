export * from './key_stores/index';
export * from './common-index';
export * from './connect';

import * as transactions from "./transaction" 
import { PublicKey } from './utils/key_pair';
export function createTransaction():i32{
    transactions.createTransaction("gormantec.testnet",PublicKey.fromString("x"),"",1,[new transactions.Action({createAccount:null,deployContract:null,functionCall:null})],new Uint8Array(1));
    return 0;
}