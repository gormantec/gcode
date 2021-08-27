import { Account } from "./account";
import { near_contract, consoleLog } from "./near-api-as";
import { Window, fetch } from "wasmdom";
import { Debug, Promise, Response, ResolveFuncType, JSContract } from "wasmdom-globals";
import { JSON } from "assemblyscript-json";
import { encode, decode } from "as-base64";

import * as nearjs from "./near-api-as";

const globals={
    contracts:new Map<string,JSContract>()
}


export class ContractMethods {

    changeMethods: string[] = [];
    viewMethods: string[] = [];
}

class Method {
    methodName: string;
    methodType: string;
    exec: (params: ExecParams) => Promise;
}

export class Contract {
    readonly account: Account;
    readonly contractId: string;
    methods: Method[] = [];

    /**
     * @param account NEAR account to sign change method transactions
     * @param contractId NEAR account id where the contract is deployed
     * @param options NEAR smart contract methods that your application will use. These will be available as `contract.methodName`
     */
    constructor(account: Account, contractId: string, options: ContractMethods) {
        this.account = account;
        this.contractId = contractId;
        var i: i32 = 0;

        //Window.window.console.log("new Contract");
        let methods: string[] = []
        for (i = 0; i < options.viewMethods.length; i++) {
            const _methodName = options.viewMethods[i];
            methods.push("*" + _methodName);
            this.methods.push({
                methodName: _methodName, methodType: "view", exec: (parrams) => {
                    return new Promise();
                }
            });
        }
        for (i = 0; i < options.changeMethods.length; i++) {
            const _methodName = options.changeMethods[i];
            methods.push(_methodName);
            this.methods.push({
                methodName: _methodName, methodType: "change", exec: (parrams) => {
                    return new Promise();
                }
            });
        };

        var p: Promise = new Promise(near_contract(account.accountId, contractId, methods));
        p.thenJSContract((contract: JSContract) => {
            consoleLog("Got Conract");
            return null;
        }
        );
    }



    view(params: ExecParams): Promise {

        var p: string = "{}";
        if (params.paramaters) p = <string>params.paramaters;
        //Window.window.console.log("fetch");
        let p1: Promise = fetch("https://rpc." + this.account.connection.networkId + ".near.org", "POST", '{"Content-Type":"application/json"}',
            `{
            "jsonrpc": "2.0",
            "id": "`+ this.account.accountId + `",
            "method": "query",
            "params": {
                "request_type": "call_function", 
                "finality": "final",
                "account_id": "`+ this.contractId + `",
                "method_name": "`+ params.methodName + `",
                "args_base64": "`+ encode(Uint8Array.wrap(String.UTF8.encode(p))) + `"
            }
            }`);

        p1.name = "p1";
        let p2: Promise = p1.then((r: Response) => {
            Debug.log("then");
            return r.text();
        }, null);
        p2.name = "p2";
        let p3: Promise = p2.thenString((s: string) => {
            var dc = Contract.decodeResult(s);
            return Promise.resolve(dc);
        });
        p3.name = "p3";
        return p3;
    }

    exec(params: ExecParams): Promise {

        for (var i = 0; i < this.methods.length; i++) {
            if (this.methods[i].methodName == params.methodName) {
                if (this.methods[i].methodType == "change") {
                    return this.methods[i].exec(params);
                }
            }
        }
        return this.view(params);

    }

    public static decodeResult(text: string): string {

        let jsonObj: JSON.Obj = <JSON.Obj>(JSON.parse(text));
        let resultObj: JSON.Obj = (<JSON.Obj>jsonObj.getValue("result"));
        let resultValueObj: JSON.Arr = (<JSON.Arr>resultObj.getValue("result"));
        let arr: JSON.Value[] = resultValueObj.valueOf();
        let aUint8Array: Uint8Array = new Uint8Array(arr.length);
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].isNum) {
                aUint8Array[i] = <u32>(<JSON.Num>arr[i]).valueOf();
            }
            else if (arr[i].isInteger) {

                let v: i64 = (<JSON.Integer>arr[i]).valueOf();
                aUint8Array[i] = <u32>v;
            }
        }
        return String.UTF8.decode(aUint8Array.buffer);
    }

}

class ExecParams {
    methodName: string;
    paramaters: string | null;
}