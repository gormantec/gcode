import { Div } from 'https://gcode.com.au/modules/pwa.mjs';


class GpsClass {
    constructor() {
        let _this = this;
        window.setInterval(() => _this.updateLocation(_this), 5000);
        _this.updateLocation(_this);
    }

    updateLocation(_this) {
        if (_this.coordDiv) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    _this.coordDiv.innerHTML = Math.floor(position.coords.latitude * 100000) / 100000 + "  " + Math.floor(position.coords.longitude * 100000) / 100000;
                  	if(_this.imageDiv)_this.imageDiv.style.backgroundImage='url("https://maps.googleapis.com/maps/api/staticmap?center='+position.coords.latitude+','+position.coords.longitude+'&zoom=14&size=400x400&key=AIzaSyAhXf8mmpJpudbdhmHOW6YtmGY2YaLAAYU")';
        
                });
            } else {
                _this.coordDiv.innerHTML = "Geolocation not supported";
            }
        }
      //https://maps.googleapis.com/maps/api/staticmap?center=51.477222,0&zoom=14&size=400x400&key=AIzaSyA3kg7YWugGl1lTXmAmaBGPNhDW9pEh5bo&signature=ciftxSv4681tGSAnes7ktLrVI3g=
    }

    newCoordDiv(p) {
        if (!this.coordDiv) this.coordDiv = new Div(p);
        return this.coordDiv;
    }
    newImageDiv(p) {
        if (!this.imageDiv) this.imageDiv = new Div(p);
      	return this.imageDiv;
    }
}

export var gps = new GpsClass();