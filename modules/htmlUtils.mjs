
export function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}


export function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export function getTextColor(backColor) {

    var backColor = backColor.substring(1);      // strip #
    var rgb = parseInt(backColor, 16);   // convert rrggbb to decimal
    var r = (rgb >> 16) & 0xff;  // extract red
    var g = (rgb >> 8) & 0xff;  // extract green
    var b = (rgb >> 0) & 0xff;  // extract blue
    var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709
    if (luma < 124) {
        // pick a different colour
        return "#F0F0F0";
    }
    else {
        return "#0F0F0F";
    }
}

export function getImage(url, callback) {
    if (!url || url.substring(url.length - 4) != ".png") {
        callback({ error: "not a png file" });
    }
    else {
        var arrayBufferToBase64 = function (buffer) {
            var binary = '';
            var bytes = [].slice.call(new Uint8Array(buffer));
            bytes.forEach((b) => binary += String.fromCharCode(b));
            return window.btoa(binary);
        };
        fetch(url, { mode: 'cors' }).then((response) => {
            response.arrayBuffer().then((buffer) => {
                var imageStr = arrayBufferToBase64(buffer);
                callback(null, imageStr);
            });
        });
    }

}


export function createHtml(code) {
    var splashBackgroundColor = null;
    var splash = null;
    var mockFrame = null;
    var rootHTML = window.document.createElement("html");
    var rootHead = window.document.createElement("head");
    var rootBody = window.document.createElement("body");
    rootHTML.appendChild(rootHead);
    rootHTML.appendChild(rootBody);
    splash = code.replace(/\/\*.*?splash:.*?(http.*?[png|gif])[\n].*?\*\/.*/s, '$1');
    if (splash == code) splash = null;
    var icon = code.replace(/\/\*.*?icon:.*?(http.*?png)[\n].*?\*\/.*/s, '$1');
    if (!icon || icon == code) icon = splash;
    var icon180x180 = code.replace(/\/\*.*?icon180x180:.*?(http.*?png)[\n].*?\*\/.*/s, '$1');
    if (!icon180x180 || icon180x180 == code) icon180x180 = icon;
    debug.log("icon180x180=" + icon180x180);
    var splashColor = code.replace(/\/\*.*?splashColor:.*?([A-Za-z0-9#]*)[\n].*?\*\/.*/s, '$1');
    if (splashColor == code) splashColor = null;
    debug.log("splashColor=" + splashColor);
    mockFrame = code.replace(/\/\*.*?mockFrame:.*?([A-Za-z0-9#]*)[\n].*?\*\/.*/s, '$1');
    if (mockFrame == code) mockFrame = null;
    debug.log("mockFrame=" + mockFrame);
    splashBackgroundColor = code.replace(/\/\*.*?splashBackgroundColor:.*?([A-Za-z0-9#]*)[\n].*?\*\/.*/s, '$1');
    if (splashBackgroundColor == code) splashBackgroundColor = "black";
    debug.log("splashBackgroundColor=" + splashBackgroundColor);
    if (!splashColor && splashBackgroundColor) splashColor = getTextColor(splashBackgroundColor);
    var splashDuration = code.replace(/\/\*.*?splashDuration:.*?([0-9]*)[\n].*?\*\/.*/s, '$1');
    if (splashDuration == code) splashDuration = null;
    var spinnerSize = code.replace(/\/\*.*?spinnerSize:.*?([A-Za-z0-9]*?).*?[\n].*?\*\/.*/s, '$1');
    if (spinnerSize == code) spinnerSize = "50px";
    var orientation = code.replace(/\/\*.*?orientation:.*?([A-Za-z0-9]*?).*?[\n].*?\*\/.*/s, '$1');
    if (!orientation || orientation == code) orientation = "any";
    var appName = code.replace(/\/\*.*?appName:.*?([A-Za-z0-9 ]*)[\n].*?\*\/.*/s, '$1');
    if (!appName || appName == code) appName = "gcode App";
    appName = appName.trim();
    var manifest = code.replace(/\/\*.*?manifest:.*?(.*\.json)[\n].*?\*\/.*/s, '$1');
    if (!manifest || manifest == "" || manifest == code) manifest = "xxxxx_manifest.json";
    var longName = appName;
    var shortName = appName;
    var display = "standalone";
    var _link = window.document.createElement("meta");
    _link.setAttribute("name", "mobile-web-app-capable");
    _link.setAttribute("content", "yes");
    rootHead.appendChild(_link);
    _link = window.document.createElement("meta");
    _link.setAttribute("name", "apple-touch-fullscreen");
    _link.setAttribute("content", "yes");
    rootHead.appendChild(_link);
    _link = window.document.createElement("meta");
    _link.setAttribute("name", "apple-mobile-web-app-capable");
    _link.setAttribute("content", "yes");
    rootHead.appendChild(_link);
    _link = window.document.createElement("meta");
    _link.setAttribute("name", "apple-mobile-web-app-status-bar-style");
    _link.setAttribute("content", "black-translucent");
    rootHead.appendChild(_link);
    _link = window.document.createElement("meta");
    _link.setAttribute("property", "fpwa:template");
    _link.setAttribute("content", "pwa=true,name=" + longName + ",short_name=" + shortName + ",theme_color=" + splashBackgroundColor + ",background_color=" + splashBackgroundColor + ",display=" + display + ",orientation=" + orientation);
    rootHead.appendChild(_link);
    _link = window.document.createElement("meta");
    window.document.createElement("link");
    _link.setAttribute("ref", "manifest");
    _link.setAttribute("href", manifest);
    rootHead.appendChild(_link);
    _link = window.document.createElement("link");
    _link.setAttribute("rel", "apple-touch-icon");
    _link.setAttribute("href", "###ICONURI###");
    _link = window.document.createElement("link");
    _link.setAttribute("rel", "apple-touch-icon-precomposed");
    _link.setAttribute("href", "###ICONURI###");
    _link = window.document.createElement("link");
    _link.setAttribute("rel", "icon");
    _link.setAttribute("href", "###ICONURI###");




    rootHead.appendChild(_link);
    if (splash && splash.substring(0, 4) == "http" && splash.substring(splash.length - 3) == "png") {
        var _style = window.document.createElement("style");
        var spinnerCss = ".loader{font-size:" + spinnerSize + ";text-indent:-9999em;overflow:hidden;width:1em;height:1em;border-radius:50%;margin:72px auto;position:absolute;bottom:20px;left:20px;right:20px;bottom:0;-webkit-transform:translateZ(0);-ms-transform:translateZ(0);transform:translateZ(0);-webkit-animation:load6 1.7s infinite ease,round 1.7s infinite ease;animation:load6 1.7s infinite ease,round 1.7s infinite ease}@-webkit-keyframes load6{0%{box-shadow:0 -.83em 0 -.4em,0 -.83em 0 -.42em,0 -.83em 0 -.44em,0 -.83em 0 -.46em,0 -.83em 0 -.477em}5%,95%{box-shadow:0 -.83em 0 -.4em,0 -.83em 0 -.42em,0 -.83em 0 -.44em,0 -.83em 0 -.46em,0 -.83em 0 -.477em}10%,59%{box-shadow:0 -.83em 0 -.4em,-.087em -.825em 0 -.42em,-.173em -.812em 0 -.44em,-.256em -.789em 0 -.46em,-.297em -.775em 0 -.477em}20%{box-shadow:0 -.83em 0 -.4em,-.338em -.758em 0 -.42em,-.555em -.617em 0 -.44em,-.671em -.488em 0 -.46em,-.749em -.34em 0 -.477em}38%{box-shadow:0 -.83em 0 -.4em,-.377em -.74em 0 -.42em,-.645em -.522em 0 -.44em,-.775em -.297em 0 -.46em,-.82em -.09em 0 -.477em}100%{box-shadow:0 -.83em 0 -.4em,0 -.83em 0 -.42em,0 -.83em 0 -.44em,0 -.83em 0 -.46em,0 -.83em 0 -.477em}}@keyframes load6{0%{box-shadow:0 -.83em 0 -.4em,0 -.83em 0 -.42em,0 -.83em 0 -.44em,0 -.83em 0 -.46em,0 -.83em 0 -.477em}5%,95%{box-shadow:0 -.83em 0 -.4em,0 -.83em 0 -.42em,0 -.83em 0 -.44em,0 -.83em 0 -.46em,0 -.83em 0 -.477em}10%,59%{box-shadow:0 -.83em 0 -.4em,-.087em -.825em 0 -.42em,-.173em -.812em 0 -.44em,-.256em -.789em 0 -.46em,-.297em -.775em 0 -.477em}20%{box-shadow:0 -.83em 0 -.4em,-.338em -.758em 0 -.42em,-.555em -.617em 0 -.44em,-.671em -.488em 0 -.46em,-.749em -.34em 0 -.477em}38%{box-shadow:0 -.83em 0 -.4em,-.377em -.74em 0 -.42em,-.645em -.522em 0 -.44em,-.775em -.297em 0 -.46em,-.82em -.09em 0 -.477em}100%{box-shadow:0 -.83em 0 -.4em,0 -.83em 0 -.42em,0 -.83em 0 -.44em,0 -.83em 0 -.46em,0 -.83em 0 -.477em}}@-webkit-keyframes round{0%{-webkit-transform:rotate(0);transform:rotate(0)}100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}@keyframes round{0%{-webkit-transform:rotate(0);transform:rotate(0)}100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}";
        _style.textContent = "\n.splash{position:absolute;background-size:contain;background-image:url(" + splash + ");background-position:center;background-repeat:no-repeat;top:0px;bottom:0px;left:0px;right:0px;" + (splashColor ? "color:" + splashColor : "") + ";" + (splashBackgroundColor ? "background-color:" + splashBackgroundColor : "") + ";}\n" + spinnerCss + "\n";
        rootHead.appendChild(_style);
    }

    var _splash = window.document.createElement("div");
    _splash.className = "splash";
    rootBody.appendChild(_splash);
    var _loader = window.document.createElement("div");
    _loader.className = "loader";
    _loader.innerText = "Loading...";
    rootBody.appendChild(_loader);

    var _script = window.document.createElement("script");
    _script.text = "\n  window.PWA={globals:{}};\n";
    if (appName) _script.text += "  window.PWA.globals.appName=\"" + appName + "\";\n";
    if (orientation) _script.text += "  window.PWA.globals.orientation=\"" + orientation + "\";\n";
    if (icon) _script.text += "  window.PWA.globals.icon=\"" + icon + "\";\n";
    if (icon180x180) _script.text += "  window.PWA.globals.icon180x180=\"" + icon180x180 + "\";\n";
    if (splash) _script.text += "  window.PWA.globals.splash=\"" + splash + "\";\n";
    if (splashColor) _script.text += "  window.PWA.globals.splashColor=\"" + splashColor + "\";\n";
    if (splashBackgroundColor) _script.text += "  window.PWA.globals.splashBackgroundColor=\"" + splashBackgroundColor + "\";\n";
    if (splashDuration) _script.text += "  window.PWA.globals.splashDuration=" + parseInt(splashDuration) + ";\n";
    rootHead.appendChild(_script);

    return {"rootHTML":rootHTML,"splashBackgroundColor":splashBackgroundColor,"splash":splash,"mockFrame":mockFrame};
}

export function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}

export function uint8ArrayToHex(aUint8Array) {
    return aUint8Array.map(b => b.toString(16).padStart(2, "0")).join("");
}

export function hexToUint8Array(hex) {
    var intArray = [];
    for (var i = 0; i < hex.length; i = i + 2)intArray.push(parseInt(hex.substr(i, 2), 16));
    return Uint8Array.from(intArray);
}

export function sms(params, callback) {

    var html = params.html;
    var icon = params.icon;

    var xxx = localStorage.getItem("phonenumber");
    if (xxx == null) xxx = "+61440000XXX";
    var phonenumber = prompt("Please enter your number", xxx);
    while (phonenumber != null && (!phonenumber.startsWith("+") || !$.isNumeric(phonenumber.substring(1)))) {
        phonenumber = prompt("Please use format +61440000000", xxx);
    }
    if (phonenumber != null) {

        localStorage.setItem("phonenumber", phonenumber);

        getImage(icon, function (e, iconBase64) {

            var body = { encodedhtml: btoa(html) };
            if (iconBase64) body.encodedicon = iconBase64;

            fetch('https://8mzu0pqfyf.execute-api.ap-southeast-2.amazonaws.com/fpwaupload', {
                method: 'post',
                mode: "cors",
                credentials: 'omit',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body),
            }).then(response => response.json()).then(data => {
                callback(null, "https://s3-ap-southeast-2.amazonaws.com/fpwa.web.gormantec.com/" + data.uri);
            }).catch((error) => {
                callback(error);
            });
        });
    }
    else {
        alert("no sms sent");
    }
}