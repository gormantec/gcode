import { Account } from "./account";
import { Window , Promise, fetch,Response } from "wasmdom/dom";
import { JSON } from "assemblyscript-json"; 


export class ContractMethods {

    changeMethods: string[]=[];
    viewMethods: string[]=[];
}

class Method
{
    methodName:string;
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
            this.methods.push({
                methodName: options.viewMethods[i], exec: () => {
                    Window.window.console.log("fetch");

                    fetch("https://rpc.testnet.near.org","POST",'{"Content-Type","application/json"}',
                        `{
                            "jsonrpc": "2.0",
                            "id": "dontcare",
                            "method": "query",
                            "params": {
                                "request_type": "view_account",
                                "finality": "final",
                                "account_id": "nearkat.testnet"
                            }
                        }`).then((r: Response) => {
                            Window.window.console.log("then");
                            return r.text();
                        }).thenString((text: string) => {
                            Window.window.console.log("thenString");
                            Window.window.console.log(text);
                            return null;
                        });

                    return "";
                }
            });
        }
        for( i=0;i<options.changeMethods.length;i++) {
            this.methods.push({methodName:options.changeMethods[i],exec:()=>{return "{}";}});
        };
    }

    exec(params:ExecParams):void
    {
        for(var i=0;i<this.methods.length;i++)
        {
            if(this.methods[i].methodName==params.methodName)
            {
                this.methods[i].exec(params);
            }
        }
    }

}

class ExecParams{
    methodName:string;
    paramaters:string|null;
}