import { beautify } from '/modules/beutify.mjs';
import { loadFeatures, refreshFeatures,setFeature } from '/modules/featureManager.mjs';
import { getImage, createHtml } from '/modules/htmlUtils.mjs';
import { save, load, remove, preload } from '/modules/gcodeStorage.mjs';
import { getScript } from '/modules/getScript.mjs';



window.debug = window.debug || { log: function (v) { console.log(v); } };

//int variables   

window.leftToolbarWidth = 50;
var leftToolbarFontSize = window.leftToolbarWidth - 26;
window.leftPageWidth = 170;
var screenWidth = window.outerWidth || document.documentElement.clientWidth || 0;
if (screenWidth <= 1024) window.leftPageWidth = 300;
var pageBottomHeight = 150;

window.myLogin = "";
var win;
var xx = "";




function _onclickFilename() {
    document.getElementById("filename").onclick = null;
    var input = document.createElement("input");
    var oldfilename = document.getElementById("filename").innerText;
    input.value = oldfilename;
    document.getElementById("filename").innerHTML = "";
    document.getElementById("filename").appendChild(input);
    let ls=(e)=>{
        if (!e) e = window.event;
        var keyCode = e.keyCode || e.which;
        if (keyCode == '13') {
            // Enter pressed
            var filename = input.value;
            if (filename == "" || filename == null) return false;
            save(filename, window.editor.getValue());
            console.log("******* setItem(\""+lastFileName+"\"")
            localStorage.setItem("lastFileName", filename);
            remove(oldfilename);
            input.removeEventListener("keypress",ls,false);
            document.getElementById("filename").innerHTML = filename;
            document.getElementById("filename").onclick = _onclickFilename;
            _refresh();
            return false;
        }
    }
    input.addEventListener("keypress",ls,false);
}

function _refresh() {
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

function _runCode() {


    var filename = document.getElementById("filename").innerText;
    if (filename.endsWith(".js")) {
        console.log(window.myLogin + "$ nodejs " + filename + "\n");
        try {
            var _run = function () {
                eval(window.editor.getValue());
            }
            _run();
        }
        catch (e) {
            console.error(e);
        }
        console.log(window.myLogin + "$");
    }
    else if (filename.endsWith(".dapp.ts")) {
        console.log(window.myLogin + "$ echo 'Create dApp'\n");
        console.log(window.myLogin + "$ asc " + filename + " --target release\n");
        import('/modules/ascompile.mjs').then(({ run }) => {
            var code = window.editor.getValue();
            run(
                window.editor.getValue(),
                filename,
                filename,
                "optimized.wasm",
                true,
                (e, d) => {
                    if (!e) {
                        try {
                            const accountId = d.testdata.accountId;
                            var jApp = 'import { PWA, Page, Div } from "https://gcode.com.au/modules/pwa.mjs";\n' +
                                'import { test, addkey } from "https://gcode.com.au/modules/near/index.mjs";\n\n' +
                                'var aPWA=new PWA({\ntitle:"Gorman Technology Pty Ltd",\nfooter:"https://www.gormantec.com",\nprimaryColor:"#005040",\n});\n\n' +
                                'aPWA.show();\n\n' +
                                'var mainPage=new Page({color: "black",paddingTop:"45px", child: new Div({innerHTML:""})});\n' +
                                'aPWA.setPage(mainPage);\nwindow.wconsole={\nlog:(text)=>{\n' +
                                '  consolePage.innerHTML=consolePage.innerHTML+"<p style=\\"font-size:smaller;margin:2px;padding-left:5px;padding-right:5px;padding-top:2px;padding-bottom:2px\\">near$ "+text+"</p>"\n}' +
                                '};\n' +
                                'var button=new Div({class:"floatingActionButton",borderRadius:"5px",lineHeight:"30px",textAlign:"center",color:"white",backgroundColor:"#005040",top:"5px",left:"5px",width:"80px",height:"30px",innerHTML:"RUN"});\n' +
                                'var consolePage=new Div({top:"50px",left:"5px",right:"5px",bottom:"5px"});' +
                                'button.onclick(function(){console.log("RUN TEST");consolePage.innerHTML="";test(' + JSON.stringify(d.testdata) + ');});\n' +
                                'mainPage.appendChild(button);\n' +
                                'mainPage.appendChild(consolePage);\n' +
                                'window.addEventListener("message",function(e){if(e.origin=="https://gcode.com.au")addkey(e.data);},false);\n' +
                                'window.addEventListener("load", (event) => {window.opener.postMessage("loaded","https://gcode.com.au");});\n';
                            var result = createHtml((code && code.trim().substring(0, 2) == "/*") ? code.substring(0, code.indexOf("*/") + 2) : "");
                            var splashBackgroundColor = result.splashBackgroundColor;
                            var splash = result.splash;
                            var mockFrame = result.mockFrame;
                            var rootHTML = result.rootHTML;
                            var _module = window.document.createElement("script");
                            _module.setAttribute("type", "module");
                            _module.text = "\n" + jApp + "\n";
                            rootHTML.querySelector("head").appendChild(_module);
                            //var _script1 = window.document.createElement("script");
                            //_script1.src = "https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.6/require.min.js";
                            //rootHTML.querySelector("head").appendChild(_script1);


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
                            _uploadFile({ html: "<!DOCTYPE html>\n" + rootHTML.outerHTML, icon: splash }, function (error, uri) {
                                if (error) {
                                    console.log(error);
                                }
                                else {
                                    console.log("open window");
                                    win.location.href = uri + frame;

                                    import('/modules/near/nearConfig.mjs').then(({ nearConfig }) => {
                                        const getNearApi = getScript('https://cdn.jsdelivr.net/npm/near-api-js@0.41.0/dist/near-api-js.min.js', ["nearApi"]);
                                        getNearApi.then(({ nearApi }) => {
                                            const nearCfg = nearConfig(nearApi, accountId.endsWith(".near") ? "mainnet" : "testnet");
                                            nearCfg.keyStore.getKey(accountId.endsWith(".near") ? "mainnet" : "testnet", accountId).then((key) => {
                                                const lll = function (e) {
                                                    console.log("Received Post: " + e.origin);
                                                    if (e.origin !== "https://s3-ap-southeast-2.amazonaws.com") return;
                                                    console.log("Send Post to: " + uri);
                                                    win.postMessage({ accountId: accountId, key: key.toString() }, uri);
                                                    window.removeEventListener("message", lll);
                                                    console.log("Send Post");
                                                };
                                                window.addEventListener("message", lll, false);
                                            })
                                        })
                                    });



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
    }
    else if (filename.endsWith(".ts")) {
        console.log(window.myLogin + "$ asc " + filename + " --target release\n");
        import('/modules/ascompile.mjs').then(({ run }) => {
            var code = window.editor.getValue();
            run(
                code,
                "/node_modules/wasmdom-jsdom/assembly/index.ts",
                "wasmdom-jsdom/assembly/src/app.ts",
                "optimized.wasm",
                false,
                (e, d) => {
                    if (!e) {
                        try {
                            var result = createHtml(code);
                            var splashBackgroundColor = result.splashBackgroundColor;
                            var splash = result.splash;
                            var mockFrame = result.mockFrame;
                            var rootHTML = result.rootHTML;
                            var _script1 = window.document.createElement("script");
                            _script1.text = "\nwindow.wasmdomURL=\"" + d.dataURL + "\";\n";
                            rootHTML.querySelector("head").appendChild(_script1);
                            var _script2 = window.document.createElement("script");
                            _script2.src = "https://gcode.com.au/modules/wasmdom/index.js";
                            _script2.type = "module";
                            rootHTML.querySelector("head").appendChild(_script2);

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
                            _uploadFile({ html: "<!DOCTYPE html>\n" + rootHTML.outerHTML, icon: splash }, function (error, uri) {
                                if (error) {
                                    console.log(error);
                                }
                                else {
                                    console.log("open window");
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

        console.log("\n");
    }
    else if (filename.endsWith(".mjs")) {
        /*
        console.log(window.myLogin + "$ launch webApp " + filename + "\n");
        var errorline=0;
        try {
            var code = window.editor.getValue(); errorline=328;
            var result = createHtml(code);
            var splashBackgroundColor = result.splashBackgroundColor;
            var splash = result.splash;
            var mockFrame = result.mockFrame;
            var rootHTML = result.rootHTML; errorline=333;

            var _module = window.document.createElement("script");
            _module.setAttribute("type", "module");
            _module.text = "\n" + window.editor.getValue() + "\n";
            rootHTML.querySelector("head").appendChild(_module);
            var wpos = "top=50,left=50";errorline=339;
            var w = 375;
            var h = 896 * 375 / 414; //iphoneX=896/414
            var mockPadding = 40;
            if (screen.height <= 768) {
                w = Math.floor(w * 0.75);
                h = Math.floor(h * 0.75);
                mockPadding = Math.floor(mockPadding * 0.75);
                wpos = "top=0,left=0";
            }
            var wh = "width=" + parseInt(w) + ",height=" + parseInt(h); errorline=349;
            var frame = "";
            if (mockFrame) {
                wh = "width=" + (w + mockPadding) + ",height=" + (h + mockPadding);
                frame = "?mockFrame=" + mockFrame;errorline=353;
            }
            if (!win || win.closed) {
                win = window.open("", "_blank", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no," + wh + "," + wpos);
                if (splashBackgroundColor) win.document.body.style.backgroundColor = splashBackgroundColor;
                else win.document.body.style.backgroundColor = "black";errorline=358;
            }
            _uploadFile({ html: "<!DOCTYPE html>\n" + rootHTML.outerHTML, icon: splash }, function (error, uri) {
                if (error) { errorline=361;
                    console.log(error); errorline=362;
                }
                else {
                    console.log("open window"); errorline=365;
                    win.location.href = uri + frame; errorline=366;

                    var accountIdList=code.match(/\"*accountId\"*\s*?:\s*?\"[a-zA-Z0-9_-]*?\.(testnet|mainnet)\"/gi);errorline=368;
                    if(accountIdList && accountIdList.length>0)
                    {
                        var accountId=accountIdList[0].replace(/\"*accountId\"*\s*?:\s*?\"([a-zA-Z0-9_-]*?\.)(testnet|mainnet)\"/gi,"$1$2");
                        import('/modules/near/nearConfig.mjs').then(({ nearConfig }) => {errorline=372;
                            const getNearApi = getScript('https://cdn.jsdelivr.net/npm/near-api-js@0.41.0/dist/near-api-js.min.js', ["nearApi"]);errorline=373;
                            getNearApi.then(({ nearApi }) => {errorline=374;
                                const nearCfg = nearConfig(nearApi);errorline=375;console.log("get key:"+accountId);
                                nearCfg.keyStore.getKey("testnet", accountId).then((key) => {errorline=376;console.log("key="+key);
                                    if(key)
                                    {
                                        const lll = function (e) {errorline=377;
                                            console.log("Received Post: " + e.origin);errorline=378;
                                            if (e.origin !== "https://s3-ap-southeast-2.amazonaws.com") return;
                                            console.log("Send Post to: " + uri);
                                            win.postMessage({ accountId: accountId, key: key.toString() }, uri);
                                            window.removeEventListener("message", lll);
                                            console.log("Send Post");
                                        };
                                        window.addEventListener("message", lll, false);
                                    }
                                })
                            })
                        });
                    }

                }

            });
        }
        catch (e) {
            console.error("error:" + e + "atline="+errorline);
        }
        console.log("\n");
        */
    }
    else if (filename.endsWith(".py")) {
        try {
            console.log(window.myLogin + "$ python " + filename)
            Sk.pre = "output";
            Sk.configure({
                output: consolelog, read: builtinRead
            });
            var myPromise = Sk.misceval.asyncToPromise(function () {
                return Sk.importMainWithBody("<stdin>", false, window.editor.getValue(), true);
            });
            console.log("$");
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
        console.log(xx);
        xx = "";
    }
    else {
        xx = xx + x;
    }
}



window.setEditorMode = function () {
    var filename = document.getElementById("filename").innerText;
    if (filename.endsWith(".js")) {
        window.editor.setOption("mode", "javascript");
        window.editor.setOption('lint', { options: { esversion: 6 } });
        setFeature("javascript");
    }
    else if (filename.endsWith(".mjs")) {
        window.editor.setOption("mode", "javascript");
        window.editor.setOption('lint', { options: { esversion: 6 } });
        setFeature("javascript");
    }
    else if (filename.endsWith(".ts")) {
        window.editor.setOption("mode", "text/typescript");
        window.editor.setOption('lint', { options: { esversion: 6 } });
        setFeature("typescript");
    }
    else if (filename.endsWith(".py")) {
        window.editor.setOption("mode", "python");
        setFeature("python");
    }
    else if (filename.endsWith(".dart")) {
        window.editor.setOption("mode", "dart");
        setFeature("dart");
    }
    else if (filename.endsWith(".css")) {
        window.editor.setOption("mode", "css");
        setFeature("css");
    }
    else if (filename.endsWith(".json")) {
        window.editor.setOption("mode", "javascript");
        setFeature("javascript");
    }
    else if (filename.endsWith(".htm") || filename.endsWith(".html")) {
        window.editor.setOption("mode", "htmlmixed");
        setFeature("html");
    }
    else if (filename.endsWith(".svg") || filename.endsWith(".xml")) {
        window.editor.setOption("mode", "xml");
        setFeature("svg");
    }

    console.log(window.editor.getOption("mode"));
    console.log(window.editor.options);
    //window.editor
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

    (async () => {

        var theme = "material-darker2";
        window.editor = CodeMirror.fromTextArea(document.getElementById("sourcecode"), {
            value: "/* NONE */",
            lineNumbers: true,
            theme: theme,
            matchBrackets: true,
            extraKeys: {
                "Ctrl-Q": function (cm) { cm.foldCode(cm.getCursor()); },
                "Ctrl-Space": "autocomplete",
                "Ctrl-Enter": function (cm) { beautify(window.editor) }
            },
            foldGutter: true,
            gutters: ["CodeMirror-lint-markers", "CodeMirror-linenumbers", "CodeMirror-foldgutter"],
            lint: { esversion: 6 }
        });

        Array.from(document.getElementsByClassName("cm-s-theme")).forEach(function (e) { e.classList.add('cm-s-' + theme); });
        Array.from(document.getElementsByClassName("cm-s-theme")).forEach(function (e) { e.classList.remove('cm-s-theme'); });




        //get last filename

        var lastFileName = localStorage.getItem("lastFileName");
        console.log("lastFileName:" + lastFileName);

        var lastFileData;
        if (lastFileName && lastFileName.startsWith("git://")) { await preload(lastFileName); }

        if (lastFileName) lastFileData = load(lastFileName, true);
        if (lastFileData) {

            document.getElementById("filename").innerText = lastFileName;
            try {

                window.editor.setValue(load(lastFileName, true));
                window.setEditorMode();
            }
            catch (e) {
                console.log(lastFileName);
                console.log(load(lastFileName, true));
                console.log(e);
            }
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

        /*
    
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
        let resizex=function (e) {

            if (w >= 576) {
                const dx = m_posx - e.x;
                m_posx = e.x;
                window.leftPageWidth = (parseInt(getComputedStyle(panel, '').width) - dx);
                panel.style.width = window.leftPageWidth + "px";
                panelMiddle.style.left = (window.leftToolbarWidth + window.leftPageWidth + 2) + "px";
            }
            else {
                if (document.getElementById("pageLeftToolbar").style.display != "none") {
                    document.getElementById("filename").style.marginLeft = (window.leftToolbarWidth + 31) + "px";
                    document.getElementById("runHeaderButton").style.left = (window.leftToolbarWidth + 2) + "px";
                }
            }
        }

        let resizey=function(e) {
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

        if (window.location.href != "http://127.0.0.1:8080/") {
            console.log(window.location.href);
            setTimeout(function () {
                document.getElementById("splashScreen").hidden = true;
            }, 2000);
        }
        else {
            document.getElementById("splashScreen").hidden = true;
        }


    })()



});


