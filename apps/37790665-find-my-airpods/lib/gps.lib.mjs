import {
    Div
} from 'https://gcode.com.au/modules/pwa.mjs';

let platlmg = "";
let mykey = '';
fetch('https://xcgnmv1u3g.execute-api.ap-southeast-2.amazonaws.com/default/googleapiskey?gps=true')
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
        mykey = data.googleapiskey;
        console.log(mykey);
    });

function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
}

function distanceInKmBetweenEarthCoordinates(lat1, lon1, lat2, lon2) {
    var earthRadiusKm = 6371;

    var dLat = degreesToRadians(lat2 - lat1);
    var dLon = degreesToRadians(lon2 - lon1);

    lat1 = degreesToRadians(lat1);
    lat2 = degreesToRadians(lat2);

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusKm * c;
}

class GpsClass {
    constructor() {
        let _this = this;
        //window.setInterval(() => {
        //    _this.updateLocation();
        //}, 10000);
        //_this.updateLocation();
        _this.zoom = 17;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                _this._position = position;
                _this.updateLocation(position.coords.latitude, position.coords.longitude);
                _this._position = position;
            }, () => {}, {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 0
            });
            navigator.geolocation.watchPosition((position) => {
                _this._position = position;
                _this.updateLocation(position.coords.latitude, position.coords.longitude);
            }, () => {}, {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 0
            });
        }
    }



    updateLocation(lat, lng) {
        let _this = this;

        if (_this.coordDiv && mykey!='') {
            if (navigator.geolocation) {
                if (!lat && _this._position && _this._position.coords.latitude) lat = _this._position.coords.latitude;
                if (!lng && _this._position && _this._position.coords.longitude) lng = _this._position.coords.longitude;
                if (_this.lastLat && Math.abs(lat - _this.lastLat) < 0.001) lat = (lat + _this.lastLat) / 2;
                if (_this.lastLng && Math.abs(lng - _this.lastLng) < 0.001) lng = (lng + _this.lastLng) / 2;
                _this.lastLat = lat;
                _this.lastLng = lng;
                let latlmg = lat + "," + lng;
                let roughtlatlmg = Math.floor(lat * 100000) / 100000 + "," + Math.floor(lng * 100000) / 100000;
                _this.coordDiv.innerHTML = roughtlatlmg;
                if (_this.imageDiv && (latlmg != platlmg || _this.zoom != _this.pzoom)) {
                    _this.pzoom = _this.zoom;
                    var width = _this.imageDiv.element.offsetWidth;
                    if(width<10)width=window.innerWidth;
                    var height = _this.imageDiv.element.offsetHeight;
                    if(height<10)height=window.innerHeight;
                    let othermarkers = "";
                    if (_this.marks) {
                        othermarkers = "&markers=color:blue%7Clabel:X%7C" + _this.marks[0];
                        let dist = Math.floor((distanceInKmBetweenEarthCoordinates(parseFloat(_this.marks[0].split(",")[0]), parseFloat(_this.marks[0].split(",")[1]), lat, lng) * 1000));
                        if (dist > 1000) {
                            _this.distDiv.innerHTML = (dist / 1000) + " km";
                        } else {
                            _this.distDiv.innerHTML = dist + " m";
                        }
                    }

                    let imageLoaded = () => {
                        console.log("imageLoaded");
                        _this.imageDiv.style.backgroundImage = 'url("https://maps.googleapis.com/maps/api/staticmap?center=' +
                            roughtlatlmg + '&zoom=' + _this.zoom + othermarkers + '&markers=icon:https://gcode.com.au/images/blueDot.png%7C' + latlmg + '&size=' + width + 'x' + height + '&maptype=hybrid&key=' + mykey + '")';
                        platlmg = latlmg;
                    };

                    var img = new Image();
                    img.src = 'https://maps.googleapis.com/maps/api/staticmap?center=' +
                        roughtlatlmg + '&zoom=' + _this.zoom + othermarkers + '&markers=icon:https://gcode.com.au/images/blueDot.png%7C' + latlmg + '&size=' + width + 'x' + height + '&maptype=hybrid&key=' + mykey + '';
                    if (img.complete) {

                        console.log("complete");
                        imageLoaded();
                    } else {
                        console.log("complete");
                        img.addEventListener('load', imageLoaded)
                        img.addEventListener('error', function(e) {
                            console.log("error:" + e);
                        })
                    }
                }
            } else {
                _this.coordDiv.innerHTML = "Geolocation not supported";
            }
        }
        //https://maps.googleapis.com/maps/api/staticmap?center=51.477222,0&zoom=14&size=400x400&key=AIzaSyA3kg7YWugGl1lTXmAmaBGPNhDW9pEh5bo&signature=ciftxSv4681tGSAnes7ktLrVI3g=
    }

    newDistDiv(p) {
        if (!this.distDiv) this.distDiv = new Div(p);
        return this.distDiv;
    }
    newCoordDiv(p) {
        if (!this.coordDiv) this.coordDiv = new Div(p);
        return this.coordDiv;
    }
    newImageDiv(p) {
        if (!this.imageDiv) this.imageDiv = new Div(p);
        return this.imageDiv;
    }
    zoomout() {
        this.zoom = this.zoom - 1;
        this.updateLocation();
    }
    zoomin() {
        this.zoom = this.zoom + 1;
        this.updateLocation();
    }
    mark() {
        let _this = this;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                let lat = position.coords.latitude;
                let lng = position.coords.longitude;
                let latlmg = lat + "," + lng;
                if (_this.marks) {
                    _this.marks.unshift(latlmg);
                } else {
                    _this.marks = [];
                    _this.marks.unshift(latlmg);
                }
                this.updateLocation();

            });
        }

    }
}

export var gps = new GpsClass();