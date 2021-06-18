import { Account } from "./account";

export class Contract{
    constructor(account:Account,contractId:string,methods:ContractMethods)
    {

    }

}
export class ContractMethods {

    changeMethods: string[];
    viewMethods: string[];
}