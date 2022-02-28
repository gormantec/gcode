import { Div } from 'https://gcode.com.au/modules/pwa.mjs';

export class GpsDiv extends Div {
    constructor(p) {
        super(p);
		window.setInterval(this.updateLocation,5000);
        this.updateLocation();
    }

    updateLocation() {
        let _this=this;
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    _this.innerHTML = "" + Math.floor(position.coords.latitude*10000)/10000 + " : " + Math.floor(position.coords.longitude*10000)/10000;
                });
            } else {
                _this.innerHTML = "Geolocation not supported";
            }
        

    }
} 