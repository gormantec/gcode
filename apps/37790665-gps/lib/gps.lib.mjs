import { Div } from 'https://gcode.com.au/modules/pwa.mjs';

export class GpsClass extends Div {
    constructor(p) {
        super(p);
		window.setInterval(updateLocation,5000);
    }

    updateLocation() {
        var x = this.element;
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    x.innerHTML = "Latitude: " + position.coords.latitude + " Longitude: " + position.coords.longitude;
                });
            } else {
                x.innerHTML = "Geolocation not supported";
            }
        

    }
}