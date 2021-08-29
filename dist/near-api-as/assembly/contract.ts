import { Account } from "./account";
import { near_contract, consoleLog,near_contract_exec } from "./near-api-as";
import { Window, fetch } from "wasmdom";
import { Debug, Promise, Response, ResolveFuncType, JSContract, JSObject } from "wasmdom-globals";
import { JSON } from "assemblyscript-json";
import { encode } from "as-base64";


const contracts:Map<string,Contract>=new Map<string,Contract>();    


export class ContractMethods {

    changeMethods: string[] = [];
    viewMethods: string[] = [];
}
   
class Method {
    
    methodName: string;
    methodType: string;
    contract:Contract;
    execImp:(parrams:ExecParams,contract:Contract) => Promise;

    constructor(methodName:string,methodType:string,contract:Contract,execImp:(parrams:ExecParams,contract:Contract) => Promise)
    {
        this.methodName=methodName;
        this.methodType=methodType;
        this.contract=contract;
        this.execImp=execImp;

    }

    exec(paramaters:string):Promise {
        return this.execImp({methodName:this.methodName,paramaters:paramaters},this.contract);
    }

}

export class Contract {
    readonly account: Account;
    readonly contractId: string;
    methods: Method[] = [];
    done:boolean=false;
    jsContract:JSContract|null;
    thenFunc:(contract:Contract)=>void=(contract:Contract)=>{};

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
            this.methods.push(new Method(_methodName, "view", this,(parrams:ExecParams,contract:Contract) => { 
                return contract.view(parrams);
            }));
        }
        for (i = 0; i < options.changeMethods.length; i++) {
            const _methodName = options.changeMethods[i];
            methods.push(_methodName);
            this.methods.push(new Method(_methodName,"change",this, (parrams:ExecParams,contract:Contract) => {
                    
                    if(contract.jsContract)
                    {
                        let x:JSContract=<JSContract>contract.jsContract;
                        let paramaters:string="{}";
                        if(parrams.paramaters)paramaters=<string>parrams.paramaters;
                        consoleLog("Executed JSContract");
                        return new Promise(near_contract_exec(x.pointer,parrams.methodName,paramaters));
                    }
                    else{
                        return new Promise();
                    }
                    
                })
            );
        };

        var p: Promise = new Promise(near_contract(account.accountId, contractId, methods));
        contracts.set("CONTRACT:"+p.pointer.toString(),this);
        consoleLog("CONTRACT:"+p.pointer.toString());
        p.thenJSContract((jscontract: JSContract) => {
            consoleLog("CONTRACT:"+jscontract.promisePointer.toString());
            contracts.get("CONTRACT:"+jscontract.promisePointer.toString()).jsContract=jscontract;
            contracts.get("CONTRACT:"+jscontract.promisePointer.toString()).done=true;
            contracts.get("CONTRACT:"+jscontract.promisePointer.toString()).thenFunc(contracts.get("CONTRACT:"+jscontract.promisePointer.toString()));
            return null;
        }
        );

    }


    then(func:(account:Contract)=>void):void
    {
        if(this.done)
        {
            func(this);
        }
        else{
            this.thenFunc=func;
        }
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

    method(methodName:string): Method{

        for (var i = 0; i < this.methods.length; i++) {
            if (this.methods[i].methodName == methodName) {
                consoleLog("function "+methodName+" index:"+this.methods[i].exec.index.toString());
                    return this.methods[i];
            }
        }
        return new Method(methodName,"vew",this,()=>{return new Promise();});
        
    }

    

    exec(params: ExecParams): Promise {

        

        for (var i = 0; i < this.methods.length; i++) {
            if (this.methods[i].methodName == params.methodName) {
                if (this.methods[i].methodType == "change") {
                    consoleLog("function "+params.methodName+" index:"+this.methods[i].execImp.index.toString());
                    return this.methods[i].execImp(params,this);
                }
            }
        }
        return this.view(params);

    }


    public static decodeResult(text: string): string {

        let jsonObj: JSON.Obj = <JSON.Obj>(JSON.parse(text));
        let resultObj: JSON.Obj = (<JSON.Obj>jsonObj.getValue("result"));
        let resultObjError:JSON.Str|null = resultObj.getString("error");
        if(!resultObjError)
        {
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
        else
        {
            return resultObjError.toString();
        }
        

        
    }

}

class ExecParams {
    methodName: string;
    paramaters: string | null;
}