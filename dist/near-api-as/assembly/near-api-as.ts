export declare function consoleLog(s: string):void;
export declare function near_login(accountId:string):i32;
export declare function near_contract(accountId:string,contractId:string,methods: string[]):i32;
export declare function near_contract_exec(contract:i32,method:string,parrams: string):void;
