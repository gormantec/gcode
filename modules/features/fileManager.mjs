/* Feature Name: File Manager */


import { htmlToElement,uuidv4 } from '/modules/htmlUtils.mjs';


var dirIconOpened = "keyboard_arrow_down";
var dirIconClosed = "keyboard_arrow_right";
var xx = "";
var win;

var selectedFileWidget = null;

export const menuMetadata = { "id": "openButton", "class": "pageLeftToolbarButton", "materialIcon": "file_copy" };

export const toolbarMetadata = [
        { "dataAction": "saveFile", "materialIcon": "save" },
        { "dataAction": "addFile", "materialIcon": "post_add" },
        { "dataAction": "addGitRepo", "imageIcon": "/images/git.png" },
        { "dataAction": "addDirectory", "materialIcon": "create_new_folder" },
        { "dataAction": "deleteFile", "materialIcon": "delete_forever" },
    ];

export const dialogMetadata = [
    {
        "id": "newFileDialog", 
        "content": [
            { "id": "newFileDialogName", "type": "input/text", "label": "Filename:" },
            { "id": "newFileDialogSelect", "type": "select", "label": "App Type:", "options":[
                {"value":".js","text":"Commandline - JavaScript","selected":true},
                {"value":".py","text":"Commandline - Python","selected":false},
                {"value":".mjs","text":"Mobile App - JavaScript","selected":false},
                {"value":".ts","text":"Mobile App - AssemblyScript","selected":false},
                {"value":".dapp.ts","text":"dApp - AssemblyScript","selected":false},
            ]},
        ], 
        "ok": {"id":"newFileDialogConfirmButton","value": ".js"}
    }
];

export function menuAction(p) {
    return _open(p);
}

export function toolbarAction(p) {
    return _toolbarAction(p);
}

export function refresh() {
    _refresh();
}

export function afterLoad()
{

    _open({ visible: true });

    selectedFileWidget = document.getElementById("filename").innerText;


    var newFileDialog = document.getElementById("newFileDialog");
    var newFileDialogName = document.getElementById("newFileDialogName");                    
    document.getElementById("newFileDialogSelect").addEventListener('change', function onSelect(e) {
        var name = "";
        if (newFileDialogName.value.indexOf(".dapp.ts") > 0) {
            name = newFileDialogName.value.substring(0, newFileDialogName.value.lastIndexOf(".dapp.ts"));
        }
        else if (newFileDialogName.value.indexOf(".") > 0) {
            name = newFileDialogName.value.substring(0, newFileDialogName.value.lastIndexOf("."));
        }
        else {
            name = newFileDialogName.value;
        }

        newFileDialogName.value = (name + document.getElementById("newFileDialogSelect").value);
        document.getElementById('newFileDialogConfirmButton').value = newFileDialogName.value;
    });
    newFileDialog.addEventListener('close', function onClose() {
        if (newFileDialog.returnValue != "cancel") {
            _new(newFileDialog.returnValue);
        }

    });

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

function _new(aFilename) {


    if (selectedFileWidget && selectedFileWidget.substring(0, 6) == "git://") {
        aFilename = selectedFileWidget.substring(0, selectedFileWidget.lastIndexOf("/")) + "/" + aFilename;
    }
    if (aFilename != null) {
        var sampleName = "";
        if (aFilename.endsWith(".mjs")) sampleName = "modules/sample.mjs";
        else if (aFilename.endsWith(".dapp.ts")) sampleName = "modules/sample.dapp.ts";
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

                    var appStuff = "";
                    if (aFilename.endsWith(".mjs") || aFilename.endsWith(".ts")) appStuff = "appName: gcode" + "\n  " +
                        "splash: https://gcode.com.au/images/ios/ios-appicon-180-180.png" + "\n  " +
                        "icon: https://gcode.com.au/images/ios/ios-appicon-180-180op.png" + "\n  " +
                        "icon180x180: https://gcode.com.au/images/ios/ios-appicon-180-180op.png" + "\n  " +
                        "mockFrame: iphoneX" + "\n  " +
                        "splashBackgroundColor: #005040" + "\n  " +
                        "splashDuration: 2000";
                    var pyChar = "";
                    if (aFilename.endsWith(".py")) pyChar = "#";

                    document.getElementById("filename").innerText = aFilename;
                    selectedFileWidget = aFilename;
                    editor.setValue(pyChar + "/*\n" + pyChar + "\n" + pyChar + "  " +
                        "filename:" + aFilename + "\n" + pyChar + "  " +
                        "created: " + (new Date(Date.now())).getFullYear() + "-" + (new Date(Date.now())).getMonth() + "-" + (new Date(Date.now())).getDay() + "T" + (new Date()).toLocaleTimeString() + "\n" + pyChar + "  " +
                        appStuff +
                        "\n" + pyChar + "\n" + pyChar + "*/\n\n" + _samplecode);
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
        editor.setOption("mode", "text/typescript");
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

function _toolbarAction() {


    if (this.dataset.action == "addFile") {
        document.getElementById("newFileDialogName").value = "sample-" + (Math.round(Date.now() / 1000) - 1592000000) + document.getElementById("newFileDialogSelect").value;
        document.getElementById('newFileDialogConfirmButton').value = document.getElementById("newFileDialogName").value;
        document.getElementById("newFileDialog").showModal();

    } else if (this.dataset.action == "saveFile") {
        _save();
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

