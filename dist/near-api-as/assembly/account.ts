import { Connection } from "./connection";

import {  Promise, JSObject } from "wasmdom-globals";
import { near_login,consoleLog } from "./near-api-as";

export class Account {
    readonly connection: Connection;
    readonly accountId: string;

    constructor(connection: Connection, accountId: string) {
        this.connection = connection;
        this.accountId = accountId;
        let p:Promise=new Promise(near_login(accountId));
        p.thenJSObject((o:JSObject)=>{
            consoleLog("thenJSObject");
            return null;
        });
    }

}
