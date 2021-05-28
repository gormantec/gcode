export function upload() {

}

async function doNear(nearApi,config) {

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
    if (!wallet.isSignedIn()) {
        wallet.requestSignIn("gormantec.testnet");
    }
    console.log(wallet);
    if(window.wconsole)window.wconsole.log("wallet => "+wallet._authData.accountId);
    var ct={};
    config.methods.forEach(e => {
        ct[e.type]=ct[e.type] || [];
        ct[e.type].push(e.method);
    });

    const contract = new nearApi.Contract(wallet.account(), config.accountId,ct);
    console.log(contract);

    config.methods.forEach(e => {
        if(window.wconsole)window.wconsole.log(e.method+'('+e.parameters+')');
        var response = await contract[e.method](e.parameters);
        if(window.wconsole)window.wconsole.log(e.method+" => "+response);
    });

}



export function test() {
    console.log("TEST1!");
    require(["https://cdn.jsdelivr.net/npm/near-api-js@0.41.0/dist/near-api-js.min.js"], () => {
        doNear(nearApi,{accountId:"hello.gormantec.testnet",methods:[{method:"setGreeting",type:"changeMethods",parameters:{message:"hello test"}},{method:"getGreeting",type:"viewMethods",parameters:{accountId:"hello.gormantec.testnet"}}]});
    });
}

test();
