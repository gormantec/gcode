import * as githubtree from '/modules/githubtree.mjs';
import { beautify } from '/modules/beutify.mjs';
import { loadFeatures,refreshFeatures } from '/modules/featureManager.mjs';
import { getImage,createHtml } from '/modules/htmlUtils.mjs';

var editor;

var debug = { log: function (v) { console.log(v); } };

//int variables   

var leftToolbarWidth = 50;
var leftToolbarFontSize = leftToolbarWidth - 26;
var leftPageWidth = 170;
var screenWidth = window.outerWidth || document.documentElement.clientWidth || 0;
if (screenWidth <= 1024) leftPageWidth = 300;
var pageBottomHeight = 150;

var myLogin = "";


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
            localStorage.setItem("file-" + filename, btoa(editor.getValue()));
            localStorage.setItem("lastFileName", filename);
            localStorage.removeItem("file-" + oldfilename);
        
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

function _runCode()
{

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
            debug.log(myLogin + "$");
        }
        else if (filename.endsWith(".dapp.ts")) {
            debug.log(myLogin + "$ echo 'Create dApp'\n");
            debug.log(myLogin + "$ asc " + filename + " --target release\n");
            import('/modules/ascompile.mjs').then(({ run }) => {
                run(
                    editor.getValue(),
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
                var code=editor.getValue();
                run(
                    code,
                    "node_modules/wasmdom/assembly/index.ts",
                    "wasmdom/assembly/src/app.ts",
                    "optimized.wasm",
                    (e,d) => {
                        if(!e)
                        {
                            console.log(d);
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
                var code=editor.getValue();
                var result = createHtml(code);
                var splashBackgroundColor=result.splashBackgroundColor;
                var splash=result.splash;
                var mockFrame=result.mockFrame;
                var rootHTML=result.rootHTML;

                var _module = window.document.createElement("script");
                _module.setAttribute("type", "module");
                _module.text = "\n" + editor.getValue() + "\n";
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
                    return Sk.importMainWithBody("<stdin>", false, editor.getValue(), true);
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



function _setEditorMode() {
    var filename = document.getElementById("filename").innerText;
    if (filename.endsWith(".js")) {
        editor.setOption("mode", "javascript");
    }
    else if (filename.endsWith(".mjs")) {
        editor.setOption("mode", "javascript");
    }
    else if (filename.endsWith(".ts")) {
        editor.setOption("mode", "text/typescript");
    }
    else if (filename.endsWith(".py")) {
        editor.setOption("mode", "python");
    }
    else if (filename.endsWith(".dart")) {
        editor.setOption("mode", "dart");
    }
    else if (filename.endsWith(".css")) {
        editor.setOption("mode", "css");
    }
    else if (filename.endsWith(".json")) {
        editor.setOption("mode", "javascript");
    }
    else if (filename.endsWith(".htm") || filename.endsWith(".html")) {
        editor.setOption("mode", "htmlmixed");
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
    
    //configure editor

    var theme = "material-darker2";
    editor = CodeMirror.fromTextArea(document.getElementById("sourcecode"), {
        lineNumbers: true,
        theme: theme,
        matchBrackets: true,
        moz: true,
        extraKeys: {
            "Ctrl-Q": function (cm) { cm.foldCode(cm.getCursor()); },
            "Ctrl-Space": "autocomplete",
            "Ctrl-Enter": function (cm) { beautify(editor) }
        },
        foldGutter: true,
        gutters: ["CodeMirror-lint-markers", "CodeMirror-linenumbers", "CodeMirror-foldgutter"],
        lint: { 'esversion': '8' }
    });

    Array.from(document.getElementsByClassName("cm-s-theme")).forEach(function (e) { e.classList.add('cm-s-' + theme); });
    Array.from(document.getElementsByClassName("cm-s-theme")).forEach(function (e) { e.classList.remove('cm-s-theme'); });


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

    //get last filename

    var lastFileName = localStorage.getItem("lastFileName");
    if (lastFileName) {
        document.getElementById("filename").innerText = lastFileName;
        _setEditorMode();
        editor.setValue(atob(localStorage.getItem("file-" + lastFileName)));
    }
    else {
        document.getElementById("filename").innerText = "new-file-" + (Math.round(Date.now() / 1000) - 1592000000) + ".mjs";
    }

    //resize page

    document.getElementById("pageLeftToolbar").style.fontSize = leftToolbarFontSize + "px";
    var w = window.outerWidth || document.documentElement.clientWidth || 0;
    document.getElementById("pageLeftToolbar").style.width = leftToolbarWidth + "px";


    // add event listeners

    document.getElementById("terminalButton").onclick = _toggleTerminal;
    document.getElementById("sideBarButton").onclick = _toggleSideBar;
    document.getElementById("filename").onclick = _onclickFilename;
    document.getElementById("runHeaderButton").onclick = _runCode;
    
    //load features

    loadFeatures();


    //divert console output to webpage.

/*()
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

*/


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
                    var filename = document.getElementById("filename").innerText;
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
            }
        });
    }
    setTimeout(function () {
        document.getElementById("splashScreen").hidden = true;
    }, 2000);


});


