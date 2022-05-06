import {
    Div
} from 'https://gcode.com.au/modules/pwa.mjs';

let platlmg = "";

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
        window.setInterval(() => {
            _this.updateLocation();
        }, 5000);
        _this.updateLocation();
        _this.zoom = 17;
    }   



    updateLocation() {
        let _this = this;
        if (_this.coordDiv) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    let lat = position.coords.latitude;
                    let lng = position.coords.longitude;
                    let latlmg = lat + "," + lng;
                    let roughtlatlmg = Math.floor(lat * 100000) / 100000 + "," + Math.floor(lng * 100000) / 100000;

                    _this.coordDiv.innerHTML = roughtlatlmg;
                    if (_this.imageDiv && (latlmg != platlmg || _this.zoom != _this.pzoom)) {
                        _this.pzoom = _this.zoom;
                        var width = _this.imageDiv.element.offsetWidth;
                        var height = _this.imageDiv.element.offsetHeight;
                      	let othermarkers="";
                        if(_this.marks)
                        {
                          othermarkers="&markers=color:blue%7Clabel:X%7C"+_this.marks[0];
                        }

                        let imageLoaded = () => {
                            console.log("imageLoaded");
                            _this.imageDiv.style.backgroundImage = 'url("https://maps.googleapis.com/maps/api/staticmap?center=' +
                                roughtlatlmg + '&zoom=' + _this.zoom + othermarkers + '&markers=color:red%7Clabel:S%7C' + latlmg+'&size=' + width + 'x' + height + '&maptype=hybrid&key=AIzaSyAhXf8mmpJpudbdhmHOW6YtmGY2YaLAAYU")';
                            platlmg = latlmg;
                        };

                        var img = new Image();
                        img.src = 'https://maps.googleapis.com/maps/api/staticmap?center=' +
                            roughtlatlmg + '&zoom=' + _this.zoom + '&markers=icon:https://gcode.com.au/images/blueDot.png' + latlmg + '&size=' + width + 'x' + height + '&maptype=hybrid&key=AIzaSyAhXf8mmpJpudbdhmHOW6YtmGY2YaLAAYU';
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

                });
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
                        let lat = position.coords.latitude+0.001;
                        let lng = position.coords.longitude+0.001;
                        let latlmg = lat + "," + lng;
                  		if(_this.marks){
                          _this.marks.push(latlmg);
                        }
                  		else{
                          _this.marks=[];
                          _this.marks.push(latlmg);
                        }
                    
                    });
                }

    }
}
	
export var gps = new GpsClass();