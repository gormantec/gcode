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

export class Characteristic {
    constructor({uuid,peripheralId,value,propertiesCount}) {
        this.uuid= uuid;
        this.peripheralId= peripheralId;
        this.value= value;
        this.propertiesCount=propertiesCount;
        this.properties={
            notify: true
        }

    }

    addEventListener(type, f){
        console.log('addEventListener');
    }

    startNotifications(){
        console.log('startNotifications');
    }    
}

export class PrimaryService {
    constructor({uuid,peripheralId}) {
        this.uuid = uuid;
        this.peripheralId=peripheralId;
    }
    getCharacteristics() {
        let start = Date.now(),
        id = Math.floor(Math.random() * 16777215).toString(16) +
            '-' + Math.floor(Math.random() * 16777215).toString(16) +
            '-' + Date.now().toString(16),
        messagetype = 'bluetooth-service-characteristic';
        let message={id: id,data: {peripheralId:this.peripheralId,uuid:this.uuid}};
        console.log(messagetype);
        console.log(message);
        window.webkit.messageHandlers[messagetype].postMessage(message);
        let responseType = messagetype+"-" + this.peripheralId+"-" + this.uuid;
        return new Promise((resolve,reject) => {
            console.log("listen for:" + responseType);
            if(message==null || message.data==null || message.data.peripheralId==null || message.data.peripheralId=="")
            {
                reject("getCharacteristics: peripheral ID is blank");
            }
            else{
                let eventListener = (e) => {
                    console.log("getCharacteristics: " );  
                    console.log(e);
                    window.removeEventListener(responseType, eventListener);
                    let characteristics=[];
                    for(let i=0;e.detail && e.detail.service.characteristics && i<e.detail.service.characteristics.length;i++)
                    {
                        if(e.detail.service.characteristics[i].uuid)
                        {
                            characteristics.push(new Characteristic({uuid:e.detail.service.characteristics[i].uuid,peripheralId:e.detail.identifier,value:e.detail.service.characteristics[i].value,propertiesCount:e.detail.service.characteristics[i].propertiesCount}));
                        }
                    }
                    resolve(characteristics);
                };
                window.addEventListener(responseType, eventListener);
            }
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
        let responseType = messagetype+"-" + this.peripheralId;
        return new Promise((resolve,reject) => {
            console.log("listen for:" + responseType);
            if(message==null || message.data==null || message.data.peripheralId==null || message.data.peripheralId=="")
            {
                reject("getPrimaryServices: peripheral ID is blank");
            }
            else{
                let eventListener = (e) => {
                    console.log("getPrimaryServices: " );  
                    console.log(e);
                    window.removeEventListener(responseType, eventListener);
                    let services=[];
                    for(let i=0;e.detail && e.detail.services && i<e.detail.services.length;i++)
                    {
                        if(e.detail.services[i].uuid)
                        {
                            services.push(new PrimaryService({uuid:e.detail.services[i].uuid,peripheralId:this.peripheralId}));
                        }
                    }
                    resolve(services);
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
        let responseType = messagetype+"-" + this.peripheralId;
        return new Promise((resolve,reject) => {
            console.log("listen for:" + responseType);
            if(message==null || message.data==null || message.data.peripheralId==null || message.data.peripheralId=="")
            {
                reject("connect: peripheral ID is blank")
            }
            else{
                let eventListener = (e) => {
                    console.log("connect: " );
                    console.log(e);
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