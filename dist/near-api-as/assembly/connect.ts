
import { readKeyFile } from './key_stores/unencrypted_file_system_keystore';
import { KeyStore,InMemoryKeyStore, MergeKeyStore } from './key_stores';
import { Near, NearConfig } from './near';

//global.fetch = fetch;

class Deps{
    keyStore: KeyStore|null;
}

export class ConnectConfig extends NearConfig{
    keyPath: string;
    deps:Deps;
    constructor(keyStore:KeyStore,networkId:string,masterAccount:string,keyPath:string)
    {
        super(keyStore,networkId,masterAccount);
        this.keyPath=keyPath;
        this.deps=new Deps();
    }
}

/**
 * Initialize connection to Near network.

 */
export function connect(config: ConnectConfig): Near {
    // Try to find extra key in `KeyPath` if provided.
    

    return new Near(config);
}

