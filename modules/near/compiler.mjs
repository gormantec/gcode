import { getScript } from '/modules/getScript.mjs';
import { awsConfig } from '/modules/awsConfig.mjs';
import { nearConfig } from './nearConfig.mjs';

const getNearApi = getScript('https://cdn.jsdelivr.net/npm/near-api-js@0.41.0/dist/near-api-js.min.js', ["nearApi"]);
const getAWS = getScript('https://sdk.amazonaws.com/js/aws-sdk-2.918.0.min.js', ["AWS"]);
const getJSZip = getScript('/js/jszip.min.js', ["JSZip"]);





export function upload() {

}


export async function login(config) {

    return new Promise((resolve, reject) => {
        getNearApi.then(({ nearApi }) => {
            const nearCfg = nearConfig(nearApi);
            const near = new nearApi.Near(nearCfg);
            const wallet = new nearApi.WalletConnection(near);
            if (!wallet.isSignedIn()) {
                console.log("requestSignIn");
                wallet.requestSignIn(config.accountId, "gcode by gormantec").then(() => {
                    wallet.account().addKey("Ha2YdgiYfvUfUAwapfJWqQEHyND81nkKdbkwYhw2wtMU").then(resolve).catch(reject);
                }).catch((e) => {
                    console.log("error");
                    console.log(e);
                    if (("" + e).indexOf("[-32000]") > 0) {
                        console.log("try and create");
                        var aKeyPair = nearApi.KeyPair.fromRandom("ED25519");
                        near.createAccount(config.accountId, aKeyPair.getPublicKey()).then(() => {
                            wallet.account().addKey("Ha2YdgiYfvUfUAwapfJWqQEHyND81nkKdbkwYhw2wtMU").then((x) => {
                                console.log("Created account!");
                                nearCfg.keyStore.setKey("testnet", config.accountId, aKeyPair);
                                console.log(x);
                                resolve();
                            }).catch(reject);
                        }).catch((e) => {
                            console.log("create error: ");
                            console.log(e);
                            reject();
                        });
                    }
                    else {
                        reject();
                    }
                });
            }
            else {
                console.log("addKey");
                wallet.account().addKey("Ha2YdgiYfvUfUAwapfJWqQEHyND81nkKdbkwYhw2wtMU").then(resolve).catch(reject);
            }
        });
    })
}

export async function compile(config) {
    return new Promise((resolve, reject) => {
        getJSZip.then(({ JSZip }) => {
            var zip = new JSZip();
            zip.file("readme.txt", "x");
            config.filesArray.forEach((inFile) => {
                const fName = inFile.name.substring(inFile.name.lastIndexOf('/') + 1);
                const dName = inFile.name.substring(0, inFile.name.lastIndexOf('/'));
                const dir = zip.folder(dName);
                if (inFile.type == "base64") {
                    dir.file(fName, inFile.data, { base64: true });
                }
                else {
                    dir.file(fName, inFile.data);
                }
            });
            zip.generateAsync({ type: "base64" })
                .then(function (content) {
                    getNearApi.then(({ nearApi }) => {
                        const nearCfg = nearConfig(nearApi);
                        getAWS.then(({ AWS }) => {
                            console.log(AWS);
                            AWS.config.update(awsConfig);
                            console.log("lambda");
                            var lambda = new AWS.Lambda();
                            console.log("invoke");
                            lambda.invoke({
                                FunctionName: "near-sdk-as-rpc", /* required */
                                Payload: JSON.stringify({
                                    "code": "dGhpcyBpcyBzb21lIHRleHQ=",
                                    "key": nearCfg.keyStore.getKey().secretKey,
                                    "accountId": config.accountId,
                                    assembly: content
                                })
                            }, function (err, data) {
                                console.log(data);
                                if (err) console.log(err, err.stack); // an error occurred
                                else console.log(data);           // successful response
                                resolve(content);
                            });
                        });
                    }).catch(() => { });
                });
        });
    });
}

async function doNear(nearApi, config) {

    const nearCfg = nearConfig(nearApi);
    const near = new nearApi.Near(nearCfg);
    await new Promise((resolve, reject) => setTimeout(resolve, 500));
    if (window.wconsole) window.wconsole.log("connecting to near..");
    if (window.wconsole) window.wconsole.log("on network: " + near.connection.networkId);
    const wallet = new nearApi.WalletConnection(near);
    if (!wallet.isSignedIn()) {
        wallet.requestSignIn(config.myAccountId, "gcode by gormantec");
    }
    else {
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





export function test(config) {
    getNearApi.then(({ nearApi }) => {
        doNear(nearApi, {
            myAccountId: config.accountId,
            contractId: config.contractId,
            methods: [
                { method: "setGreeting", type: "changeMethods", parameters: { message: "hello " + (Math.round(Date.now() / 1000) - 1622206047) } },
                {
                    method: "getGreeting", type: "viewMethods", parameters: { accountId: config.accountId }
                }]
        });
    });
}
