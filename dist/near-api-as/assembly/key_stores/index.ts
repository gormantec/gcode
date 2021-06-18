import * as keyStores from "..";


var BrowserLocalStorageKeyStore:string,UnencryptedFileSystemKeyStore:string ;

class KeyPair{

}

class KeyStore{

    setKey(a:string,y:string,kp:KeyPair):void
    {

    }
    
}

class InMemoryKeyStore extends KeyStore
{
    constructor()
    {
        super();
    }

}
class MergeKeyStoreConfig{
    writeKeyStoreIndex:i32;
}

class KeyStores{
    keyStore:KeyStore;
}

class MergeKeyStore extends KeyStore
{
    constructor(keyStores:Array<KeyStore>,config:MergeKeyStoreConfig)
    {
        super();
    }
}

export {
    KeyStore,
    InMemoryKeyStore,
    BrowserLocalStorageKeyStore,
    UnencryptedFileSystemKeyStore,
    MergeKeyStore,
};
