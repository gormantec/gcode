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

    config.methods.forEach(e => {
        if(window.wconsole)window.wconsole.log(e.method+'('+e.parameters+')');

        let prom = Promise.cast(mycontract[e.method](e.parameters));
        //let r = await prom;
        console.log(prom);
        var waitBoolean=true;
        prom.then((r)=>{
            console.log(r);
            if(window.wconsole)window.wconsole.log(e.method+"() result = \""+r+"\"");
            waitBoolean=false;
        });
        

        await new Promise((resolve, reject) => {
            const intV=setInterval(()=>{
                if(!waitBoolean){clearInterval(intV); resolve();}
            }, 500);
        });
    });

}





export function test() {
    require(["https://cdn.jsdelivr.net/npm/near-api-js@0.41.0/dist/near-api-js.min.js"], () => {
        doNear(nearApi,{accountId:"hello.gormantec.testnet",methods:[{method:"setGreeting",type:"changeMethods",parameters:{message:"hello test"}},{method:"getGreeting",type:"viewMethods",parameters:{accountId:"hello.gormantec.testnet"}}]});
    });
}

test();
