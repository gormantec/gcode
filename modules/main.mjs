import { beautify } from '/modules/beutify.mjs';
import { loadFeatures,refreshFeatures } from '/modules/featureManager.mjs';
import { getImage,createHtml } from '/modules/htmlUtils.mjs';
import { save,load,remove } from '/modules/gcodeStorage.mjs';



var debug = { log: function (v) { console.log(v); } };

//int variables   

window.leftToolbarWidth = 50;
var leftToolbarFontSize = window.leftToolbarWidth - 26;
window.leftPageWidth = 170;
var screenWidth = window.outerWidth || document.documentElement.clientWidth || 0;
if (screenWidth <= 1024) window.leftPageWidth = 300;
var pageBottomHeight = 150;

var myLogin = "";
var win;
var xx = "";


function _onclickFilename() {
    document.getElementById("filename").onclick = null;
    var input = document.createElement("input");
    var oldfilename = document.getElementById("filename").innerText;
    input.value = oldfilename;
    document.getElementById("filename").innerHTML = "";
    document.getElementById("filename").appendChild(input);
    input.onkeypress = function (e) {
        if (!e) e = window.event;
        var keyCode = e.keyCode || e.which;
        if (keyCode == '13') {
            // Enter pressed
            var filename = input.value;
            if (filename == "" || filename == null) return false;
            save(filename,window.editor.getValue());
            localStorage.setItem("lastFileName", filename);
            remove(oldfilename);
        
            input.onkeypress = null;
            document.getElementById("filename").innerHTML = filename;
            document.getElementById("filename").onclick = _onclickFilename;
            _refresh();
            return false;
        }
    };
}

function _refresh()
{
    refreshFeatures();
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
            if (window.editor) window.editor.refresh();
            document.getElementById("pageLeftToolbar").style.display = "none";
            document.getElementById("pageMiddle").style.left = "0px";
            document.getElementById("pageMiddle").style.right = "0px";
            document.getElementById("filename").style.marginLeft = (window.leftToolbarWidth + 31) + "px";
            document.getElementById("runHeaderButton").style.left = (window.leftToolbarWidth + 2) + "px";
            document.getElementById("sideBarButton").getElementsByTagName("i")[0].innerText = "keyboard_arrow_right";

        }
        else {
            document.getElementById("pageLeft").style.display = "none";
            document.getElementById("pageLeftToolbar").style.display = "none";
            document.getElementById("pageMiddle").style.left = "0px";
            document.getElementById("pageMiddle").style.right = "0px";
            document.getElementById("pageMiddle").style.display = "";
            if (window.editor) window.editor.refresh();
            document.getElementById("filename").style.marginLeft = (window.leftToolbarWidth + 31) + "px";
            document.getElementById("runHeaderButton").style.left = (window.leftToolbarWidth + 2) + "px";
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
            document.getElementById("filename").style.marginLeft = (window.leftToolbarWidth + 31) + "px";
            document.getElementById("runHeaderButton").style.left = (window.leftToolbarWidth + 2) + "px";
            document.getElementById("sideBarButton").getElementsByTagName("i")[0].innerText = "keyboard_arrow_left";
        }
        else {

            document.getElementById("pageLeft").style.display = "";
            document.getElementById("pageLeft").style.right = "unset";
            document.getElementById("pageLeft").style.width = window.leftPageWidth + "px";
            document.getElementById("pageLeft").style.display = "";
            document.getElementById("pageLeftToolbar").style.display = "";
            document.getElementById("pageMiddle").style.display = "";
            if (window.editor) window.editor.refresh();
            document.getElementById("pageMiddle").style.left = (window.leftToolbarWidth + window.leftPageWidth + 2) + "px";
            document.getElementById("filename").style.marginLeft = (window.leftToolbarWidth + window.leftPageWidth + 32) + "px";
            document.getElementById("runHeaderButton").style.left = (window.leftToolbarWidth + window.leftPageWidth + 2) + "px";
            document.getElementById("sideBarButton").getElementsByTagName("i")[0].innerText = "keyboard_arrow_left";
        }
    }

}

function _runCode()
{

        var filename = document.getElementById("filename").innerText;
        if (filename.endsWith(".js")) {
            debug.log(myLogin + "$ nodejs " + filename + "\n");
            try {
                var _run = function () {
                    eval(window.editor.getValue());
                }
                _run();
            }
            catch (e) {
                console.error(e);
            }
            debug.log(myLogin + "$");
        }
        else if (filename.endsWith(".dapp.ts")) {
            debug.log(myLogin + "$ echo 'Create dApp'\n");
            debug.log(myLogin + "$ asc " + filename + " --target release\n");
            import('/modules/ascompile.mjs').then(({ run }) => {
                run(
                    window.editor.getValue(),
                    filename,
                    filename,
                    "optimized.wasm",
                    (e,d) => { if(!e) console.log(d); }
                );
            });
        }
        else if (filename.endsWith(".ts")) {
            debug.log(myLogin + "$ asc " + filename + " --target release\n");
            import('/modules/ascompile.mjs').then(({ run }) => {
                var code=window.editor.getValue();
                run(
                    code,
                    "node_modules/wasmdom/assembly/index.ts",
                    "wasmdom/assembly/src/app.ts",
                    "optimized.wasm",
                    (e,d) => {
                        if(!e)
                        {
                            try {
                                var result = createHtml(code);
                                var splashBackgroundColor=result.splashBackgroundColor;
                                var splash=result.splash;
                                var mockFrame=result.mockFrame;
                                var rootHTML=result.rootHTML;
                                var _script1 = window.document.createElement("script");
                                _script1.text = "\nwindow.wasmdomURL=\"" + d.dataURL + "\";\n";
                                rootHTML.querySelector("body").appendChild(_script1);
                                var _script2 = window.document.createElement("script");
                                _script2.src = "https://gcode.com.au/js/wasmdom.js";
                                rootHTML.querySelector("body").appendChild(_script2);
    
                                var wpos = "top=50,left=50";
                                var w = 375;
                                var h = 896 * 375 / 414; //iphoneX=896/414
                                var mockPadding = 40;
                                if (screen.height <= 768) {
                                    w = Math.floor(w * 0.75);
                                    h = Math.floor(h * 0.75);
                                    mockPadding = Math.floor(mockPadding * 0.75);
                                    wpos = "top=0,left=0";
                                }
                                var wh = "width=" + parseInt(w) + ",height=" + parseInt(h);
                                var frame = "";
                                if (mockFrame) {
                                    wh = "width=" + (w + mockPadding) + ",height=" + (h + mockPadding);
                                    frame = "?mockFrame=" + mockFrame;
                                }
                                if (!win || win.closed) {
                                    win = window.open("", "_blank", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no," + wh + "," + wpos);
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
                        }
                        
                    }
                );
            });

            debug.log("\n");
        }
        else if (filename.endsWith(".mjs")) {
            debug.log(myLogin + "$ launch webApp " + filename + "\n");
            try {
                var code=window.editor.getValue();
                var result = createHtml(code);
                var splashBackgroundColor=result.splashBackgroundColor;
                var splash=result.splash;
                var mockFrame=result.mockFrame;
                var rootHTML=result.rootHTML;

                var _module = window.document.createElement("script");
                _module.setAttribute("type", "module");
                _module.text = "\n" + window.editor.getValue() + "\n";
                rootHTML.querySelector("head").appendChild(_module);
                var wpos = "top=50,left=50";
                var w = 375;
                var h = 896 * 375 / 414; //iphoneX=896/414
                var mockPadding = 40;
                if (screen.height <= 768) {
                    w = Math.floor(w * 0.75);
                    h = Math.floor(h * 0.75);
                    mockPadding = Math.floor(mockPadding * 0.75);
                    wpos = "top=0,left=0";
                }
                var wh = "width=" + parseInt(w) + ",height=" + parseInt(h);
                var frame = "";
                if (mockFrame) {
                    wh = "width=" + (w + mockPadding) + ",height=" + (h + mockPadding);
                    frame = "?mockFrame=" + mockFrame;
                }
                if (!win || win.closed) {
                    win = window.open("", "_blank", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no," + wh + "," + wpos);
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
                    return Sk.importMainWithBody("<stdin>", false, window.editor.getValue(), true);
                });
                debug.log("$");
            }
            catch (e) {
                console.error(e);
            }
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

function builtinRead(x) {
    if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined)
        throw "File not found: '" + x + "'";
    return Sk.builtinFiles["files"][x];
}

function consolelog(x) {

    if (x == "\n") {
        debug.log(xx);
        xx = "";
    }
    else {
        xx = xx + x;
    }
}



window.setEditorMode=function() {
    var filename = document.getElementById("filename").innerText;
    if (filename.endsWith(".js")) {
        window.editor.setOption("mode", "javascript");
    }
    else if (filename.endsWith(".mjs")) {
        window.editor.setOption("mode", "javascript");
    }
    else if (filename.endsWith(".ts")) {
        window.editor.setOption("mode", "text/typescript");
    }
    else if (filename.endsWith(".py")) {
        window.editor.setOption("mode", "python");
    }
    else if (filename.endsWith(".dart")) {
        window.editor.setOption("mode", "dart");
    }
    else if (filename.endsWith(".css")) {
        window.editor.setOption("mode", "css");
    }
    else if (filename.endsWith(".json")) {
        window.editor.setOption("mode", "javascript");
    }
    else if (filename.endsWith(".htm") || filename.endsWith(".html")) {
        window.editor.setOption("mode", "htmlmixed");
    }

    console.log(window.editor.getOption("mode"));
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
            if (window.editor) window.editor.refresh();
        }
    }
    else {
        document.getElementById("pageLeft").style.display = "";
        document.getElementById("pageLeft").style.right = "unset";
        document.getElementById("pageLeft").style.width = window.leftPageWidth + "px";
        document.getElementById("pageMiddle").style.display = "";
        if (window.editor) window.editor.refresh();
    }
});

document.addEventListener("DOMContentLoaded", function () {
    
    //configure editor

    var theme = "material-darker2";
    window.editor = CodeMirror.fromTextArea(document.getElementById("sourcecode"), {
        lineNumbers: true,
        theme: theme,
        matchBrackets: true,
        moz: true,
        extraKeys: {
            "Ctrl-Q": function (cm) { cm.foldCode(cm.getCursor()); },
            "Ctrl-Space": "autocomplete",
            "Ctrl-Enter": function (cm) { beautify(window.editor) }
        },
        foldGutter: true,
        gutters: ["CodeMirror-lint-markers", "CodeMirror-linenumbers", "CodeMirror-foldgutter"],
        lint: { 'esversion': '6' }
    });

    Array.from(document.getElementsByClassName("cm-s-theme")).forEach(function (e) { e.classList.add('cm-s-' + theme); });
    Array.from(document.getElementsByClassName("cm-s-theme")).forEach(function (e) { e.classList.remove('cm-s-theme'); });


    

    //get last filename

    var lastFileName = localStorage.getItem("lastFileName");
    if (lastFileName) {
        document.getElementById("filename").innerText = lastFileName;
        window.setEditorMode();
        window.editor.setValue(load(lastFileName,true));
    }
    else {
        document.getElementById("filename").innerText = "new-file-" + (Math.round(Date.now() / 1000) - 1592000000) + ".mjs";
    }

    //resize page

    document.getElementById("pageLeftToolbar").style.fontSize = leftToolbarFontSize + "px";
    var w = window.outerWidth || document.documentElement.clientWidth || 0;
    document.getElementById("pageLeftToolbar").style.width = window.leftToolbarWidth + "px";


    // add event listeners

    document.getElementById("terminalButton").onclick = _toggleTerminal;
    document.getElementById("sideBarButton").onclick = _toggleSideBar;
    document.getElementById("filename").onclick = _onclickFilename;
    document.getElementById("runHeaderButton").onclick = _runCode;

    //load features

    _toggleSideBar();
    _toggleSideBar();

    loadFeatures();


    //divert console output to webpage.

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
                if (message.startsWith("\b")) {
                    var lll = logger.innerHTML;
                    logger.innerHTML = lll.substring(0, lll.lastIndexOf("</div>")) + message.substring(1) + '</div>';
                }
                else {
                    logger.innerHTML += "<div>" + message + '</div>';
                }
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
            window.leftPageWidth = (parseInt(getComputedStyle(panel, '').width) - dx);
            panel.style.width = window.leftPageWidth + "px";
            panelMiddle.style.left = (window.leftToolbarWidth + window.leftPageWidth + 2) + "px";
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
        console.log(window.editor.getOption("mode"));
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


    setTimeout(function () {
        document.getElementById("splashScreen").hidden = true;
    }, 2000);


});


