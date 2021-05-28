export function upload() {

}

async function doNear(nearApi, config) {

    const keyStore = new nearApi.keyStores.BrowserLocalStorageKeyStore();
    const near = new nearApi.Near({
        keyStore: keyStore,
        networkId: 'testnet',
        nodeUrl: 'https://rpc.testnet.near.org',
        walletUrl: 'https://wallet.testnet.near.org'
    });

    await new Promise((resolve, reject) => setTimeout(resolve, 3000));

    if (window.wconsole) window.wconsole.log("connecting to near..");

    if (window.wconsole) window.wconsole.log("on network: " + near.connection.networkId);


    

    const wallet = new nearApi.WalletConnection(near);
    if (!wallet.isSignedIn()) {
        wallet.requestSignIn(config.myAccountId);
    }
    console.log(wallet);
    if (window.wconsole) window.wconsole.log("using wallet: " + wallet._authData.accountId);
    var ct = {};
    config.methods.forEach(e => {
        ct[e.type] = ct[e.type] || [];
        ct[e.type].push(e.method);
    });


    const mycontract = new nearApi.Contract(wallet.account(), config.contractId, ct);
    if (window.wconsole) window.wconsole.log("using mycontract: " + mycontract.contractId);
    console.log(mycontract.contractId);
    const list = config.methods;
    var doLoop = (i) => {
        if (window.wconsole) window.wconsole.log(list[i].method + '(' + JSON.stringify(list[i].parameters) + ')');
        mycontract[list[i].method](list[i].parameters).then((r) => {
            console.log("loop: " + i);
            if (window.wconsole) window.wconsole.log(list[i].method + "() result = " + r);
            if ((i + 1) < list.length) doLoop(i + 1);
        });
    };
    doLoop(0);

}





export function test() {
    require(["https://cdn.jsdelivr.net/npm/near-api-js@0.41.0/dist/near-api-js.min.js"], () => {
        doNear(nearApi, { 
            myAccountId: "gormantec.testnet", 
            contractId: "hello.gormantec.testnet", 
            methods: [
                { method: "setGreeting", type: "changeMethods", parameters: { message: "hello "+(Math.round(Date.now() / 1000)-1622206047) } }, 
                { method: "getGreeting", type: "viewMethods", parameters: { accountId: "gormantec.testnet" } 
            }] });
    });
}

test();
