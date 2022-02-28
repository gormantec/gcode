import { Div } from 'https://gcode.com.au/modules/pwa.mjs';

export class GpsDiv extends Div {
    constructor(p) {
        super(p);
		window.setInterval(this.updateLocation,5000);
    }

    updateLocation() {
        let _this=this;
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    _this.innerHTML = "Latitude: " + position.coords.latitude + " Longitude: " + position.coords.longitude;
                });
            } else {
                _this.innerHTML = "Geolocation not supported";
            }
        

    }
} 