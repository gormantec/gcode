import { Connection } from "./connection";

import {  Promise, JSObject } from "wasmdom-globals";
import { near_login,consoleLog } from "./near-api-as";

let waitFlag:i32=0;

const accounts:Map<string,Account>=new Map<string,Account>();

export class Account {
    readonly connection: Connection;
    readonly accountId: string;
    done:boolean=false;
    thenFunc:()=>void=()=>{};
    myPromise:Promise;

    constructor(connection: Connection, accountId: string) {
        this.connection = connection;
        this.accountId = accountId;
        this.myPromise=new Promise(near_login(accountId));
        //this.myPromise.
        accounts.set("ACCOUNT:"+this.myPromise.pointer.toString() ,this);
        this.myPromise.thenJSObject((o:JSObject)=>{
            accounts.get("ACCOUNT:"+o.promisePointer.toString()).done=true;
            accounts.get("ACCOUNT:"+o.promisePointer.toString()).thenFunc();
            consoleLog("thenJSObject");
            return null;
        });
        
    }
    then(func:()=>void):void
    {
        if(this.done)
        {
            func();
        }
        else{
            this.thenFunc=func;
        }
    }

}
