
import * as githubtree from '../modules/githubtree.mjs';
import dialogPolyfill from '../dist/dialog-polyfill/dialog-polyfill.esm.js';

var editor;

var debug = { log: function (v) { console.log(v); } };

//int variables   

var leftToolbarWidth = 50;
var leftToolbarFontSize = leftToolbarWidth - 26;
var leftPageWidth = 170;
var selectedFileWidget = null;
var pageBottomHeight = 150;
var dirIconOpened = "keyboard_arrow_down";
var dirIconClosed = "keyboard_arrow_right";

function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}

// root functions

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}


function _save() {
    var filename = document.getElementById("filename").innerText;
    if (filename && filename.substring(0, 6) == "git://") {
        githubtree.saveFile(filename, editor.getValue(), function (e, d) {
            if (e) {
                debug.log(e);
            }
            else {

                localStorage.removeItem("gitfile-" + filename);
                fileWidget.style.fontStyle = "";

                var toDiv = document.getElementById("pageLeftBody");
                var firstColon = filename.indexOf(":", 6);
                var secondColon = filename.indexOf("/", firstColon + 1);
                var username = filename.substring(6, firstColon);
                var repo = filename.substring(firstColon + 1, secondColon);
                githubtree.refreshGitTree(username, repo, toDiv, filename, _openDir, _openFile);

            }
        });
        var pageLeftBody = document.getElementById("pageLeftBody");
        var fileWidget = pageLeftBody.querySelector("div.fileWidget[data-name='" + filename + "']");
        delete fileWidget.style.fontStyle;
    }
    else {
        if (filename == "" || selectedFileWidget == null) return;
        localStorage.setItem("file-" + filename, btoa(editor.getValue()));
        localStorage.setItem("lastFileName", filename);
    }
}



function _delete() {
    var filename = document.getElementById("filename").innerText;
    if (filename == "" && selectedFileWidget != null) filename = selectedFileWidget;
    if (filename.substring(0, 6) == "git://") {
        githubtree.deleteFile(filename, function (e, d) {
            if (e) {
                debug.log(e);
            }
            else {
                document.getElementById("filename").innerText = "";
                editor.setValue("");
                selectedFileWidget = null;
                Array.from(document.getElementsByClassName("fileWidget")).forEach(function (e) {
                    if (e.dataset.name == filename && e.dataset.nextname != null) {
                        selectedFileWidget = e.dataset.nextname;
                    }
                });
                var toDiv = document.getElementById("pageLeftBody");
                var firstColon = filename.indexOf(":", 6);
                var secondColon = filename.indexOf("/", firstColon + 1);
                if (secondColon < 0) secondColon = 10000;
                var username = filename.substring(6, firstColon);
                var repo = filename.substring(firstColon + 1, secondColon);
                githubtree.refreshGitTree(username, repo, toDiv, selectedFileWidget, _openDir, _openFile);
            }
        });
    }
    else {
        localStorage.removeItem("file-" + filename);
        localStorage.setItem("lastFileName", "");
        document.getElementById("filename").innerText = "";
        editor.setValue("");
        selectedFileWidget = null;
        Array.from(document.getElementsByClassName("fileWidget")).forEach(function (e) {
            if (e.dataset.name == filename && e.dataset.nextname != null) selectedFileWidget = e.dataset.nextname;
        });
        _refresh();
    }

}



function _new(aFilename) {


    if (selectedFileWidget && selectedFileWidget.substring(0, 6) == "git://") {
        aFilename = selectedFileWidget.substring(0, selectedFileWidget.lastIndexOf("/")) + "/" + aFilename;
    }
    if (aFilename != null) {
        var sampleName = "";
        if (aFilename.endsWith(".mjs")) sampleName = "modules/sample.mjs";
        else if (aFilename.endsWith(".ts")) sampleName = "modules/sample.ts";
        else if (aFilename.endsWith(".js")) sampleName = "modules/sample.js";
        else if (aFilename.endsWith(".py")) sampleName = "modules/sample.py";
        else sampleName = "modules/sample.txt";

        fetch(sampleName)
            .then(
                response => response.text()
            ).then(
                text => {
                    var _samplecode = text;

                    var appStuff="";
                    if(aFilename.endsWith(".mjs") || aFilename.endsWith(".ts"))appStuff="appName: gcode" + "\n  " +
                    "splash: https://gcode.com.au/images/ios/ios-appicon-180-180.png" + "\n  " +
                    "icon: https://gcode.com.au/images/ios/ios-appicon-180-180op.png" + "\n  " +
                    "icon180x180: https://gcode.com.au/images/ios/ios-appicon-180-180op.png" + "\n  " +
                    "mockFrame: iphoneX" + "\n  " +
                    "splashBackgroundColor: #005040" + "\n  " +
                    "splashDuration: 2000";
                    var pyChar="";
                    if(aFilename.endsWith(".py"))pyChar="#";

                    document.getElementById("filename").innerText = aFilename;
                    selectedFileWidget = aFilename;
                    editor.setValue(pyChar+"/*\n"+pyChar+"\n"+pyChar+"  " +
                        "filename:" + aFilename + "\n"+pyChar+"  " +
                        "created: " + (new Date(Date.now())).getFullYear() + "-" + (new Date(Date.now())).getMonth() + "-" + (new Date(Date.now())).getDay() + "T" + (new Date()).toLocaleTimeString() + "\n"+pyChar+"  " +
                        appStuff +
                        "\n"+pyChar+"\n"+pyChar+"*/\n\n" + _samplecode);
                    _setEditorMode();
                    if (selectedFileWidget.substring(0, 6) == "git://") githubtree.saveFile(selectedFileWidget, editor.getValue(),
                        function () {
                            var gitParts = githubtree.getGitParts(selectedFileWidget);
                            githubtree.refreshGitTree(gitParts.username, gitParts.repo, toDiv, selectedFileWidget, _openDir, _openFile);

                        }
                    );
                    else {
                        _save();
                        _refresh();
                    }
                }
            );
    }
}

function _openFile(element) {


    if (element.dataset.name) {
        if (element.dataset.name.substring(0, 6) != "git://") {
            selectedFileWidget = element.dataset.name;
            document.getElementById("filename").innerText = element.dataset.name;
            var pageLeftBody = document.getElementById("pageLeftBody");
            var selectedItem = pageLeftBody.querySelector("div.fileWidgetSelected");
            if (selectedItem) selectedItem.className = "fileWidget";
            selectedItem = pageLeftBody.querySelector("div.dirWidgetSelected");
            if (selectedItem) selectedItem.className = "dirWidget";
            element.className = "fileWidget fileWidgetSelected";

            editor.setValue(atob(localStorage.getItem("file-" + element.dataset.name)));
            _setEditorMode();
        }
        else {
            var filename = element.dataset.name;
            var firstColon = element.dataset.name.indexOf(":", 6);
            var secondColon = element.dataset.name.indexOf("/", firstColon + 1);
            var username = element.dataset.name.substring(6, firstColon);
            var repo = element.dataset.name.substring(firstColon + 1, secondColon);
            var path = element.dataset.name.substring(secondColon + 1);


            selectedFileWidget = element.dataset.name;
            document.getElementById("filename").innerText = element.dataset.name;
            var pageLeftBody = document.getElementById("pageLeftBody");
            var selectedItem = pageLeftBody.querySelector("div.fileWidgetSelected");
            if (selectedItem) selectedItem.className = "fileWidget";
            selectedItem = pageLeftBody.querySelector("div.dirWidgetSelected");
            if (selectedItem) selectedItem.className = "dirWidget";
            element.className = "fileWidget fileWidgetSelected";
            _setEditorMode();
            githubtree.getGitFile(username, repo, path, function (e, d) {
                var cached = localStorage.getItem("gitfile-" + filename);
                if (cached) {
                    if (atob(cached) != d) {
                        d = atob(cached);
                        element.style.fontStyle = "italic";
                        element.style.color = "#cce6ff";
                    }
                    else {

                        localStorage.removeItem("gitfile-" + filename);
                        element.style.fontStyle = "";
                        element.style.color = "";
                    }
                }
                editor.setValue(d);
            });
        }
    }
    else {
        debug.log(element);
        debug.log(element.classList);
        debug.log(element.dataset);
    }

}
function _setEditorMode() {
    if (selectedFileWidget.endsWith(".js")) {
        editor.setOption("mode", "javascript");
    }
    else if (selectedFileWidget.endsWith(".mjs")) {
        editor.setOption("mode", "javascript");
    }
    else if (selectedFileWidget.endsWith(".ts")) {
        editor.setOption("mode", "javascript");
    }
    else if (selectedFileWidget.endsWith(".py")) {
        editor.setOption("mode", "python");
    }
    else if (selectedFileWidget.endsWith(".dart")) {
        editor.setOption("mode", "dart");
    }
    else if (selectedFileWidget.endsWith(".css")) {
        editor.setOption("mode", "css");
    }
    else if (selectedFileWidget.endsWith(".json")) {
        editor.setOption("mode", "javascript");
    }
    else if (selectedFileWidget.endsWith(".htm") || selectedFileWidget.endsWith(".html")) {
        editor.setOption("mode", "htmlmixed");
    }
}
function _openDir(element) {

    if (element.dataset.name) {

        var _dirname = element.dataset.name;


        var pageLeftBody = document.getElementById("pageLeftBody");
        var selectedItem = pageLeftBody.querySelector("div.fileWidgetSelected");
        if (selectedItem) selectedItem.className = "fileWidget";
        selectedItem = pageLeftBody.querySelector("div.dirWidgetSelected");
        if (selectedItem) selectedItem.className = "dirWidget";
        element.className = "dirWidget dirWidgetSelected";
        selectedFileWidget = _dirname;

        var _fileDisplayValue = "none";
        if (element.dataset.state && element.dataset.state == "closed") {
            element.dataset.state = "open";
            _fileDisplayValue = "";
            element.getElementsByTagName("i")[0].innerText = dirIconOpened;
        }
        else {
            element.dataset.state = "closed";
            _fileDisplayValue = "none";
            element.getElementsByTagName("i")[0].innerText = dirIconClosed;
        }

        if (_dirname == "default") {
            var _array = document.querySelectorAll("div.fileWidget[data-dirname='" + _dirname + "']");
            if (_array) Array.from(_array).forEach(function (e) { if (e.dataset.dirname == _dirname) e.style.display = _fileDisplayValue; });
            var _array = document.querySelectorAll("div.dirWidget[data-dirname='" + _dirname + "']");
            if (_array) Array.from(_array).forEach(function (e) { e.style.display = _fileDisplayValue; });
        }
        else if (_dirname.substring(0, 6) == "git://") {
            githubtree.setDirectoryState(_dirname, element.dataset.state);
            if (element.parentElement.childNodes.length > 1) {
                element.parentElement.childNodes.forEach(function (e) {
                    if (e != element) {
                        e.style.display = _fileDisplayValue;
                    }
                });
            }
            var lastRefresh = githubtree.getDirectoryLastRefresh(_dirname);
            if (element.dataset.state == "open" && (!lastRefresh || lastRefresh > (Date.now() - 60000))) {
                githubtree.setDirectoryLastRefresh(_dirname, Date.now());
                var _params = githubtree.getGitParts(_dirname, { depth: 1 });
                githubtree.pullGitRepository(_params, function (state, repo) {
                    if (state == "done") {
                        githubtree.refreshGitTree(_params.username, _params.repo, pageLeftBody, selectedFileWidget, _openDir, _openFile);
                    }
                });
            }
        }
    }
    else {
        debug.log(element);
        debug.log(element.classList);
        debug.log(element.dataset);
    }


}

function builtinRead(x) {
    if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined)
        throw "File not found: '" + x + "'";
    return Sk.builtinFiles["files"][x];
}

var xx = "";
function consolelog(x) {

    if (x == "\n") {
        debug.log(xx);
        xx = "";
    }
    else {
        xx = xx + x;
    }
}

function _onclickFilename() {
    document.getElementById("filename").onclick = null;
    var input = document.createElement("input");
    selectedFileWidget = document.getElementById("filename").innerText;
    input.value = selectedFileWidget;
    document.getElementById("filename").innerHTML = "";
    document.getElementById("filename").appendChild(input);
    input.onkeypress = function (e) {
        if (!e) e = window.event;
        var keyCode = e.keyCode || e.which;
        if (keyCode == '13') {
            // Enter pressed
            var filename = input.value;
            if (filename == "" || filename == null) return false;
            localStorage.setItem("file-" + filename, btoa(editor.getValue()));
            localStorage.setItem("lastFileName", filename);
            localStorage.removeItem("file-" + selectedFileWidget);
            selectedFileWidget = input.value;
            input.onkeypress = null;
            document.getElementById("filename").innerHTML = selectedFileWidget;
            document.getElementById("filename").onclick = _onclickFilename;
            _refresh();
            return false;
        }
    };
}

function getTextColor(backColor) {

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

function getCode(guid, callback) {
    var w = window.outerWidth || document.documentElement.clientWidth || 0;
    var h = window.outerHeight || document.documentElement.clientHeight || 0;
    var x = (window.screenX || window.screenLeft || 0);
    var y = (window.screenY || window.screenTop || 0);
    var win = window.open("https://github.com/login/oauth/authorize?scope=user:email%20user:login%20repo&client_id=0197d74da25302207cf6&state=" + guid, "github Auth", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no,width=375,height=600,top=" + (y - 300 + h / 2) + ",left=" + (x - 188 + w / 2));

    var count = 0;
    var loop = setInterval(function () {
        count++;
        var queryString = "";
        try { queryString = win.location.search; } catch (e) { }
        const urlParams = new URLSearchParams(queryString);
        const code = urlParams.get('code')
        if (code) {
            clearInterval(loop);
            win.close();
            return callback(null, code);
        }
        else if (count > 20) {
            clearInterval(loop);
            win.close();
            return callback({ error: "timeout" });
        }

    }, 500);
}

function getImage(url, callback) {
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

function _sms(params, callback) {

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

function _uploadFile(params, callback) {

    var html = params.html;
    var icon = params.icon;

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

    //encodedicon ###ICONURI###
    //https://s3-ap-southeast-2.amazonaws.com/fpwa.web.gormantec.com/apps/5ojnj1pknl.html
}
var splashBackgroundColor = null;
var splash = null;
var mockFrame = null;
function _createHtml() {
    splashBackgroundColor = null;
    splash = null;
    mockFrame = null;
    var rootHTML = window.document.createElement("html");
    var rootHead = window.document.createElement("head");
    var rootBody = window.document.createElement("body");
    rootHTML.appendChild(rootHead);
    rootHTML.appendChild(rootBody);
    var code = editor.getValue();
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

    return rootHTML;
}

var win;
var myLogin = "";

function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}

function _Uint8ArrayToHex(aUint8Array) {
    return aUint8Array.map(b => b.toString(16).padStart(2, "0")).join("");
}
function _HexToUint8Array(hex) {
    var intArray = [];
    for (var i = 0; i < hex.length; i = i + 2)intArray.push(parseInt(hex.substr(i, 2), 16));
    return Uint8Array.from(intArray);
}


function _toolbarButtonClicked() {


    if (this.dataset.action == "addFile") {
        document.getElementById("newFileDialogName").value="sample-"+(Math.round(Date.now() / 1000) - 1592000000) + document.getElementById("newFileDialogSelect").value;
        document.getElementById('newFileDialogConfirmButton').value = document.getElementById("newFileDialogName").value;
        document.getElementById("newFileDialog").showModal();
        
    } else if (this.dataset.action == "saveFile") {
        _save();
    }
    else if (this.dataset.action == "runFile") {

        var filename = document.getElementById("filename").innerText;
        if (filename.endsWith(".js")) {
            debug.log(myLogin + "$ nodejs " + filename + "\n");
            try {
                var _run = function () {
                    eval(editor.getValue());
                }
                _run();
            }
            catch (e) {
                console.error(e);
            }
            debug.log(myLogin+"$");
        }
        else if (filename.endsWith(".dapp.ts")) {
            debug.log(myLogin + "$ asc " + filename + " --target release\n");
            var myUint8Array = Uint8Array.from([1]);
            try {
                var _run = function () {
                    require(["https://cdn.jsdelivr.net/npm/assemblyscript@latest/dist/sdk.js"], ({ asc }) => {
                        asc.ready.then(() => {
                            const stdout = asc.createMemoryStream();
                            const stderr = asc.createMemoryStream();
                            asc.main([
                                "assembly/index.ts",
                                "-O3",
                                "--runtime", "full",
                                "--binaryFile", "optimized.wasm",
                                "--textFile", "optimized.wat"
                            ], {
                                stdout,
                                stderr,
                                readFile(name, baseDir) {

                                }
                            });
                        });
                    });
                }
            }
            catch(e){}
        }
        else if (filename.endsWith(".ts")) {
            debug.log(myLogin + "$ asc " + filename + " --target release\n");
            var myUint8Array = Uint8Array.from([1]);
            try {
                var _run = function () {
                    require(["https://cdn.jsdelivr.net/npm/assemblyscript@latest/dist/sdk.js"], ({ asc }) => {
                        asc.ready.then(() => {
                            const stdout = asc.createMemoryStream();
                            const stderr = asc.createMemoryStream();
                            asc.main([
                                "assembly/index.ts",
                                "-O3",
                                "--runtime", "full",
                                "--binaryFile", "optimized.wasm",
                                "--textFile", "optimized.wat"
                            ], {
                                stdout,
                                stderr,
                                readFile(name, baseDir) {

                                    if(name.startsWith("@wasmdom/"))name="../"+name.substring(8);

                                    console.log("-->"+name);
                                    
                                    if (name.endsWith("app.ts")) {
                                        console.log("Got App:" + name);
                                        return editor.getValue();
                                    }
                                    else if (name == "assembly/index.ts") {
                                        console.log("FOUND !!! -->"+name);
                                        var b64 = localStorage.getItem("gitfile-git://gormantec:wasmdom/assembly/index.ts");
                                        var cached = null;
                                        if (b64) {
                                            console.log(name + " = " + "git://gormantec:wasmdom/assembly/index.ts");
                                            cached = atob(b64);
                                        }
                                        return cached;
                                    }
                                    else if (name.startsWith("assembly/") && name.endsWith(".ts")) {
                                        var b64 = localStorage.getItem("gitfile-git://gormantec:wasmdom/" + name);
                                        var cached = null;
                                        if (b64) {
                                            cached = atob(b64);
                                            console.log(name + " = " + "git://gormantec:wasmdom/" + name);
                                        }
                                        return cached;
                                    }
                                    else {
                                        return null;
                                    }
                                },
                                writeFile(name, data, baseDir) {

                                    if (typeof data == "object" && name == "optimized.wasm") {





                                        const reader = new FileReader();

                                        reader.addEventListener("load", function () {
                                            // convert image file to base64 string
                                            console.log("-------" + name + "-------");
                                            console.log(reader.result);
                                            var dataURL = reader.result;
                                            console.log("------------------");

                                            try {
                                                var rootHTML = _createHtml();
                                                var _script1 = window.document.createElement("script");
                                                _script1.text = "\nwindow.wasmdomURL=\""+dataURL+"\";\n";
                                                rootHTML.querySelector("body").appendChild(_script1);
                                                var _script2 = window.document.createElement("script");
                                                _script2.src = "https://gcode.com.au/js/wasmdom.js";
                                                rootHTML.querySelector("body").appendChild(_script2);
                                                var w = 375;
                                                var h = 896 * 375 / 414;
                                                var wh = "width=" + w + ",height=" + h;
                                                var frame = "";
                                                console.log(rootHTML);
                                                if(mockFrame){
                                                    wh="width="+(w+40)+",height="+(h+40);
                                                    frame="?mockFrame="+mockFrame;
                                                }
                                                if (!win || win.closed) {
                                                    win = window.open("", "_blank", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no," + wh + ",top=50,left=50");
                                                    if (splashBackgroundColor) win.document.body.style.backgroundColor = splashBackgroundColor;
                                                    else win.document.body.style.backgroundColor = "black";
                                                }
                                                _uploadFile({ html: "<!doctype html>\n" + rootHTML.outerHTML, icon: splash }, function (error, uri) {
                                                    if (error) {
                                                        debug.log(error);
                                                    }
                                                    else {
                                                        debug.log("open window");
                                                        win.location.href = uri + frame;
                                                    }

                                                });
                                            }
                                            catch (e) {
                                                console.error("error:" + e);
                                            }



                                        }, false);


                                        reader.readAsDataURL(new Blob([Uint8Array.from(data)], { type: 'application/wasm' }));

                                        /*
                                        
                                                                                myUint8Array = Uint8Array.from(data);
                                                                                var gitname = "git://gormanau:gcode/dist/" + filename.slice(21, -3) + "/" + name;
                                                                                githubtree.saveFile(gitname, _Uint8ArrayToHex(myUint8Array), () => {
                                                                                    console.log('done');
                                                                                });
                                                                                console.log(`>>> WRITE:${name} >>>\n${data.length} >> type=${typeof data}`);
                                                                                
                                                                                let blob = new Blob(data, { type: "application/octet-stream" });
                                                                                var reader = new FileReader();
                                                                                reader.readAsDataURL(blob);
                                                                                reader.onloadend = function () {
                                                                                    var base64String = reader.result;
                                                                                    //console.log('Base64 String - ', base64String); 
                                                                                    //console.log('Base64 String without Tags- ', base64String.substr(base64String.indexOf(',') + 1)); 
                                                                                    var gitname = "git://gormanau:gcode/dist/" + filename.slice(21, -3) + "/" + name;
                                                                                    console.log(filename);
                                                                                    console.log(gitname);
                                                                                    githubtree.saveFile(gitname, base64String.substr(base64String.indexOf(',') + 1), false, () => {
                                                                                        console.log('done');
                                                                                    });
                                                                                }*/

                                    }


                                },
                                listFiles(dirname, baseDir) {
                                    console.log(`>>> listFiles: baseDir=${baseDir} dirname = ${dirname} `);
                                    return [];
                                }
                            }, err => {
                                console.log(`>>> STDOUT >>>\n${stdout.toString()}`);
                                console.log(`>>> STDERR >>>\n${stderr.toString()}`);
                                if (err) {
                                    console.log(">>> THROWN >>>");
                                    console.log(err);
                                }
                                else {

                                }
                            });
                        });
                    });
                }
                _run();
            }
            catch (e) {
                console.error(e);
            }
            debug.log("\n");
        }
        else if (filename.endsWith(".mjs")) {
            debug.log(myLogin + "$ launch webApp " + filename + "\n");
            try {
                var rootHTML = _createHtml();
                var _module = window.document.createElement("script");
                _module.setAttribute("type", "module");
                _module.text = "\n" + editor.getValue() + "\n";
                rootHTML.querySelector("head").appendChild(_module);
                var w = 375;
                var h = 896 * 375 / 414;
                var wh = "width=" + w + ",height=" + h;
                var frame = "";
                if (mockFrame) {
                    wh = "width=" + (w + 40) + ",height=" + (h + 40);
                    frame = "?mockFrame=" + mockFrame;
                }
                if (!win || win.closed) {
                    win = window.open("", "_blank", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no," + wh + ",top=50,left=50");
                    if (splashBackgroundColor) win.document.body.style.backgroundColor = splashBackgroundColor;
                    else win.document.body.style.backgroundColor = "black";
                }
                _uploadFile({ html: "<!doctype html>\n" + rootHTML.outerHTML, icon: splash }, function (error, uri) {
                    if (error) {
                        debug.log(error);
                    }
                    else {
                        debug.log("open window");
                        win.location.href = uri + frame;
                    }

                });
            }
            catch (e) {
                console.error("error:" + e);
            }
            debug.log("\n");
        }
        else if (filename.endsWith(".py")) {
            try {
                debug.log(myLogin + "$ python " + filename)
                Sk.pre = "output";
                Sk.configure({
                    output: consolelog, read: builtinRead
                });
                var myPromise = Sk.misceval.asyncToPromise(function () {
                    return Sk.importMainWithBody("<stdin>", false, editor.getValue(), true);
                });
                debug.log("$");
            }
            catch (e) {
                console.error(e);
            }
        }

    }
    else if (this.dataset.action == "addGitRepo") {
        var guid = uuidv4();

        var doSomething = function () {
            githubtree.getAuthenticated().then((resp) => {
                myLogin = resp.data.login;
                if (resp.data.login) {
                    var gitRepoName = prompt("Git repo name to add", resp.data.login + "/<reponame>");
                    if (gitRepoName) {
                        var username = gitRepoName.substring(0, gitRepoName.indexOf("/"));
                        var repo = gitRepoName.substring(gitRepoName.indexOf("/") + 1);
                        if (repo != "<reponame>") {
                            var gitRepositories = localStorage.getItem("git-repositories");
                            var data = {};
                            if (!gitRepositories) {
                                data = {};
                                data["git://" + username + ":" + repo] = { "username": username, "repo": repo };
                                localStorage.setItem("git-repositories", JSON.stringify(data));
                            }
                            else {
                                data = JSON.parse(gitRepositories);
                                data["git://" + username + ":" + repo] = ({ "username": username, "repo": repo });
                                localStorage.setItem("git-repositories", JSON.stringify(data));
                            }
                            var toDiv = document.getElementById("pageLeftBody");
                            Object.values(data).forEach(function (r, x) {
                                var running_count = 0;
                                githubtree.pullGitRepository({ username: r.username, repo: r.repo }, function (state, repo) {
                                    if (state == "running") {
                                        running_count++;
                                        if (Math.floor(running_count / 10) * 10 == running_count) {
                                            githubtree.refreshGitTree(username, repo, toDiv, filename, _openDir, _openFile);
                                        }
                                    }
                                    if (state == "done") {
                                        githubtree.refreshGitTree(username, repo, toDiv, filename, _openDir, _openFile);
                                    }
                                });
                            });
                        }
                    }
                }
            }).catch(() => githubtree.setToken(null));
        };

        if (githubtree.getToken()) {
            doSomething();
        }
        else {
            getCode(guid, (e, code) => {
                if (!e) {
                    fetch("https://5q7l0c3xq9.execute-api.ap-southeast-2.amazonaws.com?code=" + code + "&state=" + guid).then(
                        response => response.json()
                    ).then((json) => {
                        console.log("set new token");
                        githubtree.setToken(json.data.access_token);
                        doSomething();
                    });
                }
            });
        }



    }
    else if (this.dataset.action == "deleteFile") {
        _delete();
    }
}

function _toggleTerminal() {
    if (document.getElementById("pageBottom").style.display != "none") {
        document.getElementById("pageBottom").style.display = "none";
        document.getElementById("pageAll").style.bottom = "0px";
    }
    else {
        document.getElementById("pageBottom").style.display = "";
        document.getElementById("pageAll").style.bottom = (pageBottomHeight + 10) + "px";
    }
}

function _toggleSideBar() {

    if (document.getElementById("pageLeftToolbar").style.display != "none") {
        if (w < 576) {

            document.getElementById("pageLeft").style.display = "none";
            document.getElementById("pageLeft").style.right = "0px";
            document.getElementById("pageLeft").style.width = "unset";
            document.getElementById("pageMiddle").style.display = "";
            if (editor) editor.refresh();
            document.getElementById("pageLeftToolbar").style.display = "none";
            document.getElementById("pageMiddle").style.left = "0px";
            document.getElementById("pageMiddle").style.right = "0px";
            document.getElementById("filename").style.marginLeft = (leftToolbarWidth + 21) + "px";
            document.getElementById("runHeaderButton").style.left = (leftToolbarWidth + 2) + "px";
            document.getElementById("sideBarButton").getElementsByTagName("i")[0].innerText = "keyboard_arrow_right";

        }
        else {
            document.getElementById("pageLeft").style.display = "none";
            document.getElementById("pageLeftToolbar").style.display = "none";
            document.getElementById("pageMiddle").style.left = "0px";
            document.getElementById("pageMiddle").style.right = "0px";
            document.getElementById("pageMiddle").style.display = "";
            if (editor) editor.refresh();
            document.getElementById("filename").style.marginLeft = (leftToolbarWidth + 21) + "px";
            document.getElementById("runHeaderButton").style.left = (leftToolbarWidth + 2) + "px";
            document.getElementById("sideBarButton").getElementsByTagName("i")[0].innerText = "keyboard_arrow_right";
        }

    }
    else {
        var w = window.outerWidth || document.documentElement.clientWidth || 0;

        if (w < 576) {
            document.getElementById("pageLeft").style.display = "";
            document.getElementById("pageLeft").style.right = "0px";
            document.getElementById("pageLeft").style.width = "unset";
            document.getElementById("pageMiddle").style.display = "none";
            document.getElementById("pageLeftToolbar").style.display = "";
            document.getElementById("filename").style.marginLeft = (leftToolbarWidth + 21) + "px";
            document.getElementById("runHeaderButton").style.left = (leftToolbarWidth + 2) + "px";
            document.getElementById("sideBarButton").getElementsByTagName("i")[0].innerText = "keyboard_arrow_left";
        }
        else {

            document.getElementById("pageLeft").style.display = "";
            document.getElementById("pageLeft").style.right = "unset";
            document.getElementById("pageLeft").style.width = leftPageWidth + "px";
            document.getElementById("pageLeft").style.display = "";
            document.getElementById("pageLeftToolbar").style.display = "";
            document.getElementById("pageMiddle").style.display = "";
            if (editor) editor.refresh();
            document.getElementById("pageMiddle").style.left = (leftToolbarWidth + leftPageWidth + 2) + "px";
            document.getElementById("filename").style.marginLeft = (leftToolbarWidth + leftPageWidth + 22) + "px";
            document.getElementById("runHeaderButton").style.left = (leftToolbarWidth + leftPageWidth + 2) + "px";
            document.getElementById("sideBarButton").getElementsByTagName("i")[0].innerText = "keyboard_arrow_left";
        }
    }

}

function _open(params) {

    _refresh();

    var w = window.outerWidth || document.documentElement.clientWidth || 0;

    if (w < 576) {

        document.getElementById("pageLeft").style.display = "";
        document.getElementById("pageLeft").style.right = "0px";
        document.getElementById("pageLeft").style.width = "unset";
        document.getElementById("pageMiddle").style.display = "none";
        document.getElementById("filename").style.marginLeft = (leftToolbarWidth + 22) + "px";
        document.getElementById("runHeaderButton").style.left = (leftToolbarWidth + 2) + "px";

    }
    else {
        if (!(params && params.visible) && document.getElementById("pageLeft").style.display != "none") {

            document.getElementById("pageLeft").style.right = "unset";
            document.getElementById("pageLeft").style.width = leftPageWidth + "px";
            document.getElementById("pageLeft").style.display = "none";
            document.getElementById("pageMiddle").style.display = "";
            if (editor) editor.refresh();
            document.getElementById("pageMiddle").style.left = (leftToolbarWidth + 1) + "px";
            document.getElementById("filename").style.marginLeft = (leftToolbarWidth + 21) + "px";
            document.getElementById("runHeaderButton").style.left = (leftToolbarWidth + 2) + "px";


        }
        else {

            document.getElementById("pageLeft").style.right = "unset";
            document.getElementById("pageLeft").style.width = leftPageWidth + "px";
            document.getElementById("pageLeft").style.display = "";
            document.getElementById("pageMiddle").style.display = "";
            if (editor) editor.refresh();
            document.getElementById("pageMiddle").style.left = (leftToolbarWidth + leftPageWidth + 2) + "px";
            document.getElementById("filename").style.marginLeft = (leftToolbarWidth + leftPageWidth + 22) + "px";
            document.getElementById("runHeaderButton").style.left = (leftToolbarWidth + leftPageWidth + 2) + "px";
        }
    }


}


function _refresh(params) {
    var values = [],
        keys = Object.keys(localStorage),
        i = keys.length;
    var defaultParent = htmlToElement("<div id=\"defaultParent\"></div>");
    var pageLeft = htmlToElement("<div class='dirWidget' data-name='default'><i class='material-icons'>" + dirIconOpened + "</i>default</div>");
    pageLeft.addEventListener("click", function () { _openDir(this); });
    defaultParent.appendChild(pageLeft);
    keys.sort();
    keys.reverse();

    while (i--) {

        if (keys[i].startsWith("file-") && keys[i] != "file-") {
            var nextname = "";
            var selectedClass = "";
            if (i > 0) nextname = "data-nextname='" + keys[i - 1].substring(5) + "'";
            if (selectedFileWidget == keys[i].substring(5)) selectedClass = " fileWidgetSelected";
            var _child = htmlToElement("<div class='fileWidget" + selectedClass + "' data-name='" + keys[i].substring(5) + "' " + nextname + " data-dirname='default'><div class='fileIndent'></div><i class='material-icons'>format_align_justify</i>" + keys[i].substring(5) + "</div>");
            defaultParent.appendChild(_child);
            _child.addEventListener("click", function () { _openFile(this); });


        }
    }
    var pageLeftBody = document.getElementById("pageLeftBody");
    var oldDefaultParent = pageLeftBody.querySelector("div#defaultParent");
    if (oldDefaultParent) {
        pageLeftBody.removeChild(oldDefaultParent);
    }
    pageLeftBody.insertBefore(defaultParent, pageLeftBody.firstChild);

    if (params && params.all) {
        var gitRepositories = localStorage.getItem("git-repositories");
        if (gitRepositories) {
            var data = {};
            data = JSON.parse(gitRepositories);
            Object.values(data).forEach(function (r, x) {
                if (r.username && r.repo) {
                    githubtree.refreshGitTree(r.username, r.repo, pageLeftBody, selectedFileWidget, _openDir, _openFile);
                }
            });
        }
    }
}

window.addEventListener('resize', function (event) {


    var w = window.outerWidth || document.documentElement.clientWidth || 0;
    if (w < 576) {
        if (document.getElementById("pageLeftToolbar").style.display != "none") {
            document.getElementById("pageLeft").style.display = "";
            document.getElementById("pageLeft").style.right = "0px";
            document.getElementById("pageLeft").style.width = "unset";
            document.getElementById("pageMiddle").style.display = "none";

        }
        else {
            document.getElementById("pageLeft").style.display = "none";
            document.getElementById("pageLeft").style.right = "0px";
            document.getElementById("pageLeft").style.width = "unset";
            document.getElementById("pageMiddle").style.display = "";
            if (editor) editor.refresh();
        }
    }
    else {
        document.getElementById("pageLeft").style.display = "";
        document.getElementById("pageLeft").style.right = "unset";
        document.getElementById("pageLeft").style.width = leftPageWidth + "px";
        document.getElementById("pageMiddle").style.display = "";
        if (editor) editor.refresh();
    }
});


document.addEventListener("DOMContentLoaded", function () {

    var newFileDialog=document.getElementById("newFileDialog");
    var newFileDialogName=document.getElementById("newFileDialogName");

    dialogPolyfill.registerDialog(newFileDialog);

    document.getElementById("newFileDialogSelect").addEventListener('change', function onSelect(e) {
        var name=newFileDialogName.value.indexOf(".")>0?newFileDialogName.value.substring(0,newFileDialogName.value.lastIndexOf(".")):newFileDialogName.value;
        newFileDialogName.value=(name + document.getElementById("newFileDialogSelect").value);
        document.getElementById('newFileDialogConfirmButton').value = newFileDialogName.value;
      });
      newFileDialog.addEventListener('close', function onClose() {
          if(newFileDialog.returnValue!="cancel")
          {
            _new(newFileDialog.returnValue);
          }
        
      });
    //resize page

    document.getElementById("pageLeftToolbar").style.fontSize = leftToolbarFontSize + "px";
    var w = window.outerWidth || document.documentElement.clientWidth || 0;

    document.getElementById("pageLeftToolbar").style.width = leftToolbarWidth + "px";

    _open({ visible: true });

    document.getElementById("openButton").onclick = _open;
    document.getElementById("addFeatureButton").onclick = function () { prompt("Add feature: "); };
    document.getElementById("terminalButton").onclick = _toggleTerminal;
    document.getElementById("sideBarButton").onclick = _toggleSideBar;
    document.getElementById("filename").onclick = _onclickFilename;
    document.getElementById("runHeaderButton").onclick = _toolbarButtonClicked;

    Array.from(document.getElementsByClassName("toolbarButton")).forEach(function (e) { e.onclick = _toolbarButtonClicked; });


    var theme = "material-darker2";
    editor = CodeMirror.fromTextArea(document.getElementById("sourcecode"), {
        lineNumbers: true,
        theme: theme,
        matchBrackets: true,
        extraKeys: { "Ctrl-Q": function (cm) { cm.foldCode(cm.getCursor()); }, "Ctrl-Space": "autocomplete" },
        foldGutter: true,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
    });

    Array.from(document.getElementsByClassName("cm-s-theme")).forEach(function (e) { e.classList.add('cm-s-' + theme); });
    Array.from(document.getElementsByClassName("cm-s-theme")).forEach(function (e) { e.classList.remove('cm-s-theme'); });

    var lastFileName = localStorage.getItem("lastFileName");
    if (lastFileName) {
        document.getElementById("filename").innerText = lastFileName;
        selectedFileWidget = lastFileName;
        _setEditorMode();
        editor.setValue(atob(localStorage.getItem("file-" + lastFileName)));
    }
    else {
        document.getElementById("filename").innerText = "new-file-" + (Math.round(Date.now() / 1000) - 1592000000) + ".mjs";
    }


    editor.on("change", function () {
        var filename = document.getElementById("filename").innerText;
        if (!filename.startsWith("git://")) {
            _save();
        }
        else {
            var pageLeftBody = document.getElementById("pageLeftBody");
            var fileWidget = pageLeftBody.querySelector("div.fileWidget[data-name='" + filename + "']");

            if (fileWidget && fileWidget.style.fontStyle != "italic") {
                var firstColon = filename.indexOf(":", 6);
                var secondColon = filename.indexOf("/", firstColon + 1);
                var username = filename.substring(6, firstColon);
                var repo = filename.substring(firstColon + 1, secondColon);
                var path = filename.substring(secondColon + 1);

                githubtree.getGitFile(username, repo, path, function (e, d) {
                    if (d != editor.getValue()) {
                        fileWidget.style.fontStyle = "italic";
                        fileWidget.style.color = "#cce6ff";
                        localStorage.setItem("gitfile-" + filename, btoa(editor.getValue()));
                    }
                    else {
                        localStorage.removeItem("gitfile-" + filename);
                        fileWidget.style.fontStyle = "";
                        fileWidget.style.color = "";
                    }
                });
            }
            else {
                localStorage.setItem("gitfile-" + filename, btoa(editor.getValue()));
            }

        }
    });


    (function () {
        var old = console.log;
        var olde = console.error;
        var logger = document.getElementById('log');
        var pageBottom = document.getElementById('pageBottom');
        console.log = function (message) {
            if (typeof message == 'object') {
                logger.innerHTML += "<div>" + (JSON && JSON.stringify ? JSON.stringify(message) : message) + '</div>';
                pageBottomScroll.scrollTo({ left: 0, top: pageBottomScroll.scrollHeight, behavior: 'smooth' });
            } else {
                logger.innerHTML += "<div>" + message + '</div>';
                pageBottomScroll.scrollTo({ left: 0, top: pageBottomScroll.scrollHeight, behavior: 'smooth' });
            }
        }
        console.error = function (message) {
            logger.innerHTML += "<div style=\"color:red\">" + message + '</div>';
            pageBottomScroll.scrollTo({ left: 0, top: pageBottomScroll.scrollHeight, behavior: 'smooth' });
        }
    })();




    const BORDER_SIZE = 4;
    const panel = document.getElementById("pageLeft");
    const panelMiddle = document.getElementById("pageMiddle");
    const pageBottom = document.getElementById("pageBottom");
    const pageAll = document.getElementById("pageAll");

    let m_posx;
    let m_posy;
    function resizex(e) {

        if (w >= 576) {
            const dx = m_posx - e.x;
            m_posx = e.x;
            leftPageWidth = (parseInt(getComputedStyle(panel, '').width) - dx);
            panel.style.width = leftPageWidth + "px";
            panelMiddle.style.left = (leftToolbarWidth + leftPageWidth + 2) + "px";
        }

    }

    function resizey(e) {
        const dy = m_posy - e.y;
        m_posy = e.y;
        pageBottomHeight = (parseInt(getComputedStyle(pageBottom, '').height) + dy);
        pageBottom.style.height = pageBottomHeight + "px";
        pageAll.style.bottom = (pageBottomHeight + 10) + "px";

    }

    panel.addEventListener("mousedown", function (e) {

        if (e.offsetX > (panel.clientWidth - BORDER_SIZE)) {
            m_posx = e.x;
            document.addEventListener("mousemove", resizex, false);
        }
    }, false);

    document.addEventListener("mouseup", function () {
        document.removeEventListener("mousemove", resizex, false);
        document.removeEventListener("mousemove", resizey, false);
    }, false);

    pageBottom.addEventListener("mousedown", function (e) {

        if (e.offsetY < BORDER_SIZE) {

            m_posy = e.y;
            document.addEventListener("mousemove", resizey, false);
        }
    }, false);

    if (githubtree.getToken()) {
        githubtree.waitForOctokit(() => {
            githubtree.getAuthenticated().then((resp) => {
                myLogin = resp.data.login;
                console.log("cacheRepo");
                githubtree.cacheRepo({ username: myLogin, repo: "wasmdom" }, function (state, repo) { console.log("state=" + state); });
            });
        });
    }

    var gitRepositories = localStorage.getItem("git-repositories");
    if (gitRepositories) {
        var data = {};
        data = JSON.parse(gitRepositories);
        var toDiv = document.getElementById("pageLeftBody");
        Object.values(data).forEach(function (r, x) {
            if (r.username && r.repo) {
                var running_count = 0;
                var username = r.username;
                githubtree.pullGitRepository({ username: r.username, repo: r.repo }, function (state, repo) {
                    if (state == "running") {
                        running_count++;
                        if (Math.floor(running_count / 10) * 10 == running_count) {
                            githubtree.refreshGitTree(username, repo, toDiv, selectedFileWidget, _openDir, _openFile);
                        }
                    }
                    if (state == "done") {
                        githubtree.refreshGitTree(username, repo, toDiv, selectedFileWidget, _openDir, _openFile);
                    }
                });
            }
        });
    }
    setTimeout(function () {
        document.getElementById("splashScreen").hidden = true;
    }, 2000);


});



/*

3024-day.css                                       01-Mar-2017 09:09                1987
3024-night.css                                     01-Mar-2017 09:09                2076
abcdef.css                                         25-May-2017 09:15                1969
ambiance-mobile.css                                19-Aug-2015 13:47                 103
ambiance.css                                       25-May-2017 09:15               26493
ayu-dark.css                                       14-Nov-2019 08:24                2247
ayu-mirage.css                                     14-Nov-2019 08:24                2361
base16-dark.css                                    01-Mar-2017 09:09                2112
base16-light.css                                   21-Nov-2018 08:14                2124
bespin.css                                         01-Mar-2017 09:09                1413
blackboard.css                                     01-Mar-2017 09:09                1931
cobalt.css                                         25-May-2017 09:15                1726
colorforth.css                                     25-May-2017 09:15                1677
darcula.css                                        25-Sep-2019 11:24                2686
dracula.css                                        25-May-2017 09:15                2042
duotone-dark.css                                   25-May-2017 09:15                2614
duotone-light.css                                  25-May-2017 09:15                2719
eclipse.css                                        25-May-2017 09:15                1187
elegant.css                                        01-Mar-2017 09:09                 781
erlang-dark.css                                    25-May-2017 09:15                2286
gruvbox-dark.css                                   15-Sep-2018 08:37                1736
hopscotch.css                                      01-Mar-2017 09:09                1469
icecoder.css                                       25-May-2017 09:15                2515
idea.css                                           26-Jun-2018 07:43                1672
isotope.css                                        01-Mar-2017 09:09                1442
lesser-dark.css                                    14-Feb-2019 07:15                2637
liquibyte.css                                      25-May-2017 09:15                3991
lucario.css                                        20-Mar-2018 15:42                1914
material-darker.css                                23-Aug-2019 13:26                2607
material-ocean.css                                 23-Aug-2019 13:26                2576
material-palenight.css                             23-Aug-2019 13:26                2724
material.css                                       23-Aug-2019 13:26                2354
mbo.css                                            01-Mar-2017 09:09                2112
mdn-like.css                                       25-May-2017 09:15                5196
midnight.css                                       08-May-2019 08:49                1856
monokai.css                                        22-May-2018 08:47                2179
moxer.css                                          23-Aug-2019 14:30                2369
neat.css                                           01-Mar-2017 09:09                 688
neo.css                                            19-Aug-2015 13:47                 947
night.css                                          25-May-2017 09:15                1746
nord.css                                           18-Feb-2019 08:25                2088
oceanic-next.css                                   10-Jan-2018 09:06                2258
panda-syntax.css                                   11-Mar-2019 16:53                1804
paraiso-dark.css                                   01-Mar-2017 09:09                2078
paraiso-light.css                                  01-Mar-2017 09:09                2078
pastel-on-dark.css                                 25-May-2017 09:15                2485
railscasts.css                                     01-Mar-2017 09:09                1514
rubyblue.css                                       25-May-2017 09:15                1801
seti.css                                           25-May-2017 09:15                2009
shadowfox.css                                      10-Jan-2018 16:54                2440
solarized.css                                      08-Nov-2017 08:45                5426
ssms.css                                           29-Mar-2018 14:49                 751
the-matrix.css                                     25-May-2017 09:15                1940
tomorrow-night-bright.css                          01-Mar-2017 09:09                1769
tomorrow-night-eighties.css                        01-Mar-2017 09:09                2439
ttcn.css                                           25-May-2017 09:15                2440
twilight.css                                       25-May-2017 09:15                2164
vibrant-ink.css                                    14-Feb-2019 07:15                2142
xq-dark.css                                        25-May-2017 09:15                3033
xq-light.css                                       25-May-2017 09:15                2255
yeti.css                                           25-May-2017 09:15                1884
yonce.css                                          19-Aug-2019 12:07                3075
zenburn.css                                        18-Mar-2020 06:51                2001

*/

