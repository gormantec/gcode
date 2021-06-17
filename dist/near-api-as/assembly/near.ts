import {KeyStore} from "./key_stores";
class NearConfig{

    keyStore:KeyStore;
    deps?: { keyStore: KeyStore };
    networkId:string;
    masterAccount:string;

    
}

class Near{

    constructor(config:NearConfig){

    }
    
}

export {
    Near, 
    NearConfig
};