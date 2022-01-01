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
                            /*
                            fetch("https://near.gcode.com.au/", {
                                method: 'post',
                                body: JSON.stringify({
                                    "code": "dGhpcyBpcyBzb21lIHRleHQ=",
                                    "key": key.toString(),
                                    "accountId": config.accountId,
                                    assembly: content
                                })
                            }).then(function (response) {
                                return response.json();
                            }).then(function (data) {
                                console.log(data);
                                resolve({ content: content, response: data.data.data });
                            }).catch(e => reject({ code: 500, error: "001:" + e }));
                            */
                            getAWS.then(({ AWS }) => {
                                AWS.config.update(awsConfig());
                                console.log("lambda");
                                var lambda = new AWS.Lambda();
                                console.log("invoke");
                                lambda.invoke({
                                    FunctionName: "near-sdk-as-rpc", 
                                    Payload: JSON.stringify({
                                        "code": "dGhpcyBpcyBzb21lIHRleHQ=",
                                        "key": key.toString(),
                                        "accountId": config.accountId,
                                        assembly: content
                                    })
                                }, function (err, data) {
                                    if(err)console.log("Error:"+err);
                                    console.log(data);
                                    try{console.log(JSON.parse(data.Payload));}catch(e){}
                                    if (data && data.FunctionError!="Unhandled" && data.StatusCode == 200) {
                                        var status="failed";
                                        try{status=JSON.parse(data.Payload).body.status}catch(e){}
                                        if(status!="failed")
                                        {
                                            console.log("Success");
                                            try{console.log(JSON.parse(data.Payload).body.data);}
                                            catch(e){console.log("data:"+data);console.log("err:"+err);}
                                            if (err) console.log(err, err.stack); // an error occurred
                                            else console.log(data);           // successful response
                                            resolve({ content: content, response: JSON.parse(data.Payload).body.data });
                                        }
                                        else{
                                            console.log("Failed:001");
                                            var errorJson="???";
                                            try{errorJson=JSON.parse(data.Payload).success}catch(e){}
                                            reject({ code: 503, error: "001:" + errorJson });
                                        }

                                    }
                                    else if (data && data.Payload!=null ) {
                                        console.log("Failed:002");
                                        reject({ code: 502, error: "002:" + data.Payload });
                                    }
                                    else if (data && data.Payload!=null ) {
                                        console.log("Failed:003");
                                        reject({ code: 502, error: "0023" + data.Payload });
                                    }
                                    else {
                                        console.log("Failed:004");
                                        reject({ code: 500, error: "004:" +err});
                                    }
                                });
                            }).catch(e => reject({ code: 500, error: "001:" + e }));

                            /**/
                        }).catch(e => reject({ code: 500, error: "002:" + e }));

                    }).catch(e => reject({ code: 500, error: "003:" + e }));
                });
        }).catch(e => reject({ code: 500, error: "005:" + e }));
    });
}

async function doNear(nearApi, config) {


    window.wconsole = window.wconsole || window.console;
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
            if(config.methods)
            {
                config.methods.forEach(e => {
                    ct[e.type] = ct[e.type] || [];
                    ct[e.type].push(e.method);
                });
            }
            const mycontract = new nearApi.Contract(account, config.contractId, ct);
            if (window.wconsole) window.wconsole.log("using mycontract: " + mycontract.contractId);
            console.log(mycontract.contractId);
            console.log(mycontract);
            const list = config.methods;
            let success = true;
            var doLoop = (i) => {

                var modP = list[i].parameters;
                for (const key in modP) {
                    if (modP.hasOwnProperty(key)) {
                        if (typeof modP[key]=="string" && modP[key].startsWith("@Near.") && config[modP[key].substring(6)]) modP[key] = config[modP[key].substring(6)];
                        else if(typeof modP[key]=="array" )
                        {
                            console.log(modP[key]);
                        }
                    }
                    console.log("param:"+key+":"+modP[key]+" ("+(typeof modP[key])+")");
                    if(typeof modP[key]=="object")modP[key]=JSON.stringify(modP[key]);
                }
                console.log(list[i].method + '(' + JSON.stringify(modP) + ')');
                if (window.wconsole) window.wconsole.log(list[i].method + '(' + JSON.stringify(modP) + ')');
            
                console.log("mycontract method:"+mycontract[list[i].method]);
                console.log("mycontract typeof:"+typeof mycontract[list[i].method]);

                console.log("------------X");
                console.log(modP);
                mycontract[list[i].method](modP,300000000000000).then((r) => {

                console.log("------------X");
                    try{
                        console.log("loop: " + i);
                        if (window.wconsole) window.wconsole.log(list[i].method + "( result = " + r + " )");
                        var rgx=list[i].result;
                        var rrr=null;
                        try{rrr=JSON.parse(r);}catch(e){}
                        console.log("rgx:"+JSON.stringify(rgx).replace(/\d\d\d\d-\d\d-\d\dT[-\d]*?:\d\d:\d\d\.\d\d\dZ/g,""));
                        console.log("rrr:"+JSON.stringify(rrr).replace(/\d\d\d\d-\d\d-\d\dT[-\d]*?:\d\d:\d\d\.\d\d\dZ/g,""));
                        if(rgx.data && rrr && rrr.data && JSON.stringify(rgx).replace(/\d\d\d\d-\d\d-\d\dT[-\d]*?:\d\d:\d\d\.\d\d\dZ/g,"")==JSON.stringify(rrr).replace(/\d\d\d\d-\d\d-\d\dT[-\d]*?:\d\d:\d\d\.\d\d\dZ/g,"")) window.wconsole.log( "[PASSED*]")
                        else if (list[i].result == r || list[i].result == ("" + r + "") || (list[i].result == "null" && r == "") || list[i].result == r.trim()) window.wconsole.log( "[PASSED]")
                        else { window.wconsole.log( "[FAILED]"); success = false; }
                        if ((i + 1) < list.length) doLoop(i + 1);
                        else resolve(success);
                    }
                    catch(e)
                    {
                        console.log(e);
                        resolve(false);
                    }
                }).catch((e)=>{
                    console.log(e);
                });
                console.log("------------");
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
