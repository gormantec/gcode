import { Connection } from "./connection";

import {  Promise, JSObject } from "wasmdom-globals";
import { near_login,consoleLog } from "./near-api-as";

let waitFlag:i32=0;

export class Account {
    readonly connection: Connection;
    readonly accountId: string;
    myPromise:Promise;

    constructor(connection: Connection, accountId: string) {
        this.connection = connection;
        this.accountId = accountId;
        this.myPromise=new Promise(near_login(accountId));
        //this.myPromise.
        waitFlag=1;
        this.myPromise.thenJSObject((o:JSObject)=>{
            waitFlag=0;
            consoleLog("thenJSObject");
            return null;
        });
        while(waitFlag==1){let r=Math.random()*Math.random()*Math.random()*Math.random();}
    }

}
