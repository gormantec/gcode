export class BluetoothDevice {
    constructor({id,name}) {
        this.id= id;
        this.name= name;
        this.gatt= new GattServerConnector({id:id, name:name})
    }

    addEventListener(type, f) {
        if (type == 'gattserverdisconnected') {
            window.addEventListener("bluetooth-peripheral-disconnect-" + id, f);
        }
    }

    
}

export class PrimaryService {
    constructor({uuid}) {
        this.uuid = uuid;
    }
    getCharacteristics() {
        return new Promise((res3, rej3) => {
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
        });
    }
}

export class GattServer {
    constructor() {
        this.id = 'server';
    }
    getPrimaryServices() {
        new Promise((res2, rej2) => { res2([new PrimaryService({uuid:"service1"}), new PrimaryService({uuid:"service2"})]) });
    }
}

export class GattServerConnector {
    constructor({id, name}) {
        this.id = id;
        this.name = name;
    }

    connect() {
        return new Promise((res1, rej1) => {
            res1(new GattServer());
        })
    }
}
export class BluetoothInterface {
    constructor() {

    }

    requestDevice({acceptAllDevices}) {
        let start = Date.now(),
            timeout = 60000,
            id = Math.floor(Math.random() * 16777215).toString(16) +
                '-' + Math.floor(Math.random() * 16777215).toString(16) +
                '-' + Date.now().toString(16),
            messagetype = 'bluetooth-request-device';
        window.webkit.messageHandlers[messagetype].postMessage({id: id,data: {acceptAllDevices:acceptAllDevices} });
        let responseType = "bluetooth-request-device-" + id;
        return new Promise((resolve, reject) => {
            console.log("listen for:" + responseType);
            let eventListener = (e) => {
                console.log("found: " + e);
                window.removeEventListener(responseType, eventListener);
                resolve(new BluetoothDevice({id:e.detail.selectedPeripheralId,name:e.detail.selectedPeripheralName}));
            };
            window.addEventListener(responseType, eventListener);
        });
    }

}