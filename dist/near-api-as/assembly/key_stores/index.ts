class KeyPair{

}

class KeyStore{

    constructor()
    {

    }

    setKey(a:string,y:string,kp:KeyPair):void
    {

    }
    
}

class UnencryptedFileSystemKeyStore extends KeyStore
{
    constructor()
    {
        super();
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

class MergeKeyStore extends KeyStore
{
    constructor(keyStores:Array<KeyStore>,config:MergeKeyStoreConfig)
    {
        super();
    }
}
class BrowserLocalStorageKeyStore extends KeyStore
{

}
export {
    KeyStore,
    InMemoryKeyStore,
    BrowserLocalStorageKeyStore,
    UnencryptedFileSystemKeyStore,
    MergeKeyStore,
};
