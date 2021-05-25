export function upload() {

}

export function test() {
    require(["https://cdn.jsdelivr.net/npm/near-api-js@0.41.0/dist/near-api-js.min.js"], async ({ nearApi }) => {


        const keyStore = new nearApi.keyStores.BrowserLocalStorageKeyStore();

        const near = new nearApi.Near({
            keyStore: keyStore,
            networkId: 'testnet',
            nodeUrl: 'https://rpc.testnet.near.org',
            walletUrl: 'https://wallet.testnet.near.org'
        });


        /*
        const keyPair = nearApi.KeyPair.fromRandom("ed25519");
        const publicKey = keyPair.publicKey.toString();
        await keyStore.setKey("testnet", publicKey, keyPair);

        const account = await near.account("hello.gormantec.testnet");
        await account.addKey(
            publicKey, // public key for new account
        );
        */


        const wallet = new nearApi.WalletConnection(near);
        //const account = await near.account("gormantec.testnet");
        if (!wallet.isSignedIn()) {
            wallet.requestSignIn("gormantec.testnet");
        }

        const contract = new nearApi.Contract(
            wallet.account(), // the account object that is connecting
            "dev-1621939186587-7091001",
            {
                // name of contract you're connecting to
                viewMethods: ["getGreeting"], // view methods do not change state but usually return a value
                changeMethods: ["setGreeting"], // change methods modify state
            }
        );

        await contract.setGreeting(
            {
                message: "hello.10", // argument name and value - pass empty object if no args required
            }
        );

    });
}