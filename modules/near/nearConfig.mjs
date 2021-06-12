var keyStore;
export function nearConfig(nearApi)
{
    keyStore = keyStore || new nearApi.keyStores.BrowserLocalStorageKeyStore();
    return {
        keyStore: keyStore,
        networkId: 'testnet',
        nodeUrl: 'https://rpc.testnet.near.org',
        walletUrl: 'https://wallet.testnet.near.org',
        helperUrl: 'https://helper.testnet.near.org'
    };
}