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


    if(window.wconsole)window.wconsole.log("connecting to near..");
    
    if(window.wconsole)window.wconsole.log("on network: "+near.connection.networkId);

    
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));

    const wallet = new nearApi.WalletConnection(near);
    if (!wallet.isSignedIn()) {
        wallet.requestSignIn("gormantec.testnet");
    }
    console.log(wallet);
    if(window.wconsole)window.wconsole.log("using wallet: "+wallet._authData.accountId);
    var ct={};
    config.methods.forEach(e => {
        ct[e.type]=ct[e.type] || [];
        ct[e.type].push(e.method);
    });
    

    const mycontract = new nearApi.Contract(wallet.account(), config.accountId,ct);
    if(window.wconsole)window.wconsole.log("using mycontract: "+mycontract);
    console.log(mycontract);
    var doLoop=(i,list)=>{
        if(window.wconsole)window.wconsole.log(list[i].method+'('+list[i].parameters+')');
        mycontract[list[i].method](e.parameters).then(()=>{
            console.log("loop: "+i);
            if(window.wconsole)window.wconsole.log(e.method+"() result = \""+r+"\"");
            if((i+1)<list.length)doLoop(i+1,list);
        });
    };
    doLoop(0,config.methods);

}





export function test() {
    require(["https://cdn.jsdelivr.net/npm/near-api-js@0.41.0/dist/near-api-js.min.js"], () => {
        doNear(nearApi,{accountId:"hello.gormantec.testnet",methods:[{method:"setGreeting",type:"changeMethods",parameters:{message:"hello test"}},{method:"getGreeting",type:"viewMethods",parameters:{accountId:"hello.gormantec.testnet"}}]});
    });
}

test();
