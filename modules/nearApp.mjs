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
    if(window.wconsole)window.wconsole.innerHTML=window.wconsole.innerHTML+"near<br>";

    console.log(near);
    const wallet = new nearApi.WalletConnection(near);
    //const account = await near.account("gormantec.testnet");
    if (!wallet.isSignedIn()) {
        wallet.requestSignIn("gormantec.testnet");
    }
    console.log(wallet);
    if(window.wconsole)window.wconsole.innerHTML=window.wconsole.innerHTML+wallet+"<br>";

    const contract = new nearApi.Contract(
        wallet.account(), // the account object that is connecting
        "hello.gormantec.testnet",
        {
            // name of contract you're connecting to
            viewMethods: ["getGreeting"], // view methods do not change state but usually return a value
            changeMethods: ["setGreeting"], // change methods modify state
        }
    );

    var response=await contract.setGreeting(
        {
            message: "hello.10", // argument name and value - pass empty object if no args required
        }
    );
    if(window.wconsole)window.wconsole.innerHTML=window.wconsole.innerHTML+response+"<br>";

}



export function test() {
    console.log("TEST1!");
    require(["https://cdn.jsdelivr.net/npm/near-api-js@0.41.0/dist/near-api-js.min.js"], () => {
        doNear(nearApi);
    });
}

test();
