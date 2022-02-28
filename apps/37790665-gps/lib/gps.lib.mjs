import { Div } from 'https://gcode.com.au/modules/pwa.mjs';

export class GpsDiv extends Div {
    constructor(p) {
        super(p);
      	let _this=this;
		window.setInterval(()=>_this.updateLocation(_this),5000);
        _this.updateLocation(_this);
    }

    updateLocation(_this) {
        
      
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    _this.innerHTML = Math.floor(position.coords.latitude*10000)/10000 + " : " + Math.floor(position.coords.longitude*10000)/10000;
                });
            } else {
                _this.innerHTML = "Geolocation not supported";
            }
        

    }
} 