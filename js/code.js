class HtmlApp {
    constructor(title, params) {
        this.title = title || "Code";
        this.params = "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=400,height=600,top=50,left=50";
        this.innerHTML = "TEST";
    }

    open() {
        console.log("open: " + this.title);
        var win = window.open("", this.title, this.params);
        win.document.body.innerHTML = this.innerHTML;
    }
}

class Body {
    constructor(params) {
        window.document.body.innerHTML = "";
        if (params.child.element instanceof HTMLElement) this.element.appendChild(params.child.element);
        else if (params.child instanceof HTMLElement) this.element.appendChild(params.child);
        else if (params.child instanceof String) this.element.innerHTML = params.child;
        else if (params instanceof HTMLElement) this.element.appendChild(params);
        else if (params instanceof String) this.element.innerHTML = params;
    }
    append(params) {
        if (params.child.element instanceof HTMLElement) this.element.appendChild(params.child.element);
        else if (params.child instanceof HTMLElement) this.element.appendChild(params.child);
        else if (params.child instanceof String) this.element.innerHTML = params.child;
        else if (params instanceof HTMLElement) this.element.appendChild(params);
        else if (params instanceof String) this.element.innerHTML = params;
    }
}

class Div {
    constructor(params) {
        this.element = document.createElement('div');
        if (params.child.element instanceof HTMLElement) this.element.appendChild(params.child.element);
        else if (params.child instanceof HTMLElement) this.element.appendChild(params.child);
        else if (params.child instanceof String) this.element.innerHTML = params.child;
        else if (params instanceof HTMLElement) this.element.appendChild(params);
        else if (params instanceof String) this.element.innerHTML = params;

        if (params.id instanceof String) this.element.id = params.class;
        if (params.class instanceof String) this.element.className = params.class;
    }
    append(params) {
        if (params.child.element instanceof HTMLElement) this.element.appendChild(params.child.element);
        else if (params.child instanceof HTMLElement) this.element.appendChild(params.child);
        else if (params.child instanceof String) this.element.innerHTML = params.child;
        else if (params instanceof HTMLElement) this.element.appendChild(params);
        else if (params instanceof String) this.element.innerHTML = params;
    }
}

var editor;

//int variables

var leftToolbarWidth = 50;
var leftToolbarFontSize = leftToolbarWidth - 26;
var leftPageWidth = 170;
var selectedFileWidget = null;
var pageBottomHeight =150;





// root functions



function _save() {
    var filename = document.getElementById("filename").innerText;
    if (filename == "" || selectedFileWidget == null) return;
    localStorage.setItem("file-" + filename, btoa(editor.getValue()));
    localStorage.setItem("lastFileName", filename);
}

function _delete() {
    var filename = document.getElementById("filename").innerText;
    if (filename == "" && selectedFileWidget != null) filename = selectedFileWidget;
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

function _new() {
    var aFilename = prompt("Filename", "new-file-" + (Math.round(Date.now() / 1000) - 1592000000) + ".js");
    if (aFilename != null) {
        document.getElementById("filename").innerText = aFilename;
        selectedFileWidget = aFilename;
        editor.setValue("/*\n\n  filename:" + aFilename + "\n  created: " + (new Date(Date.now())).getFullYear() + "-" + (new Date(Date.now())).getMonth() + "-" + (new Date(Date.now())).getDay() + "T" + (new Date()).toLocaleTimeString() + "\n\n*/\n\nconsole.log('new javascript file!');\n\nvar aHtmlApp=new HtmlApp();\n\naHtmlApp.open();");
        if (selectedFileWidget.endsWith(".js")) {
            //editor.setOption("mode", "javascript");
        }
        else if (selectedFileWidget.endsWith(".py")) {
            //editor.setOption("mode", "python");
        }
        else if (selectedFileWidget.endsWith(".dart")) {
            //editor.setOption("mode", "dart");
        }
    }
    _refresh();
}

function _openFile() {
    selectedFileWidget = this.dataset.name;
    document.getElementById("filename").innerText = this.dataset.name;
    editor.setValue(atob(localStorage.getItem("file-" + this.dataset.name)));
    _setEditorMode();
    _refresh();
}
function _setEditorMode() {
    if (selectedFileWidget.endsWith(".js")) {
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
function _openDir() {


    var _dirname = this.dataset.name;
    var _this = this;
    var _fileDisplayValue = "none";
    if (_this.dataset.state && _this.dataset.state == "closed") {
        _this.dataset.state = "open";
        _fileDisplayValue = "";
        _this.childNodes[0].innerText = "folder_open";
    }
    else {
        _this.dataset.state = "closed";
        _fileDisplayValue = "none";
        _this.childNodes[0].innerText = "folder";
    }
    var _array = document.getElementsByClassName("fileWidget");
    if (typeof _array == "object") {
        Array.from(_array).forEach(function (e) {
            if (e.dataset.dirname == _dirname) {
                e.style.display = _fileDisplayValue;
            }
        });
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
        console.log(xx);
        xx = "";
    }
    else {
        xx = xx + x;
    }
}

function _onclickFilename() {
    document.getElementById("filename").onclick = null;
    var input = document.createElement("input");
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

function _toolbarButtonClicked() {


    if (this.dataset.action == "addFile") {
        _new();
    }
    else if (this.dataset.action == "runFile") {

        if (selectedFileWidget.endsWith(".js")) {
            console.log("local:default user$ nodejs " + selectedFileWidget + "\n\n");
            try {
                var _run = function () {
                    eval(editor.getValue());
                }
                _run();
            }
            catch (e) {
                console.error(e);
            }
            console.log(" ");
        }
        else if (selectedFileWidget.endsWith(".py")) {
            try {
                console.log("local:default user$ python " + selectedFileWidget)
                Sk.pre = "output";
                Sk.configure({
                    output: consolelog, read: builtinRead
                });
                var myPromise = Sk.misceval.asyncToPromise(function () {
                    return Sk.importMainWithBody("<stdin>", false, editor.getValue(), true);
                });
                console.log("\n local:default user$");
            }
            catch (e) {
                console.error(e);
            }
        }

    }
    else if (this.dataset.action == "addDirectory") {

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
        document.getElementById("pageAll").style.bottom = (pageBottomHeight+10)+"px";
    }
}

function _toggleSideBar() {

    if (document.getElementById("pageLeftToolbar").style.display != "none") {
        document.getElementById("pageLeft").style.display = "none";
        document.getElementById("pageLeftToolbar").style.display = "none";
        document.getElementById("pageMiddle").style.left = "0px";
        document.getElementById("filename").style.marginLeft = (leftToolbarWidth + 21) + "px";
        document.getElementById("runHeaderButton").style.left = (leftToolbarWidth + 2) + "px";
        document.getElementById("sideBarButton").getElementsByTagName("i")[0].innerText = "keyboard_arrow_right";
    }
    else {
        document.getElementById("pageLeft").style.display = "";
        document.getElementById("pageLeftToolbar").style.display = "";
        document.getElementById("pageMiddle").style.left = (leftToolbarWidth + leftPageWidth + 2) + "px";
        document.getElementById("filename").style.marginLeft = (leftToolbarWidth + leftPageWidth + 22) + "px";
        document.getElementById("runHeaderButton").style.left = (leftToolbarWidth + leftPageWidth + 2) + "px";
        document.getElementById("sideBarButton").getElementsByTagName("i")[0].innerText = "keyboard_arrow_down";
    }

}

function _open() {

    _refresh();

    if (document.getElementById("pageLeft").style.display != "none") {
        document.getElementById("pageLeft").style.display = "none";
        document.getElementById("pageMiddle").style.left = (leftToolbarWidth + 1) + "px";
        document.getElementById("filename").style.marginLeft = (leftToolbarWidth + 21) + "px";
        document.getElementById("runHeaderButton").style.left = (leftToolbarWidth + 2) + "px";


    }
    else {
        document.getElementById("pageLeft").style.display = "";
        document.getElementById("pageMiddle").style.left = (leftToolbarWidth + leftPageWidth + 2) + "px";
        document.getElementById("filename").style.marginLeft = (leftToolbarWidth + leftPageWidth + 22) + "px";
        document.getElementById("runHeaderButton").style.left = (leftToolbarWidth + leftPageWidth + 2) + "px";
    }

}

function _refresh() {
    var values = [],
        keys = Object.keys(localStorage),
        i = keys.length;
    var pageLeft = "<div class='dirWidget' data-name='default'><i class='material-icons'>folder_open</i>default</div>";
    keys.sort();
    keys.reverse();
    while (i--) {

        if (keys[i].startsWith("file-") && keys[i] != "file-") {

            var nextname = "";

            if (i > 0) nextname = "data-nextname='" + keys[i - 1].substring(5) + "'";

            if (selectedFileWidget == keys[i].substring(5)) {
                pageLeft = pageLeft + "<div class='fileWidget fileWidgetSelected' data-name='" + keys[i].substring(5) + "' " + nextname + " data-dirname='default'><div class='fileIndent'></div><i class='material-icons'>format_align_justify</i>" + keys[i].substring(5) + "</div>";
            }
            else {
                pageLeft = pageLeft + "<div class='fileWidget' data-name='" + keys[i].substring(5) + "' " + nextname + " data-dirname='default'><div class='fileIndent'></div><i class='material-icons'>format_align_justify</i>" + keys[i].substring(5) + "</div>";
            }
        }
    }

    document.getElementById("pageLeftBody").innerHTML = pageLeft;

    Array.from(document.getElementsByClassName("dirWidget")).forEach(function (e) {
        e.onclick = _openDir;
    });

    Array.from(document.getElementsByClassName("fileWidget")).forEach(function (e) {
        e.onclick = _openFile;
    });
}



document.addEventListener("DOMContentLoaded", function () {

    //resize page

    document.getElementById("pageLeftToolbar").style.fontSize = leftToolbarFontSize + "px";
    document.getElementById("pageLeftToolbar").style.width = leftToolbarWidth + "px";

    _open();

    document.getElementById("openButton").onclick = _open;
    document.getElementById("terminalButton").onclick = _toggleTerminal;
    document.getElementById("sideBarButton").onclick = _toggleSideBar;
    document.getElementById("filename").onclick = _onclickFilename;
    document.getElementById("runHeaderButton").onclick = _toolbarButtonClicked;

    Array.from(document.getElementsByClassName("toolbarButton")).forEach(function (e) { e.onclick = _toolbarButtonClicked; });


    var theme = "material-darker2";
    editor = CodeMirror.fromTextArea(document.getElementById("dartcode"), {
        lineNumbers: true,
        theme: theme,
        matchBrackets: true,
        extraKeys: { "Ctrl-Q": function (cm) { cm.foldCode(cm.getCursor()); } },
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
        document.getElementById("filename").innerText = "new-file-" + (Math.round(Date.now() / 1000) - 1592000000) + ".js";
    }


    editor.on("change", _save);


    (function () {
        var old = console.log;
        var olde = console.error;
        var logger = document.getElementById('log');
        var pageBottom = document.getElementById('pageBottom');
        console.log = function (message) {
            if (typeof message == 'object') {
                logger.innerHTML += "<div>" + (JSON && JSON.stringify ? JSON.stringify(message) : message) + '</div>';
                pageBottom.scrollTo(0, pageBottom.scrollHeight);
            } else {
                logger.innerHTML += "<div>" + message + '</div>';
                pageBottom.scrollTo(0, pageBottom.scrollHeight);
            }
        }
        console.error = function (message) {
            logger.innerHTML += "<div style=\"color:red\">" + message + '</div>';
            pageBottom.scrollTo(0, pageBottom.scrollHeight);
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
        const dx = m_posx - e.x;
        m_posx = e.x;
        leftPageWidth = (parseInt(getComputedStyle(panel, '').width) - dx) ;
        panel.style.width = leftPageWidth + "px";
        panelMiddle.style.left = (leftToolbarWidth + leftPageWidth + 2)  + "px";
    }

    function resizey(e) {
        const dy = m_posy - e.y;
        m_posy = e.y;
        pageBottomHeight = (parseInt(getComputedStyle(pageBottom, '').height) + dy) ;
        pageBottom.style.height = pageBottomHeight + "px";
        pageAll.style.bottom = (pageBottomHeight+10)  + "px";

    }

    panel.addEventListener("mousedown", function (e) {

        if (e.offsetX >(panel.clientWidth - BORDER_SIZE)) {
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

