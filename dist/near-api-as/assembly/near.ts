import { Connection } from "./connection";
import {KeyStore} from "./key_stores";
import { JsonRpcProvider } from "./providers";
import { InMemorySigner } from "./signer";


class NearConfig{

    keyStore:KeyStore;
    networkId:string;
    masterAccount:string;
    contractId:string;
    accountId:string;
    constructor(keyStore:KeyStore,networkId:string,masterAccount:string)
    {
        this.keyStore=keyStore;
        this.networkId=networkId;
        this.masterAccount=masterAccount;
        this.accountId=masterAccount;
        this.contractId=masterAccount;
    }
}

class Near{
    config:NearConfig;
    connection: Connection;
    constructor(config:NearConfig){
        this.config=config;
        this.connection=new Connection(config.networkId, new JsonRpcProvider(""),new InMemorySigner(config.keyStore));
    }
    
}

export {
    Near, 
    NearConfig
};