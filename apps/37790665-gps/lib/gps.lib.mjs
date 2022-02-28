import { Div } from 'https://gcode.com.au/modules/pwa.mjs';

let platlmg = "";

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
                    let lat = position.coords.latitude;
                    let lng = position.coords.longitude;
                    let latlmg = lat + "," + lng;
                    let roughtlatlmg = Math.floor(lat * 100000) / 100000 + "," + Math.floor(lng * 100000) / 100000;

                    _this.coordDiv.innerHTML = roughtlatlmg;
                    if (_this.imageDiv && latlmg != platlmg) {
                      var width = _this.imageDiv.element.offsetWidth;
                      var height = _this.imageDiv.element.offsetHeight;
                        _this.imageDiv.style.backgroundImage = 'url("https://maps.googleapis.com/maps/api/staticmap?center=' +
                            roughtlatlmg + '&zoom=17&markers=color:red%7Clabel:S%7C'+latlmg+'&size='+width+'x'+height+'&key=AIzaSyAhXf8mmpJpudbdhmHOW6YtmGY2YaLAAYU")';
                        platlmg = latlmg;
                    }

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