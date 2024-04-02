/*

  filename:git://gormantec:gcode_repo/find-my-airpods.lib.mjs
  created: 2024-3-2T14:31:21
  appName: gcode
  splashSize: 300px
 splash: https://gcode.com.au/images/ios/ios-appicon-180-180.png
  icon: https://gcode.com.au/images/ios/ios-appicon-180-180op.png
  icon180x180: https://gcode.com.au/images/ios/ios-appicon-180-180op.png
  mockFrame: iphoneX
  splashBackgroundColor: #005040
  splashDuration: 2000

*/

/*---------------------------------------------------------------------------*/
import {
    Div
} from 'https://gcode.com.au/modules/pwa.mjs';

export class LeftLight extends Div {
    constructor(params) {
        super({
            "backgroundColor": "#FFA500",
            id: "leftLight",
            height: "10px",
            width: "10px",
            left: "110px",
            top: "120px",
            borderRadius: "40px"
        });
    }
}
export class RightLight extends Div {
    constructor(params) {
        super({
            "backgroundColor": "#FFA500",
            id: "rightLight",
            height: "10px",
            width: "10px",
            right: "110px",
            top: "120px",
            borderRadius: "40px"
        });
    }
}

export class AirPods extends Div {
    constructor(params) {
        super({
            top: "0px",
            bottom: "0px",
            left: "0px",
            right: "0px",
            children: [
                new Div({
                    "color": "#ffffff",
                    height: "50px",
                    width: "50px",
                    left: "100px",
                    top: "100px",
                    borderRadius: "40px",
                    borderColor: "#aaaaaa",
                    borderStyle: "solid",
                    borderThickness: "1px"
                }),
                new Div({
                    "color": "#ffffff",
                    height: "50px",
                    width: "50px",
                    right: "100px",
                    top: "100px",
                    borderRadius: "40px",
                    borderColor: "#aaaaaa",
                    borderStyle: "solid",
                    borderThickness: "1px"
                }),
                new Div({
                    "color": "#ffffff",
                    height: "29px",
                    width: "10px",
                    left: "94px",
                    top: "112px",
                    backgroundColor: "#ffffff",
                    borderColor: "#aaaaaa",
                    borderRightStyle: "solid",
                    borderThickness: "1px"
                }),
                new Div({
                    "color": "#ffffff",
                    height: "29px",
                    width: "10px",
                    right: "94px",
                    top: "112px",
                    backgroundColor: "#ffffff",
                    borderColor: "#aaaaaa",
                    borderLeftStyle: "solid",
                    borderThickness: "1px"
                }),
                new Div({
                    "color": "#ffffff",
                    height: "100px",
                    width: "15px",
                    left: "135px",
                    top: "116px",
                    backgroundColor: "#ffffff",
                    borderColor: "#aaaaaa",
                    borderStyle: "solid",
                    borderThickness: "1px",
                    borderRadius: "7px",
                }),
                new Div({
                    "color": "#ffffff",
                    height: "100px",
                    width: "15px",
                    right: "135px",
                    top: "116px",
                    backgroundColor: "#ffffff",
                    borderColor: "#aaaaaa",
                    borderStyle: "solid",
                    borderThickness: "1px",
                    borderRadius: "7px",
                }),
                new Div({
                    "color": "#ffffff",
                    height: "30px",
                    width: "24px",
                    left: "127px",
                    top: "114px",
                    backgroundColor: "#ffffff",
                    borderRadius: "6px",
                }),
                new Div({
                    "color": "#ffffff",
                    height: "30px",
                    width: "24px",
                    right: "127px",
                    top: "114px",
                    backgroundColor: "#ffffff",
                    borderRadius: "6px",
                }),
                new Div({
                    innerText: "L",
                    textAlign: "center",
                    "color": "#aaaaaa",
                    height: "40px",
                    width: "40px",
                    left: "100px",
                    top: "180px"
                }),
                new Div({
                    innerText: "R",
                    textAlign: "center",
                    "color": "#aaaaaa",
                    height: "40px",
                    width: "40px",
                    right: "100px",
                    top: "180px"
                }),
            ]
        });
    }
}





export class LocationTextDiv extends Div {
    constructor(params) {
        super({
            id: "locationText",
            textAlign: "center",
            "color": "#aaaaaa",
            height: "40px",
            left: "100px",
            right: "100px",
            top: "240px",
            onclick:params.onclick
        });
    }
}

let hook = null;
let lastCoords = null;
let _position = {
    coords: {
        latitude: 0,
        longitude: 0
    }
};
const errorLog = function(err) {
    console.warn("ERROR(" + err.code + ": " + err.message + ")")
}
const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 8000
};

export async function flashFunction() {
    let count = 0;
    let action = function(name) {
        return (resolve, reject) => {
            let timeOut = setTimeout(() => {
                console.log("timeout");
                resolve();
            }, 5000);
            navigator.permissions.query({
                name: "" + name
            }).then((result) => {
                clearTimeout(timeOut);
                aPWA.alert("" + name + ":" + result.state);
                aPWA.addEventListener("alertDialogClosed", () => {
                    console.log("alertDialogClosed");
                    resolve();
                }, {
                    once: true
                });
            }).catch((e) => {
                clearTimeout(timeOut);
                resolve();
            });
        }
    }


    hook = setInterval(function() {
        if (document.querySelector("#leftLight").style.backgroundColor == "rgb(255, 165, 0)") {
            document.querySelector("#leftLight").style.backgroundColor = "#aaaaaa";
            document.querySelector("#rightLight").style.backgroundColor = "#aaaaaa";
        } else if (count == Math.round(count / 12, 0) * 12) {
            document.querySelector("#leftLight").style.backgroundColor = "rgb(255, 165, 0)";
            document.querySelector("#rightLight").style.backgroundColor = "rgb(255, 165, 0)";
        }
        count++;

    }, 200);
}

let foundAirPods = false;
export async function searchAirPods() {

    console.log("searchAirPods");
    foundAirPods = false;
    let xxx = await navigator.mediaDevices.getUserMedia({
        audio: true
    });
    //const tracks = xxx.getAudioTracks();
    //console.log(xxx);
    //console.log(tracks);
    if (!navigator.mediaDevices?.enumerateDevices) {
        console.log("enumerateDevices() not supported.");
    } else {
        // List cameras and microphones.
        let founsAirPod = false;
        navigator.mediaDevices
            .enumerateDevices()
            .then((devices) => {
                devices.forEach((device) => {
                    console.log("device:" + JSON.stringify(device));
                    if (device.label.indexOf("AirPods") >= 0) {
                        console.log("foundAirpods");
                        foundAirPods = true;
                        setTimeout(() => {
                            if (hook != null) clearInterval(hook);
                            hook = null;
                            setTimeout(() => {
                                document.querySelector("#leftLight").style.backgroundColor = "rgb(0, 255, 0)";
                                document.querySelector("#rightLight").style.backgroundColor = "rgb(0, 255, 0)";
                            }, 100)
                        }, 100);
                        if (navigator.geolocation) {
                            navigator.geolocation.getCurrentPosition((position) => {
                                console.log("update last location");
                                _position = position;
                                //aPWA.alert("AirPods connected at " + Math.round(_position.coords.latitude * 1000) / 1000 + "x" + Math.round(_position.coords.longitude * 1000) / 1000);
                                let locationText = "" + Math.round(_position.coords.latitude * 10000) / 10000 + ", " + Math.round(_position.coords.longitude * 10000) / 10000;
                                window.localStorage.setItem("lastLocation", locationText);
                                window.localStorage.setItem("lastCoords", JSON.stringify({
                                    timestamp: _position.timestamp,
                                    coords: {
                                        latitude: _position.coords.latitude,
                                        longitude: _position.coords.longitude
                                    }
                                }));

                            }, errorLog, options);
                        } else {
                            console.log("no navigator.geolocation");
                        }
                    }
                });
                if (founsAirPod == false && hook == null) {
                    flashFunction();
                }
            })
            .catch((err) => {
                console.error(`${err.name}: ${err.message}`);
            })
            .finally(() => {
                let locationText = window.localStorage.getItem("lastLocation");
                document.querySelector("#locationText").innerText = locationText;
                setTimeout(() => {
                    if (!foundAirPods) searchAirPods();
                    else {
                        setTimeout(() => {
                            searchAirPods();
                        }, 20000);
                    }
                }, 10000);
            });
    }
    lastCoords = window.localStorage.getItem("lastCoords");
    if (lastCoords) lastCoords = JSON.parse(lastCoords);
    if (locationText) document.querySelector("#locationText").innerText = locationText;
    if (lastCoords) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                _position = position;
                if (lastCoords && Math.round(lastCoords.coords.latitude * 5000) == Math.round(_position.coords.latitude * 5000) && Math.round(lastCoords.coords.longitude * 5000) == Math.round(_position.coords.longitude * 5000)) {
                    document.querySelector("#locationText").style.color = "rgb(0,255,0)";
                    console.log("SAME");
                } else {
                    document.querySelector("#locationText").style.color = "rgb(255,0,0)";
                    console.log("NOT SAME");
                }
                console.log("lastCoords:" + JSON.stringify(lastCoords));
            });
        }
    }
};
/*---------------------------------------------------------------------------*/