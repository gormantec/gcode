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
                });
            } else {
                _this.coordDiv.innerHTML = "Geolocation not supported";
            }
        }
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