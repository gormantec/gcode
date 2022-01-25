var keyStore;
export function nearConfig(nearApi,whichnet)
{
    keyStore = keyStore || new nearApi.keyStores.BrowserLocalStorageKeyStore();
    if(whichnet=="mainnet")return {
        keyStore: keyStore,
        networkId: 'mainnet',
        nodeUrl: 'https://rpc.near.org',
        walletUrl: 'https://wallet.near.org',
        helperUrl: 'https://helper.near.org'
    }
    else return {
        keyStore: keyStore,
        networkId: 'testnet',
        nodeUrl: 'https://rpc.testnet.near.org',
        walletUrl: 'https://wallet.testnet.near.org',
        helperUrl: 'https://helper.testnet.near.org'
    }
}