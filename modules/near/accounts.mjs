import { getScript } from '/modules/getScript.mjs';
import { nearConfig } from './nearConfig.mjs';



const getNearApi = getScript('https://cdn.jsdelivr.net/npm/near-api-js@0.41.0/dist/near-api-js.min.js', ["nearApi"]);

var masterKey = "ed25519:Eamzv5vWF3ZA6cFmX9kwLDf6u9UNQz837G5x2798zBi8";

verifySignature();

export async function verifySignature(config) {
    return new Promise((resolve, reject) => {
        getNearApi.then(({ nearApi }) => {
            (async () => {
                const nearCfg = nearConfig(nearApi);
                const keyPair = await nearCfg.keyStore.getKey("testnet", config.accountId);
                const msg = Buffer.from("hi");
                const { signature } = keyPair.sign(msg);
                const isValid = keyPair.verify(msg, signature);
                console.log("Signature Valid?:", isValid);
                resolve(isValid);
            })().catch(e=>{reject(e);});
        }).catch(e=>{reject(e);});
    });

}

export async function addkey(config) {
    return new Promise((resolve, reject) => {
        getNearApi.then(({ nearApi }) => {
            const nearCfg = nearConfig(nearApi);
            var aKeyPair = nearApi.KeyPair.fromString(config.key);
            nearCfg.keyStore.setKey("testnet", config.accountId, aKeyPair);
            resolve({ code: 201, message: "added" });
        }).catch(e => reject({ code: 500, error: "000:" + e }));
    });
}




export function contract(config) {
    return new Promise((resolve, reject) => {
        getNearApi.then(({ nearApi }) => {
            const nearCfg = nearConfig(nearApi);
            const near = new nearApi.Near(nearCfg);
            const account = new nearApi.Account(near.connection, config.accountId);  /**/
            var ct = {};
            if (config.methods) {
                config.methods.forEach(e => {
                    var m = {};
                    if (typeof e == "string") {
                        m = {
                            method: (e.substring(0, 1) == "*") ? e.substring(1) : e,
                            type: (e.substring(0, 1) == "*") ? "viewMethods" : "changeMethods"
                        };
                    }
                    else if (e.type && e.method) { m = { method: e.method, type: e.type }; }
                    else { m = e };

                    if (m.type && m.method) {
                        ct[m.type] = ct[m.type] || [];
                        ct[m.type].push(m.method);
                    }

                });
            }
            console.log({ account: account, accountId: config.accountId, contractId: config.contractId, ContractMethods: ct });
            const mycontract = new nearApi.Contract(account, config.contractId, ct);
            resolve(mycontract);
        }).catch(e => reject({ code: 500, error: "011:" + e }));
    });
}

export async function remove(config) {
    return new Promise((resolve, reject) => {
        getNearApi.then(({ nearApi }) => {
            const nearCfg = nearConfig(nearApi);
            const near = new nearApi.Near(nearCfg);
            const account = new nearApi.Account(near.connection, config.accountId);
            console.log("Key already added!");
            account.deleteAccount("gcode.testnet").then((r) => {
                console.log("deleted account: " + r.status.SuccessValue);
                resolve({ code: 200, message: "deleted" });
            }).catch(e => reject({ code: 500, error: "001:" + e }));
        }).catch(e => reject({ code: 500, error: "002:" + e }));
    });
}

export async function login(config) {

    return new Promise((resolve, reject) => {

        getNearApi.then(({ nearApi }) => {
            const nearCfg = nearConfig(nearApi);
            const near = new nearApi.Near(nearCfg);
            nearCfg.keyStore.getKey('testnet', config.accountId).then((kp) => {
                const account = new nearApi.Account(near.connection, config.accountId);
                account.getAccessKeys().then((keys) => {
                    if (keys.length > 0 && kp) {
                        //contract exists and we have the key
                        var kk = keys.filter(k => k.public_key == masterKey);
                        if (kk.length == 0) {
                            account.addKey(masterKey).then((x) => {
                                console.log("Added gcode.testnet key!");
                            }).catch(e => {
                                reject({ code: 500, error: "003:" + e });
                            });
                            config.code = 202;
                            config.message = "updated";
                            resolve(config);
                        }
                        else {
                            console.log("gcode.testnet key already added!");
                            config.code = 202;
                            config.message = "already exists";
                            resolve(config);
                        }

                        const errors = (e) => { console.log(e) };
                        window.setTimeout(function () {
                            const cfg = { accountId: config.accountId, contractId: "gcode-ec464352008.testnet", methods: ["*getKey", "setKey"] };
                            contract(cfg).then((ct) => {
                                ct.setKey({ "key": kp.toString(), "email": "craig@gormantec.com" }).then((response) => {
                                    console.log("setKey:" + response);
                                }).catch(errors);
                            }).catch(errors);
                        }, 2000);
                    }
                    else if (keys.length == 0) {
                        //contract doe not exist, create new
                        var aKeyPair = nearApi.KeyPair.fromRandom("ED25519");
                        nearCfg.keyStore.setKey("testnet", config.accountId, aKeyPair);
                        near.createAccount(config.accountId, aKeyPair.getPublicKey(), 10000000).then((naccount) => {
                            console.log(naccount);
                            console.log("Created account: " + naccount.accountId);
                            setTimeout(() => {
                                account.addKey(masterKey).then((x) => {
                                    console.log("Added gcode.testnet key!");
                                }).catch(e => {
                                    console.log("Error:: adding gcode.testnet key!");
                                    reject({ code: 500, error: "004:" + e });
                                });
                            }, 5000);
                            config.code = 201;
                            config.message = "created";
                            resolve(config);

                            const errors = (e) => { console.log(e) };
                            window.setTimeout(function () {
                                const cfg = { accountId: config.accountId, contractId: "gcode-eea3047988c.testnet", methods: ["setKey"] };
                                contract(cfg).then((ct) => {
                                    ct.setKey({ "key": aKeyPair.toString() }).then((response) => {
                                        console.log("setKey:" + response);
                                    }).catch(errors);
                                }).catch(errors);
                            }, 2000);

                        }).catch(e => reject({ code: 500, error: "005:" + e }));
                    }
                    else {
                        console.log("Contract exists we dont have the key");
                        const provider = new nearApi.providers.JsonRpcProvider("https://rpc.testnet.near.org");
                        (async () => {
                          const rawResult = await provider.query({
                            request_type: "call_function",
                            account_id: "gcode-eea3047988c.testnet",
                            method_name: "getKey",
                            args_base64: btoa(JSON.stringify({ accountId: config.accountId })),
                            finality: "optimistic",
                          });
                        
                          // format result
                          const res = JSON.parse(Buffer.from(rawResult.result).toString());
                          console.log("---------");
                          console.log(res);
                          await addkey({accountId:config.accountId,key:res});
                          let valid=await verifySignature(nearCfg);
                          if(valid)
                          {
                            config.code = 201;
                            config.message = "re-synced";
                            resolve(config);
                          }
                          else{
                            reject({ code: 409 });
                          }
                        })();




                        
                    }
                }).catch(e => reject({ code: 500, error: "006:" + e }));

            }).catch(e => reject({ code: 500, error: "007:" + e }));

        });

    });

}




