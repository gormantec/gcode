export class BluetoothDevice {
    constructor({peripheralId,peripheralName}) {
        this.id= peripheralId;
        this.name= peripheralName;
        this.gatt= new GattServerConnector({peripheralId:this.id, peripheralName:this.name})
    }

    addEventListener(type, f) {
        if (type == 'gattserverdisconnected') {
            window.addEventListener("bluetooth-peripheral-disconnect-" + this.id, f);
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
    constructor({peripheralId}) {
        this.peripheralId=peripheralId;
    }
    getPrimaryServices() {

        let start = Date.now(),
        id = Math.floor(Math.random() * 16777215).toString(16) +
            '-' + Math.floor(Math.random() * 16777215).toString(16) +
            '-' + Date.now().toString(16),
        messagetype = 'bluetooth-gatt-discover-services';
        let message={id: id,data: {peripheralId:this.peripheralId}};
        console.log(messagetype);
        console.log(message);
        window.webkit.messageHandlers[messagetype].postMessage(message);
        let responseType = messagetype+"-" + id;
        return new Promise((resolve,reject) => {
            console.log("listen for:" + responseType);
            if(message==null || message.data==null || message.data.peripheralId==null || message.data.peripheralId=="")
            {
                reject("getPrimaryServices: peripheral ID is blank");
            }
            else{
                let eventListener = (e) => {
                    console.log("found: " + e);
                    window.removeEventListener(responseType, eventListener);
                    resolve([new PrimaryService({uuid:"service1"}), new PrimaryService({uuid:"service2"})]);
                };
                window.addEventListener(responseType, eventListener);
            }
        })
    }
}

export class GattServerConnector {
    constructor({peripheralId, peripheralName}) {
        this.peripheralId = peripheralId;
        this.peripheralName = peripheralName;
    }

    connect() {        
        let start = Date.now(),
        id = Math.floor(Math.random() * 16777215).toString(16) +
            '-' + Math.floor(Math.random() * 16777215).toString(16) +
            '-' + Date.now().toString(16),
        messagetype = 'bluetooth-connect-device';
        let message={id: id,data: {peripheralId:this.peripheralId}};
        console.log(messagetype);
        console.log(message);
        window.webkit.messageHandlers[messagetype].postMessage(message);
        let responseType = messagetype+"-" + id;
        return new Promise((resolve,reject) => {
            console.log("listen for:" + responseType);
            if(message==null || message.data==null || message.data.peripheralId==null || message.data.peripheralId=="")
            {
                reject("connect: peripheral ID is blank")
            }
            else{
                let eventListener = (e) => {
                    console.log("found: " + e);
                    window.removeEventListener(responseType, eventListener);
                    resolve(new GattServer({peripheralId:this.peripheralId}));
                };
                window.addEventListener(responseType, eventListener);
            }
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
        let responseType = messagetype+"-" + id;
        return new Promise((resolve) => {
            console.log("listen for:" + responseType);
            let eventListener = (e) => {
                console.log("found: " + e);
                window.removeEventListener(responseType, eventListener);
                resolve(new BluetoothDevice({peripheralId:e.detail.selectedPeripheralId,peripheralName:e.detail.selectedPeripheralName}));
            };
            window.addEventListener(responseType, eventListener);
        });
    }

}