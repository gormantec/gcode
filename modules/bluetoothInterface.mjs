export class BluetoothInterface
{
    constructor()
    {

    }

    getBluetooth()
    {
        return {
            requestDevice: (d) => {
                let start = Date.now(),
                    timeout = 60000,
                    id = Math.floor(Math.random() * 16777215).toString(16) + '-' + Math.floor(Math.random() * 16777215).toString(16) + '-' + Date.now().toString(16),
                    messagetype = 'bluetooth-request-device';
                window.webkit.messageHandlers[messagetype].postMessage({
                    id: id,
                    data: d
                });
                let responseType = "bluetooth-request-device-" + id;
                return new Promise((resolve, reject) => {
                      console.log("listen for:"+responseType);
                    window.addEventListener(responseType, (e) => {
                      console.log("event :"+responseType);
                        resolve({
                            id: e.detail.selectedPeripheralId,
                            name: e.detail.selectedPeripheralName,
                            addEventListener: (type, f) => {
                                if (type == 'gattserverdisconnected') {
                                    window.webkit.messageHandlers[messagetype].postMessage({
                                        id: id,
                                        data: d
                                    });
                                }
                            },
                            gatt: {
                                connect: () => new Promise((res1, rej1) => {
                                    res1({
                                        id: 'server',
                                        getPrimaryServices: () => new Promise((res2, rej2) => {
                                            res2([{
                                                    uuid: 'service1',
                                                    getCharacteristics: () => new Promise((res3, rej3) => {
                                                        res3([{
                                                            value: 'value1',
                                                            properties: {
                                                                notify: true
                                                            },
                                                            addEventListener: (type, f) => {
                                                                console.log('addEventListener');
                                                            },
                                                            startNotifications: () => {
                                                                console.log('startNotifications');
                                                            }
                                                        }]);
                                                    })

                                                },
                                                {
                                                    uuid: 'service2',
                                                    getCharacteristics: () => new Promise((res4, rej4) => {
                                                        res4([{
                                                            value: 'value1',
                                                            properties: {
                                                                notify: true
                                                            },
                                                            addEventListener: (type, f) => {
                                                                console.log('addEventListener');
                                                            },
                                                            startNotifications: () => {
                                                                console.log('startNotifications');
                                                            }
                                                        }]);
                                                    })

                                                }
                                            ])
                                        })
                                    })

                                })
                            }
                        });
                    });

                });
            }
        }
    }
}