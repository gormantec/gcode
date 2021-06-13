import { getScript } from '/modules/getScript.mjs';
import { nearConfig } from './nearConfig.mjs';

const getNearApi = getScript('https://cdn.jsdelivr.net/npm/near-api-js@0.41.0/dist/near-api-js.min.js', ["nearApi"]);

var masterKey = "ed25519:Eamzv5vWF3ZA6cFmX9kwLDf6u9UNQz837G5x2798zBi8";


export function addkey(key) {
    return new Promise((resolve, reject) => {
        getNearApi.then(({ nearApi }) => {
            const nearCfg = nearConfig(nearApi);
            var aKeyPair = nearApi.KeyPair.fromString(config.key);
            nearCfg.keyStore.setKey("testnet", config.accountId, aKeyPair);
            resolve({ code: 201, message: "added" });
        }).catch(e => reject({ code: 500, error: "000:" + e }));
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
                                resolve({ code: 202, message: "updated" });
                            }).catch(e => {
                                reject({ code: 500, error: "003:" + e });
                            });
                        }
                        else {
                            console.log("gcode.testnet key already added!");
                            resolve({ code: 202, message: "already exists" });
                        }
                    }
                    else if (keys.length == 0) {
                        //contract doe not exist, create new
                        var aKeyPair = nearApi.KeyPair.fromRandom("ED25519");
                        nearCfg.keyStore.setKey("testnet", config.accountId, aKeyPair);
                        near.createAccount(config.accountId, aKeyPair.getPublicKey(), 10000000).then((naccount) => {
                            console.log("Created account: " + naccount.accountId);

                            setTimeout(() => {
                                account.addKey(masterKey).then((x) => {
                                    console.log("Added gcode.testnet key!");
                                    resolve({ code: 201, message: "created" });
                                }).catch(e => {
                                    console.log("Error:: adding gcode.testnet key!");
                                    reject({ code: 500, error: "004:" + e });
                                });
                            }, 5000);

                        }).catch(e => reject({ code: 500, error: "005:" + e }));
                    }
                    else {
                        console.log("Contract exists we dont have the key");
                        reject({ code: 409 });
                    }
                }).catch(e => reject({ code: 500, error: "006:" + e }));

            }).catch(e => reject({ code: 500, error: "007:" + e }));

        });

    });

}




