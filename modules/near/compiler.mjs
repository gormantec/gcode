import { getScript } from '/modules/getScript.mjs';
import { awsConfig } from '/modules/awsConfig.mjs';
import { nearConfig } from './nearConfig.mjs';

const getNearApi = getScript('https://cdn.jsdelivr.net/npm/near-api-js@0.41.0/dist/near-api-js.min.js', ["nearApi"]);
const getAWS = getScript('https://sdk.amazonaws.com/js/aws-sdk-2.918.0.min.js', ["AWS"]);
const getJSZip = getScript('https://gcode.com.au/js/jszip.min.js', ["JSZip"]);





export async function upload() {
    return new Promise((resolve, reject) => {
    });
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
                        nearCfg.keyStore.getKey("testnet", config.accountId).then((key) => {
                            getAWS.then(({ AWS }) => {
                                AWS.config.update(awsConfig());
                                console.log("lambda");
                                var lambda = new AWS.Lambda();
                                console.log("invoke");
                                lambda.invoke({
                                    FunctionName: "near-sdk-as-rpc", /* required  */
                                    Payload: JSON.stringify({
                                        "code": "dGhpcyBpcyBzb21lIHRleHQ=",
                                        "key": key.toString(),
                                        "accountId": config.accountId,
                                        assembly: content
                                    })
                                }, function (err, data) {
                                    if(err)console.log(err);
                                    if (data && data.StatusCode == 200) {
                                        console.log(JSON.parse(JSON.parse(data.Payload).body).data);
                                        if (err) console.log(err, err.stack); // an error occurred
                                        else console.log(data);           // successful response
                                        resolve({ content: content, response: JSON.parse(JSON.parse(data.Payload).body).data });
                                    }
                                    else if (data && data.StatusCode!=null) {
                                        reject({ code: data.StatusCode, error: "000:" + data.Payload });
                                    }
                                    else {
                                        reject({ code: 500, error: "000:" +err});
                                    }
                                });
                            }).catch(e => reject({ code: 500, error: "001:" + e }));
                        }).catch(e => reject({ code: 500, error: "002:" + e }));

                    }).catch(e => reject({ code: 500, error: "003:" + e }));
                });
        }).catch(e => reject({ code: 500, error: "004:" + e }));
    });
}

async function doNear(nearApi, config) {


    window.wconsole=window.wconsole || window.console;
    await new Promise((resolve, reject) => setTimeout(resolve, 500));
    return new Promise((resolve, reject) => {

        getNearApi.then(({ nearApi }) => {
            const nearCfg = nearConfig(nearApi);
            const near = new nearApi.Near(nearCfg);
            const account = new nearApi.Account(near.connection, config.accountId);
            console.log("testing");
            if (window.wconsole) window.wconsole.log("connecting to near..");
            if (window.wconsole) window.wconsole.log("on network: " + near.connection.networkId);
            if (window.wconsole) window.wconsole.log("using account: " + config.accountId);
            var ct = {};
            config.methods.forEach(e => {
                ct[e.type] = ct[e.type] || [];
                ct[e.type].push(e.method);
            });


            const mycontract = new nearApi.Contract(account, config.contractId, ct);
            if (window.wconsole) window.wconsole.log("using mycontract: " + mycontract.contractId);
            console.log(mycontract.contractId);
            const list = config.methods;
            var doLoop = (i) => {
                if (window.wconsole) window.wconsole.log(list[i].method + '(' + JSON.stringify(list[i].parameters) + ')');
                var modP=list[i].parameters;
                for (const key in modP) {
                    if (modP.hasOwnProperty(key)) {
                        if(modP[key].startsWith("@Near." && config[modP[key].substring(6)]))modP[key]=config[modP[key].substring(6)];
                    }
                }
                mycontract[list[i].method](list[i].parameters).then((r) => {
                    console.log("loop: " + i);
                    if (window.wconsole) window.wconsole.log(list[i].method + "( result = " + r + " )");
                    if ((i + 1) < list.length) doLoop(i + 1);
                    else resolve();
                });
            };
            doLoop(0);
        });
    });

}





export async function test(testcases) {
    getNearApi.then(({ nearApi }) => {
        doNear(nearApi, testcases);
    }).catch(e => reject({ code: 500, error: "005:" + e }));
}
