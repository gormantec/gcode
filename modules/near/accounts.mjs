import { getScript } from '/modules/getScript.mjs';

const getNearApi = getScript('https://cdn.jsdelivr.net/npm/near-api-js@0.41.0/dist/near-api-js.min.js', ["nearApi"]);

var masterKey = "ed25519:Eamzv5vWF3ZA6cFmX9kwLDf6u9UNQz837G5x2798zBi8";
var keyStore;
function nearConfig(nearApi) {
    keyStore = keyStore || new nearApi.keyStores.BrowserLocalStorageKeyStore();
    return {
        keyStore: keyStore,
        networkId: 'testnet',
        nodeUrl: 'https://rpc.testnet.near.org',
        walletUrl: 'https://wallet.testnet.near.org',
        helperUrl: 'https://helper.testnet.near.org'
    };
}

export async function remove(config) {
    return new Promise((resolve, reject) => {
        getNearApi.then(({ nearApi }) => {
            const near = new nearApi.Near(nearConfig(nearApi));
            const account = new nearApi.Account(near.connection, config.accountId);
            console.log("Key already added!");
            account.deleteAccount("gcode.testnet").then((r) => {
                console.log("deleted account: " + r.status.SuccessValue);
                resolve({code:200,message:"deleted"});
            }).catch(e => reject({code:500,error:""+e}));
        }).catch(e => reject({code:500,error:""+e}));
    });
}

export async function login(config) {

    return new Promise((resolve, reject) => {
        getNearApi.then(({ nearApi }) => {
            const near = new nearApi.Near(nearConfig(nearApi));
            keyStore.getKey('testnet', config.accountId).then((kp) => {
                const account = new nearApi.Account(near.connection, config.accountId);
                account.getAccessKeys().then((keys) => {
                    if (keys.length > 0 && kp) {
                        //contract exists and we have the key
                        var kk = keys.filter(k => k.public_key == masterKey);
                        if (kk.length == 0) {
                            account.addKey(masterKey).then((x) => {
                                console.log("Added gcode.testnet key!");
                                resolve({code:202,message:"updated"});
                            }).catch(e => {
                                reject({code:500,error:""+e});
                            });
                        }
                        else {
                            console.log("gcode.testnet key already added!");
                            resolve({code:202,message:"already exists"});
                        }
                    }
                    else if (keys.length == 0) {
                        //contract doe not exist, create new
                        var aKeyPair = nearApi.KeyPair.fromRandom("ED25519");
                        keyStore.setKey("testnet", config.accountId, aKeyPair);
                        near.createAccount(config.accountId, aKeyPair.getPublicKey(), 10000000).then((account) => {
                            console.log("Created account: " + account.accountId);
                        
                            setTimeout(()=>{
                                account.addKey(masterKey).then((x) => {
                                    console.log("Added gcode.testnet key!");
                                    resolve({code:201,message:"created"});
                                }).catch(e => {
                                    console.log("Error:: adding gcode.testnet key!");
                                    reject({code:500,error:""+e});
                                });
                            },500);

                        }).catch(e => reject({code:500,error:""+e}));
                    }
                    else {
                        console.log("Contract exists we dont have the key");
                        reject({code:409});
                    }
                }).catch(e => reject({code:500,error:""+e}));

            }).catch(e => reject({code:500,error:""+e}));

        });

    });

}




