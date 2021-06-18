import { Account } from "./account";
import { Window } from "wasmdom/dom";

export class Contract{
    constructor(account:Account,contractId:string,methods:ContractMethods)
    {
        Window.window.console.log(methods.viewMethods[0]);
    }

}
export class ContractMethods {

    changeMethods: string[]=[];
    viewMethods: string[]=[];
}