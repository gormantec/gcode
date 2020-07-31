var repos = [];
export function addRepoFile(repo, dirpath, fileinfo) {
    repos[repo] = repos[repo] || [];
    repos[repo][dirpath] = repos[repo][dirpath] || { files: [] };
    repos[repo][dirpath].files.push(fileinfo);
}

function getToken(repousername, reponame) {
    var token = localStorage.getItem("git-token://" + repousername + ":" + reponame);
    if (!token) {
        var token = prompt("Token for " + repousername + "/" + reponame);
        localStorage.setItem("git-token://" + repousername + ":" + reponame, token);
    }
    return token;
}

export function addGitRepository(repousername, reponame, toDiv) {



    toDiv.appendChild(htmlToElement("<div class='dirWidget' data-name='git://" + repousername + ":" + reponame + "'><i class='material-icons'>keyboard_arrow_down</i>" + reponame + "</div>"));
    repos[reponame]
    if (repos[reponame]) {
        var keys = Object.keys(repos[reponame]);
        var i = keys.length;
        keys.sort();

        keys.reverse();
        while (i--) {
            var files = repos[reponame][keys[i]].files;
            var state = repos[reponame][keys[i]].state;
            var display = "";
            var xxx = "";
            if (state == "closed") { display = " style='display:none' "; xxx = "*"; console.log(keys[i] + ": none"); }
            var j = files.length;
            files.sort(function (a, b) {
                if (a.type == "dir" && b.type == "file") return -1;
                else if (a.type == "file" && b.type == "dir") return 1;
                else return a.name.localeCompare(b.name);
            });
            files.reverse();
            while (j--) {
                var nextname = "";
                if (j > 0) nextname = "data-nextname='git://" + repousername + ":" + reponame + "/" + files[j - 1].filepath + "'";
                var widgetClass = "fileWidget";
                var fileIcon = "format_align_justify";
                var datastate = "";
                var fileWidgetSelected = "";
                if (files[j].type == "dir") {
                    widgetClass = "dirWidget";
                    fileIcon = "keyboard_arrow_down";
                    if (repos[reponame][files[j].filepath] && repos[reponame][files[j].filepath].state == "closed") fileIcon = "keyboard_arrow_right";
                }
                if (selectedFileWidget == "git://" + repousername + ":" + reponame + "/" + files[j].filepath) fileWidgetSelected = " fileWidgetSelected";
                var indentWidth = 10;
                indentWidth = 10 * (files[j].filepath.match(/\//g) || []).length;
                indentWidth = indentWidth + 10;
                var gitpath = "git://" + repousername + ":" + reponame + "/" + files[j].dirpath;
                if (gitpath.slice(-1) == "/") gitpath = gitpath.slice(0, -1);
                toDiv.querySelector("div.dirWidget[data-name='" + gitpath + "']").parentElement.appendChild(htmlToElement(
                    "<div><div class='" + widgetClass + fileWidgetSelected + "' data-name='git://" + repousername + ":" + reponame + "/" +
                    files[j].filepath + "' " + nextname + " data-dirname='" + reponame + "' " + datastate + display + ">" +
                    "<div class='fileIndent' style='width:" + indentWidth + "px'></div><i class='material-icons'>" + fileIcon + "</i>" +
                    files[j].name + xxx + "</div></div>"
                ));
            }
        }
    }


}

export function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}

export function getGitFile(username, repo, path, callback) {
    var gh = new GitHub({ token: getToken(username, repo) });
    let gitrepo = gh.getRepo(username, repo);
    gitrepo.getContents("master", path, true, callback);
}

export function pullGitRepository(username, repo, callbackrefresh) {

    var gh = new GitHub({ token: getToken(username, repo) });
    let gitrepo = gh.getRepo(username, repo);

    var loopDirectories = function (directories, depth, callback) {

        if (!directories || directories.length == 0 || depth>2) {
            callback();
        }
        else {
            var dir = directories.shift();
            depth++;
            recurseGit(dir, depth, function () {
                depth--;
                if (directories.length > 0) {
                    loopDirectories(directories, depth, callback);
                }
                else {
                    callback();
                }
            });
        }
    };

    var recurseGit = function (path, depth, callback) {
        var _path = path;
        if (_path.slice(-1) == "/") _path = _path.slice(0, -1);
        gitrepo.getSha("master", path).then(function (sha) {
            var directories = [];
            Array.from(sha.data).forEach(function (file) {
                if (file.name.substring(0, 1) != "." && directories.length < 4) {

                    addRepoFile(repo, _path, { name: file.name, filepath: file.path, dirpath: _path, type: file.type });
                    if (callbackrefresh) callbackrefresh("running", repo, _path);

                    if (file.type == "dir" && file.name.substring(0, 1) != ".") {
                        if (file.path) {
                            directories.push(file.path);
                        }
                    }
                }
            });
            if (directories.length > 0) loopDirectories(directories, depth, callback);
            else callback();
        });
    }

    recurseGit("", 0, function () { console.log("done"); if (callbackrefresh) callbackrefresh("done", repo, ""); });
}




export function setDirectoryState(path, state) {
    var firstColon = path.indexOf(":", 6);
    var secondColon = path.indexOf("/", firstColon + 1);
    if (secondColon < 0) secondColon = 10000;
    var username = path.substring(6, firstColon);
    var repo = path.substring(firstColon + 1, secondColon);
    var dirpath = path.substring(secondColon + 1);
    var parentpath = dirpath.substring(0, dirpath.lastIndexOf("/"));
    if (!repo || !dirpath || repos[repo][dirpath]) return;
    repos[repo][dirpath].state = state;
}



