import { Account } from "./account";
import { Window , fetch } from "wasmdom";
import {  Response } from "wasmdom-globals";
//import { JSON } from "assemblyscript-json"; 
import { encode, decode } from "as-base64";


export class ContractMethods {

    changeMethods: string[]=[];
    viewMethods: string[]=[];
}

class Method
{
    methodName:string;
    methodType:string;
    exec:(params:ExecParams) => string;
}

export class Contract {
    readonly account: Account;
    readonly contractId: string;
    methods:Method[]=[];

    /**
     * @param account NEAR account to sign change method transactions
     * @param contractId NEAR account id where the contract is deployed
     * @param options NEAR smart contract methods that your application will use. These will be available as `contract.methodName`
     */
    constructor(account: Account, contractId: string, options: ContractMethods) {
        this.account = account;
        this.contractId = contractId;
        var i:i32=0;

        Window.window.console.log("new Contract");
        for( i=0;i<options.viewMethods.length;i++) {
            const _methodName=options.viewMethods[i];
            this.methods.push({
                methodName: _methodName, methodType:"view",exec: (parrams) => {
                    return "";
                }
            });
        }
        for( i=0;i<options.changeMethods.length;i++) {
            const _methodName=options.changeMethods[i];
            this.methods.push({
                methodName: _methodName, methodType:"change",exec: (parrams) => {
                    return "";
                }
            });
        };
    }

    exec(params:ExecParams):void
    {
        for(var i=0;i<this.methods.length;i++)
        {
            if(this.methods[i].methodName==params.methodName)
            {
                this.methods[i].exec(params);
                var p:string="{}";
                if(params.paramaters) p=<string>params.paramaters;
                Window.window.console.log("fetch");
                fetch("https://rpc.testnet.near.org","POST",'{"Content-Type":"application/json"}',
                    `{
                        "jsonrpc": "2.0",
                        "id": "dontcare",
                        "method": "query",
                        "params": {
                          "request_type": "call_function",
                          "finality": "final",
                          "account_id": "`+this.contractId+`",
                          "method_name": "`+params.methodName+`",
                          "args_base64": "`+encode(Uint8Array.wrap(String.UTF8.encode("{}")))+`"
                        }
                      }`).then((r: Response) => {
                        Window.window.console.log("then");
                        return r.text();
                    },null).thenString((text: string) => {
                        Window.window.console.log("thenString");
                        Window.window.console.log(text);
                        return null;
                    });
            }
        }
    }

}

class ExecParams{
    methodName:string;
    paramaters:string|null;
}