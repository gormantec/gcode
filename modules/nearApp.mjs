export function upload() {

}

async function doNear(nearApi) {

    const keyStore=new nearApi.keyStores.BrowserLocalStorageKeyStore();
    const near = new nearApi.Near({
        keyStore: keyStore,
        networkId: 'testnet',
        nodeUrl: 'https://rpc.testnet.near.org',
        walletUrl: 'https://wallet.testnet.near.org'
    });

    if(window.wconsole)window.wconsole.log(near.connection.networkId);

    console.log(near);
    const wallet = new nearApi.WalletConnection(near);
    //const account = await near.account("gormantec.testnet");
    if (!wallet.isSignedIn()) {
        wallet.requestSignIn("gormantec.testnet");
    }
    console.log(wallet);
    if(window.wconsole)window.wconsole.log(JSON.stringify(wallet));

    const contract = new nearApi.Contract(
        wallet.account(), // the account object that is connecting
        "hello.gormantec.testnet",
        {
            // name of contract you're connecting to
            viewMethods: ["getGreeting"], // view methods do not change state but usually return a value
            changeMethods: ["setGreeting"], // change methods modify state
        }
    );

    if(window.wconsole)window.wconsole.log('setGreeting("hello test")');
    var response=await contract.setGreeting(
        {
            message: "hello test", // argument name and value - pass empty object if no args required
        }
    );
    console.log(response);
    if(window.wconsole)window.wconsole.log(JSON.stringify(response));

}



export function test() {
    console.log("TEST1!");
    require(["https://cdn.jsdelivr.net/npm/near-api-js@0.41.0/dist/near-api-js.min.js"], () => {
        doNear(nearApi);
    });
}

test();
