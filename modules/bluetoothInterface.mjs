export class BluetoothDevice {
    constructor({ peripheralId, peripheralName, state, rssi }) {
        this.id = peripheralId;
        this.name = peripheralName;
        this.state = state || false;
        this.rssi =rssi;
        this.gatt = new GattServerConnector({ peripheralId: this.id, peripheralName: this.name })
    }

    addEventListener(type, _func) {
        if (type == 'gattserverdisconnected') {
            window.addEventListener("bluetooth-peripheral-disconnect-" + this.id, f);
        }
        else if (type == 'advertisementreceived') {
            let _this=this;
            window.addEventListener("bluetooth-peripheral-found", (e)=>{
                if(e.detail.identifier==this.id)
                {
                    _this.name = (e.name && e.name != "") ? e.name : (_this.name && _this.name != "N/A") ? _this.name:"N/A";
                    _this.rssi =e.detail.rssi;
                    _this.state =e.detail.state;
                    _func({device:{name:_this.name,id:_this.id,rssi:_this.rssi,txPower:"",uuids:""},manufacturerData:[],serviceData:[]});
                }
            });
        }
    }
    watchAdvertisements()
    {

    }


}

function _b64toBuffer(b64Data, sliceSize=512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
  
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
  
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
  
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
  
    return new Uint8Array(byteArrays);
  }

export class Characteristic {
    constructor({ uuid, serviceUuid, peripheralId, value, propertiesCount, read, write, notify }) {
        this.uuid = uuid;
        this.serviceUuid = serviceUuid;
        this.peripheralId = peripheralId;
        this.value = value;
        this.propertiesCount = propertiesCount;
        this.properties = {}
        if (read) this.properties.read = read;
        if (write) this.properties.write = write;
        if (notify) this.properties.notify = notify;
    }



    addEventListener(type, f) {
        console.log('addEventListener');
        let _func=f;
        let _target=this;
        window.addEventListener("bluetooth-characteristic-read-" + this.peripheralId + "-" + this.serviceUuid + "-" + this.uuid, (e)=>{
                    if (e.detail && (e.detail.value || e.detail.value == "")) {
                        if(e.detail.value==null || e.detail.value=="")
                        {
                            _target.value = new Uint8Array([]);
                        }
                        else
                        {
                            _target.value = new Uint8Array(_this.value);
                        }
                        
                    }
                    _func({target:_target});
        });
    }

    startNotifications() {
        console.log("startNotifications1")
        if (this.properties.notify) {
            console.log("startNotifications2")
            let start = Date.now(),
                id = Math.floor(Math.random() * 16777215).toString(16) +
                    '-' + Math.floor(Math.random() * 16777215).toString(16) +
                    '-' + Date.now().toString(16),
                messagetype = 'bluetooth-characteristic-notify';
            let message = { id: id, data: { peripheralId: this.peripheralId, serviceUuid: this.serviceUuid, uuid: this.uuid } };
            let responseType = messagetype + "-" + id;
            return new Promise((resolve, reject) => {
                console.log("listen for:" + responseType);
                let eventListener = (e) => {
                    console.log("found:" + responseType);
                    if(e.detail.notify==true)
                    {
                        resolve();
                    }
                    else{
                        reject(e.detail)
                    }
                    
                };
                window.addEventListener(responseType, eventListener);
                window.webkit.messageHandlers[messagetype].postMessage(message);
            });
        }
    }

    readValue() {
        console.log("readValue1");
        if (this.properties.read) {
            console.log("readValue2");
            let start = Date.now(),
                id = Math.floor(Math.random() * 16777215).toString(16) +
                    '-' + Math.floor(Math.random() * 16777215).toString(16) +
                    '-' + Date.now().toString(16),
                messagetype = 'bluetooth-characteristic-read';
            let message = { id: id, data: { peripheralId: this.peripheralId, serviceUuid: this.serviceUuid, uuid: this.uuid } };
            let responseType = messagetype +"-"+ this.peripheralId + "-" + this.serviceUuid + "-" + this.uuid;
            let _this=this;
            return new Promise((resolve, reject) => {
                console.log("listen for:" + responseType);
                let eventListener = (e) => {
                    console.log("found:" + responseType);
                    window.removeEventListener(responseType, eventListener);
                    console.log(e.detail);
                    if (e.detail && (e.detail.value || e.detail.value == "")) {
                        _this.value = new Uint8Array(e.detail.value);
                    }
                    resolve(_this.value);
                };
                window.addEventListener(responseType, eventListener);
                window.webkit.messageHandlers[messagetype].postMessage(message);
            });
        }
    }
}

export class PrimaryService {
    constructor({ uuid, peripheralId }) {
        this.uuid = uuid;
        this.peripheralId = peripheralId;
    }
    getCharacteristics() {
        let start = Date.now(),
            id = Math.floor(Math.random() * 16777215).toString(16) +
                '-' + Math.floor(Math.random() * 16777215).toString(16) +
                '-' + Date.now().toString(16),
            messagetype = 'bluetooth-service-characteristic';
        let message = { id: id, data: { peripheralId: this.peripheralId, uuid: this.uuid } };

        let responseType = messagetype + "-" + this.peripheralId + "-" + this.uuid;
        return new Promise((resolve, reject) => {
            console.log("listen for:" + responseType);
            if (message == null || message.data == null || message.data.peripheralId == null || message.data.peripheralId == "") {
                reject("getCharacteristics: peripheral ID is blank");
            }
            else {
                let eventListener = (e) => {
                    window.removeEventListener(responseType, eventListener);
                    let characteristics = [];
                    for (let i = 0; e.detail && e.detail.service.characteristics && i < e.detail.service.characteristics.length; i++) {
                        if (e.detail.service.characteristics[i].uuid) {
                            characteristics.push(new Characteristic({
                                uuid: e.detail.service.characteristics[i].uuid,
                                serviceUuid: e.detail.service.uuid,
                                peripheralId: e.detail.identifier,
                                value: e.detail.service.characteristics[i].value,
                                read: e.detail.service.characteristics[i].properties.read,
                                write: e.detail.service.characteristics[i].properties.write,
                                notify: e.detail.service.characteristics[i].properties.notify,
                                propertiesCount: e.detail.service.characteristics[i].propertiesCount
                            }));
                        }
                    }
                    resolve(characteristics);
                };
                window.addEventListener(responseType, eventListener);
                window.webkit.messageHandlers[messagetype].postMessage(message);
            }

        });
    }
}

export class GattServer {
    constructor({ peripheralId }) {
        this.peripheralId = peripheralId;
    }
    getPrimaryServices() {

        let start = Date.now(),
            id = Math.floor(Math.random() * 16777215).toString(16) +
                '-' + Math.floor(Math.random() * 16777215).toString(16) +
                '-' + Date.now().toString(16),
            messagetype = 'bluetooth-gatt-discover-services';
        let message = { id: id, data: { peripheralId: this.peripheralId } };
        let responseType = messagetype + "-" + this.peripheralId;
        let responseType2 = messagetype + "-" + id;
        return new Promise((resolve, reject) => {
            console.log("listen for:" + responseType);
            if (message == null || message.data == null || message.data.peripheralId == null || message.data.peripheralId == "") {
                console.log("getPrimaryServices: peripheral ID is blank");
                reject("getPrimaryServices: peripheral ID is blank");
            }
            else {
                let eventListener = (e) => {
                    console.log("found for:" + responseType);
                    window.removeEventListener(responseType, eventListener);
                    window.removeEventListener(responseType2, eventListener2);
                    let services = [];
                    for (let i = 0; e.detail && e.detail.services && i < e.detail.services.length; i++) {
                        if (e.detail.services[i].uuid) {
                            services.push(new PrimaryService({ uuid: e.detail.services[i].uuid, peripheralId: this.peripheralId }));
                        }
                    }
                    resolve(services);
                };
                let eventListener2 = (e) => {
                    console.log("found :" + responseType2 + " --> " + JSON.stringify(e));
                    window.removeEventListener(responseType, eventListener);
                    window.removeEventListener(responseType2, eventListener2);
                    if (e.detail.error) {
                        reject(e.detail.error);
                    }
                    else if (e.detail.services) {
                        let services = [];
                        for (let i = 0; e.detail && e.detail.services && i < e.detail.services.length; i++) {
                            if (e.detail.services[i].uuid) {
                                services.push(new PrimaryService({ uuid: e.detail.services[i].uuid, peripheralId: this.peripheralId }));
                            }
                        }
                        resolve(services);
                    }

                };
                window.addEventListener(responseType, eventListener);
                window.addEventListener(responseType2, eventListener2);
                window.webkit.messageHandlers[messagetype].postMessage(message);
            }
        })
    }
}

export class GattServerConnector {
    constructor({ peripheralId, peripheralName }) {
        this.peripheralId = peripheralId;
        this.peripheralName = peripheralName;
    }

    connect() {
        let start = Date.now(),
            id = Math.floor(Math.random() * 16777215).toString(16) +
                '-' + Math.floor(Math.random() * 16777215).toString(16) +
                '-' + Date.now().toString(16),
            messagetype = 'bluetooth-connect-device';
        let message = { id: id, data: { peripheralId: this.peripheralId } };
        console.log(messagetype);
        console.log(message);

        let responseType = messagetype + "-" + this.peripheralId;
        let responseType2 = messagetype + "-" + id;
        return new Promise((resolve, reject) => {
            if (message == null || message.data == null || message.data.peripheralId == null || message.data.peripheralId == "") {
                reject("connect: peripheral ID is blank")
            }
            else {
                let eventListener = (e) => {
                    window.removeEventListener(responseType, eventListener);
                    window.removeEventListener(responseType2, eventListener2);
                    resolve(new GattServer({ peripheralId: this.peripheralId }));
                };
                let eventListener2 = (e) => {
                    window.removeEventListener(responseType, eventListener);
                    window.removeEventListener(responseType2, eventListener2);
                    reject(e.detail);
                };
                window.addEventListener(responseType, eventListener);
                window.addEventListener(responseType2, eventListener2);
                window.webkit.messageHandlers[messagetype].postMessage(message);
            }
        })
    }
}
export class BluetoothInterface {
    constructor() {

    }

    requestDevice({ acceptAllDevices }) {
        let start = Date.now(),
            timeout = 60000,
            id = Math.floor(Math.random() * 16777215).toString(16) +
                '-' + Math.floor(Math.random() * 16777215).toString(16) +
                '-' + Date.now().toString(16),
            messagetype = 'bluetooth-request-device';
        let message = { id: id, data: { acceptAllDevices: acceptAllDevices } };

        let responseType = messagetype + "-" + id;
        let _this=this;
        return new Promise((resolve) => {
            console.log("listen for:" + responseType);
            let eventListener = (e) => {
                clearInterval(_this.keepScanningInterval);
                window.removeEventListener(responseType, eventListener);
                console.log(e.detail);
                resolve(new BluetoothDevice({ peripheralId: e.detail.selectedPeripheralId, peripheralName: e.detail.selectedPeripheralName,state:e.detail.state,rssi:e.detail.rssi }));
            };
            window.addEventListener(responseType, eventListener);
            window.webkit.messageHandlers[messagetype].postMessage(message);
            _this.keepScanningInterval=setInterval(()=>window.webkit.messageHandlers[messagetype].postMessage({id:0,data:{keepScanning:true}}),10000);
        });
    }

}