import { getScript } from '/modules/getScript.mjs';

const getNearApi=getScript('https://cdn.jsdelivr.net/npm/near-api-js@0.41.0/dist/near-api-js.min.js', ["nearApi"]);

var masterKey = "ed25519:Eamzv5vWF3ZA6cFmX9kwLDf6u9UNQz837G5x2798zBi8";
var keyStore;
function nearConfig() {
    keyStore = keyStore || new window.nearApi.keyStores.BrowserLocalStorageKeyStore();
    return {
        keyStore: keyStore,
        networkId: 'testnet',
        nodeUrl: 'https://rpc.testnet.near.org',
        walletUrl: 'https://wallet.testnet.near.org',
        helperUrl: 'https://helper.testnet.near.org'
    };
}

export async function login(config) {

    return new Promise((resolve, reject) => {
        getNearApi.then(({ nearApi }) => {
            const near = new window.nearApi.Near(nearConfig(window.nearApi));
            keyStore.getKey('testnet', config.accountId).then((kp) => {
                const account = new window.nearApi.Account(near.connection, config.accountId);
                account.getAccessKeys().then((keys) => {
                    if (keys.length > 0 && kp) {
                        //contract exists and we have the key
                        var kk = keys.filter(k => k.public_key == masterKey);
                        if (kk.length == 0) {
                            account.addKey(masterKey).then((x) => {
                                console.log("Added gcode.testnet key!");
                                resolve();
                            }).catch(e => {
                                reject(e);
                            });
                        }
                        else {
                            console.log("Key already added!");
                            account.deleteAccount("gcode.testnet").then((r) => {
                                console.log("deleted account: " + r.status.SuccessValue);
                                resolve();
                            }).catch(e => reject(e));;

                        }

                    }
                    else if (keys.length == 0) {
                        //contract doe not exist, create new
                        var aKeyPair = window.nearApi.KeyPair.fromRandom("ED25519");
                        keyStore.setKey("testnet", config.accountId, aKeyPair);
                        near.createAccount(config.accountId, aKeyPair.getPublicKey(), 10000000).then((account) => {
                            console.log("Created account: " + account.accountId);
                            resolve();
                        }).catch(e => reject(e));
                    }
                    else {
                        console.log("Contract exists we dont have the key");
                    }
                }).catch(e => reject(e));

            }).catch(e => reject(e));

        });

    });

}

export async function create(config) {

    return new Promise((resolve, reject) => {
        getNearApi.then(({ nearApi }) => {
            const near = new window.nearApi.Near(nearConfig(window.nearApi));
            keyStore.getKey('testnet', config.accountId).then((kp) => {
                const account = new window.nearApi.Account(near.connection, config.accountId);
                account.getAccessKeys().then((keys) => {
                    if (keys.length > 0 && kp) {
                        //contract exists and we have the key
                        var kk = keys.filter(k => k.public_key == masterKey);
                        if (kk.length == 0) {
                            account.addKey(masterKey).then((x) => {
                                console.log("Added gcode.testnet key!");
                                resolve();
                            }).catch(e => {
                                reject(e);
                            });
                        }
                        else {
                            console.log("Key already added!");
                            account.deleteAccount("gcode.testnet").then((r) => {
                                console.log("deleted account: " + r.status.SuccessValue);
                                resolve();
                            }).catch(e => reject(e));;

                        }

                    }
                    else if (keys.length == 0) {
                        //contract doe not exist, create new
                        var aKeyPair = window.nearApi.KeyPair.fromRandom("ED25519");
                        keyStore.setKey("testnet", config.accountId, aKeyPair);
                        near.createAccount(config.accountId, aKeyPair.getPublicKey(), 10000000).then((account) => {
                            console.log("Created account: " + account.accountId);
                            resolve();
                        }).catch(e => reject(e));
                    }
                    else {
                        console.log("Contract exists we dont have the key");
                    }
                }).catch(e => reject(e));

            }).catch(e => reject(e));

        });

    });

}



