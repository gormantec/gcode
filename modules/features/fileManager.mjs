/* Feature Name: File Manager */


import { htmlToElement, uuidv4 } from '/modules/htmlUtils.mjs';
import * as githubtree from '/modules/githubtree.mjs';
import { save, load, remove, listNames } from '/modules/gcodeStorage.mjs';


var dirIconOpened = "keyboard_arrow_down";
var dirIconClosed = "keyboard_arrow_right";



var selectedFileWidget = null;

export const menuMetadata = { "id": "openButton", "class": "pageLeftToolbarButton", "materialIcon": "file_copy" };

export const toolbarMetadata = [
    { "dataAction": "saveFile", "materialIcon": "save" },
    { "dataAction": "addFile", "materialIcon": "post_add" },
    { "dataAction": "uploadFile", "materialIcon": "upload_file" },
    { "dataAction": "addGitRepo", "imageIcon": "/images/git.png" },
    { "dataAction": "addDirectory", "materialIcon": "create_new_folder" },
    { "dataAction": "deleteFile", "materialIcon": "delete_forever" },
];

export const dialogMetadata = [
    {
        "id": "newFileDialog",
        "content": [
            { "id": "newFileDialogName", "type": "input/text", "label": "Filename:" },
            {
                "id": "newFileDialogSelect", "type": "select", "label": "App Type:", "options": [
                    { "value": ".js", "text": "Commandline - JavaScript", "selected": true },
                    { "value": ".py", "text": "Commandline - Python", "selected": false },
                    { "value": ".mjs", "text": "Mobile App - JavaScript", "selected": false },
                    { "value": ".lib.mjs", "text": "Library - JavaScript", "selected": false },
                    { "value": ".ts", "text": "Mobile App - AssemblyScript", "selected": false },
                    { "value": ".dapp.ts", "text": "dApp - AssemblyScript", "selected": false },
                    { "value": ".lib.ts", "text": "Library - AssemblyScript", "selected": false },
                    { "value": ".svg", "text": "App Icon", "selected": false },
                ]
            },
        ],
        "ok": { "value": ".js" }
    },
    {
        "id": "uploadFileDialog",
        "content": [
            { "id": "uploadFileDialogName", "type": "input/file", "label": "Filename:", "accept": "image/png, image/jpeg" },
            { "id": "uploadFileDialogData", "type": "input/hidden" },
        ],
        "ok": { "value": null }
    }
];

export function menuAction(p) {

    return _open(p);
}

export function dialogAction(event) {
    console.log(event.id);
    if (event.type == "dialog" && event.id == "newFileDialog" && event.value != "cancel") {
        _new(event.value).then(() => { });
    }
    else if (event.type == "dialog" && event.id == "uploadFileDialog" && event.value != "cancel") {
        let jsonString = event.getInputValue("uploadFileDialogData");
        if (jsonString && jsonString.trim() != "") {
            var json = JSON.parse(jsonString);
            (async () => {
                for (var i = 0; i < json.files.length; i++) {
                    await _new(json.files[i].name + ".svg", json.files[i].svgdata);
                }
            })()
        }
    }
    else if (event.id == "uploadFileDialogName") {

        console.log(event);

        var handleFiles = function (files) {
            console.log("change handleFiles");
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                console.log(file);
                if (!file.type.startsWith('image/png')) { continue }
                const reader = new FileReader();
                reader.onload = (e) => {
                    var i = new Image(); 
                    i.onload = function(){
                        console.log(e.target.result);
                        let current = event.getInputValue("uploadFileDialogData");
                        if (!current || current.tim() == "") current = "{\"files\":[]}";
                        let currentJson = JSON.parse(current);
                        currentJson.files.push({ name: file.name, lastModified: file.lastModified, size: file.lastModified, type: file.type, svgdata:"<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"><image width=\""+i.width+"\" height=\""+i.height+"\" xlink:href=\""+e.target.result+"\" /></svg>", base64: e.target.result });
                        event.setInputValue("uploadFileDialogData", JSON.stringify(currentJson));
                    };
                    i.src = e.target.result; 
                };
                reader.readAsDataURL(file);
            }
        };
        handleFiles(event.files);

    }
    else if (event.type == "select" && event.id == "newFileDialogSelect") {
        var name = "";
        var nameValue = event.getInputValue("newFileDialogName");
        if (nameValue.indexOf(".dapp.ts") > 0) {
            name = nameValue.substring(0, nameValue.lastIndexOf(".dapp.ts"));
        }
        else if (nameValue.indexOf(".lib.ts") > 0) {
            name = nameValue.substring(0, nameValue.lastIndexOf(".lib.ts"));
        }
        else if (nameValue.indexOf(".") > 0) {
            name = nameValue.substring(0, nameValue.lastIndexOf("."));
        }
        else {
            name = nameValue;
        }
        name = (name + event.value);
        event.setInputValue("newFileDialogName", name);
        event.setInputValue("confirmButton", name);
    }
}

export function refresh() {
    _refresh();
}

export function afterLoad() {

    var guid = uuidv4();
    var doSomething = function () {
        githubtree.waitForOctokit(() => {
            githubtree.getAuthenticated();
        });
    };

    if (githubtree.getToken()) {
        doSomething();
    }
    else {
        /*
        githubtree.getCode(guid, (e, code) => {
            if (!e) {
                fetch("https://5q7l0c3xq9.execute-api.ap-southeast-2.amazonaws.com?code=" + code + "&state=" + guid).then(
                    response => response.json()
                ).then((json) => {
                    githubtree.setToken(json.data.access_token);
                    doSomething();
                });
            }
        });
        */
    }

    _open({ visible: true });

    selectedFileWidget = document.getElementById("filename").innerText;
    window.editor.on("change", function () {
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
                        localStorage.setItem("gitfile-" + filename, window.btoa(window.unescape(encodeURIComponent(editor.getValue()))));
                    }
                    else {
                        localStorage.removeItem("gitfile-" + filename);
                        fileWidget.style.fontStyle = "";
                        fileWidget.style.color = "";
                    }
                });
            }
            else {
                localStorage.setItem("gitfile-" + filename, window.btoa(window.unescape(encodeURIComponent(editor.getValue()))));

            }

        }
    });

    if (githubtree.getToken()) {
        githubtree.waitForOctokit(() => {
            githubtree.getAuthenticated().then((resp) => {
                window.myLogin = resp.data.login;
                document.querySelector("#userIcon").style.backgroundImage = "url('" + resp.data.avatar_url + "')";
                document.querySelector("#userLoginMaterialIcon").style.display = "none";
                githubtree.cacheRepo({ username: window.myLogin, repo: "wasmdom" }, function (state, repo) { console.log("state=" + state); });
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

}

export function toolbarAction(e) {

    var button = e.currentTarget;
    if (button.dataset.action == "addFile") {
        const randName = "gcode-" + (Math.round(Date.now() / 1000) * 10000 + Math.round(Math.random() * 9999)).toString(16);
        document.getElementById("newFileDialogName").value = randName + document.getElementById("newFileDialogSelect").value;
        document.getElementById('confirmButton').value = document.getElementById("newFileDialogName").value;
        document.getElementById("newFileDialog").showModal();

    } else if (button.dataset.action == "uploadFile") {
        document.getElementById('confirmButton').value = null;
        document.getElementById("uploadFileDialog").showModal();
    } else if (button.dataset.action == "saveFile") {
        _save();
    }
    else if (button.dataset.action == "addGitRepo") {
        var guid = uuidv4();

        var doSomething = function () {

            console.log("getAuthenticated")
            githubtree.getAuthenticated().then((resp) => {
                console.log("gotAuthenticated:");
                console.log(resp)
                window.myLogin = resp.data.login;
                console.log("myLogin:" + window.myLogin);
                console.log(resp.data);
                if (resp.data.login) {

                    console.log("prompt:" + resp.data.login);
                    var gitRepoName = prompt("Git repo name to add", resp.data.login + "/gcode_repo");
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
                else {
                    console.log("no login?");
                }
            }).catch((e) => {
                githubtree.setToken(null);
                console.log(e);
            });
            console.log("did something!");
        };

        if (githubtree.getToken()) {
            console.log("doSomething");
            doSomething();
        }
        else {
            console.log("getCode");
            githubtree.getCode(guid, (e, code) => {
                console.log("gotCode");
                if (!e) {

                    console.log("fetch:" + code);
                    fetch("https://5q7l0c3xq9.execute-api.ap-southeast-2.amazonaws.com?code=" + code + "&state=" + guid).then(
                        response => response.json()
                    ).then((json) => {
                        console.log("json");
                        console.log(json);
                        githubtree.setToken(json.data.access_token);
                        console.log("doSomething2:" + json.data.access_token);
                        doSomething();
                        console.log("doSomething?");
                    });
                }
                else {
                    console.log("error:" + e);
                }
            });
        }

    }
    else if (button.dataset.action == "deleteFile") {
        _delete();
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
        document.getElementById("filename").style.marginLeft = (window.leftToolbarWidth + 22) + "px";
        document.getElementById("runHeaderButton").style.left = (window.leftToolbarWidth + 2) + "px";

    }
    else {
        if (!(params && params.visible) && document.getElementById("pageLeft").style.display != "none") {

            document.getElementById("pageLeft").style.right = "unset";
            document.getElementById("pageLeft").style.width = window.leftPageWidth + "px";
            document.getElementById("pageLeft").style.display = "none";
            document.getElementById("pageMiddle").style.display = "";
            if (window.editor) window.editor.refresh();
            document.getElementById("pageMiddle").style.left = (window.leftToolbarWidth + 1) + "px";
            document.getElementById("filename").style.marginLeft = (window.leftToolbarWidth + 21) + "px";
            document.getElementById("runHeaderButton").style.left = (window.leftToolbarWidth + 2) + "px";


        }
        else {

            document.getElementById("pageLeft").style.right = "unset";
            document.getElementById("pageLeft").style.width = window.leftPageWidth + "px";
            document.getElementById("pageLeft").style.display = "";
            document.getElementById("pageMiddle").style.display = "";
            if (window.editor) window.editor.refresh();
            document.getElementById("pageMiddle").style.left = (window.leftToolbarWidth + window.leftPageWidth + 2) + "px";
            document.getElementById("filename").style.marginLeft = (window.leftToolbarWidth + window.leftPageWidth + 22) + "px";
            document.getElementById("runHeaderButton").style.left = (window.leftToolbarWidth + window.leftPageWidth + 2) + "px";
        }
    }


}

function _refresh(params) {
    var values = [];
    var defaultParent = htmlToElement("<div id=\"defaultParent\"></div>");
    var pageLeft = htmlToElement("<div class='dirWidget' data-name='default'><i class='material-icons'>" + dirIconOpened + "</i>default</div>");
    pageLeft.addEventListener("click", function () { _openDir(this); });
    defaultParent.appendChild(pageLeft);
    var filenames = listNames();
    var i = filenames.length;
    while (i--) {
        var nextname = "";
        var selectedClass = "";
        if (i > 0) nextname = "data-nextname='" + filenames[i - 1] + "'";
        if (selectedFileWidget == filenames[i]) selectedClass = " fileWidgetSelected";
        var _child = htmlToElement("<div class='fileWidget" + selectedClass + "' data-name='" + filenames[i] + "' " + nextname + " data-dirname='default'><div class='fileIndent'></div><i class='material-icons'>format_align_justify</i>" + filenames[i] + "</div>");
        defaultParent.appendChild(_child);
        _child.addEventListener("click", function () { _openFile(this); });
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

async function _new(aFilename, data) {

    let _data = data;

    return new Promise((resolve, reject) => {
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
            else if (aFilename.endsWith(".svg")) sampleName = "modules/sample.svg";
            else sampleName = "modules/sample.txt";

            fetch(sampleName)
                .then(
                    response => response.text()
                ).then(
                    text => {

                        if (_data != null) {
                            console.log("!!!!!!");
                            document.getElementById("filename").innerText = aFilename;
                            selectedFileWidget = aFilename;
                            window.editor.setValue(data);
                            window.setEditorMode();
                        }
                        else {
                            var _samplecode = text;
                            
                            var randName = "gcode-" + (Math.round(Date.now() / 1000) * 10000 + Math.round(Math.random() * 9999)).toString(16);
                            if (aFilename.startsWith("gcode-") && aFilename.endsWith(".dapp.ts")) randName = aFilename.substring(0, aFilename.indexOf(".dapp.ts"))
                            _samplecode = _samplecode.replace(/"gcode-[0-9a-gA-G]*?\.testnet"/g, "\"" + randName + ".testnet\"");

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

                            if(aFilename.endsWith(".svg"))
                            {
                                window.editor.setValue(pyChar + "<!--\n/*\n" + pyChar + "\n" + pyChar + "  " +
                                "filename:" + aFilename + "\n" + pyChar + "  " +
                                "created: " + (new Date(Date.now())).getFullYear() + "-" + (new Date(Date.now())).getMonth() + "-" + (new Date(Date.now())).getDay() + "T" + (new Date()).toLocaleTimeString() + "\n" + pyChar + "  " +
                                appStuff +
                                "\n" + pyChar + "\n" + pyChar + "*/\n-->\n\n" + _samplecode);
                                window.setEditorMode();
                            }
                            else{
                                window.editor.setValue(_samplecode);
                                window.setEditorMode();
                            }

                        }

                        window.setEditorMode();
                        var toDiv = document.getElementById("pageLeftBody");
                        if (selectedFileWidget.substring(0, 6) == "git://") githubtree.saveFile(selectedFileWidget, window.editor.getValue(),
                            function () {
                                var gitParts = githubtree.getGitParts(selectedFileWidget);
                                githubtree.refreshGitTree(gitParts.username, gitParts.repo, toDiv, selectedFileWidget, _openDir, _openFile);
                                resolve();

                            }
                        );
                        else {
                            _save();
                            _refresh();
                            resolve();
                        }
                    }
                );
        }
    });


}
let stillOpeningFile=false;
function _openFile(element) {

    if(stillOpeningFile)return;

    if (element.dataset.name) {
        if (element.dataset.name.substring(0, 6) != "git://") {
            selectedFileWidget = element.dataset.name;
            document.getElementById("filename").innerText = element.dataset.name;
            localStorage.setItem("lastFileName", selectedFileWidget);
            var pageLeftBody = document.getElementById("pageLeftBody");
            var selectedItem = pageLeftBody.querySelector("div.fileWidgetSelected");
            if (selectedItem) selectedItem.className = "fileWidget";
            selectedItem = pageLeftBody.querySelector("div.dirWidgetSelected");
            if (selectedItem) selectedItem.className = "dirWidget";
            element.className = "fileWidget fileWidgetSelected";
            var fileData = load(element.dataset.name, true);
            window.editor.setValue(fileData);
            window.setEditorMode();
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
            localStorage.setItem("lastFileName", selectedFileWidget);
            var pageLeftBody = document.getElementById("pageLeftBody");
            var selectedItem = pageLeftBody.querySelector("div.fileWidgetSelected");
            if (selectedItem) selectedItem.className = "fileWidget";
            selectedItem = pageLeftBody.querySelector("div.dirWidgetSelected");
            if (selectedItem) selectedItem.className = "dirWidget";
            element.className = "fileWidget fileWidgetSelected";
            stillOpeningFile=true;
            githubtree.getGitFile(username, repo, path, function (e, d) {
                var cached = localStorage.getItem("gitfile-" + filename);
                if (cached) {
                    if (decodeURIComponent(escape(window.atob(cached))) != d) {
                        d = decodeURIComponent(escape(window.atob(cached)));
                        element.style.fontStyle = "italic";
                        element.style.color = "#cce6ff";
                    }
                    else {

                        localStorage.removeItem("gitfile-" + filename);
                        element.style.fontStyle = "";
                        element.style.color = "";
                    }
                }
                window.editor.setValue(d);
                window.setEditorMode();
                stillOpeningFile=false;
            });
        }
    }
    else {
        debug.log(element);
        debug.log(element.classList);
        debug.log(element.dataset);
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







function _save() {
    var filename = document.getElementById("filename").innerText;
    if (filename && filename.substring(0, 6) == "git://") {
        githubtree.saveFile(filename, window.editor.getValue(), function (e, d) {
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
        if (filename == "" || filename == null) return;
        save(filename, window.editor.getValue());
        console.log("********* Saved:"+filename);
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
        remove(filename);
        localStorage.setItem("lastFileName", "");
        document.getElementById("filename").innerText = "";
        window.editor.setValue("");
        window.setEditorMode();
        selectedFileWidget = null;
        Array.from(document.getElementsByClassName("fileWidget")).forEach(function (e) {
            if (e.dataset.name == filename && e.dataset.nextname != null) selectedFileWidget = e.dataset.nextname;
        });
        _refresh();
    }

}

