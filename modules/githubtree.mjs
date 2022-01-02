var Octokit;

setTimeout(() => {
    import('https://cdn.skypack.dev/@octokit/rest@^17.11.0').then((module) => {
        Octokit = module.Octokit;
    });
}, 1000);

var repos = [];
export function addRepoFile(repo, dirpath, fileinfo) {
    repos[repo] = repos[repo] || [];
    repos[repo][dirpath] = repos[repo][dirpath] || { files: [] };
    repos[repo][dirpath].files = repos[repo][dirpath].files.filter(function( obj ) { return obj.filepath !== fileinfo.filepath; });
    repos[repo][dirpath].files.push(fileinfo);
}

export function setDirectoryState(path, state) {
    var parts=getGitParts(path);

    var username = parts.username;
    var repo = parts.repo;
    var dirpath = parts.path;
    var parentpath = dirpath.substring(0, dirpath.lastIndexOf("/"));
    if (repo && dirpath ) {
        repos[repo][dirpath]=repos[repo][dirpath] || {files:[]};
        repos[repo][dirpath].state = state;
    }

}

export function setDirectoryLastRefresh(path,lastRefresh){
    var parts=getGitParts(path);
    if (parts.repo && parts.path && repos[parts.repo][parts.path]) {
        repos[parts.repo][parts.path].lastRefresh = lastRefresh;
    }
}

export function getDirectoryLastRefresh(path){
    var parts=getGitParts(path);
    if (parts.repo && parts.path && repos[parts.repo][parts.path]) {
        return repos[parts.repo][parts.path].lastRefresh
    }
    return null;
}

export function getGitParts(filename,result) {
    var _result=result||{};
    if (filename && filename.substring(0, 6) == "git://") {
        var firstColon = filename.indexOf(":", 6);
        var secondColon = filename.indexOf("/", firstColon + 1);
        if(secondColon<0){secondColon=filename.length;filename=filename+"/"};
        _result.username = filename.substring(6, firstColon);
        _result.repo = filename.substring(firstColon + 1, secondColon);
        _result.path = filename.substring(secondColon + 1);
        return _result;
    }
    else{
        return null;
    }
}

export function getGitPath(username,repo,path) {

    return "git://"+username+":"+repo+"/"+path;
}

var _GitHub;

function getGitHub(params) {
    if (_GitHub) return _GitHub;
    else return new Octokit(params);
}

export function waitForOctokit(callback) {
    if (Octokit) callback();
    var i = window.setInterval(() => {
        if (Octokit) {
            clearInterval(i);
            callback();
        }
    }, 500)
}

export async function saveFile(name, content, encode, callback) {

    if(!callback)
    {
        callback=encode;
        encode=true;
    }

    var firstColon = name.indexOf(":", 6);
    var secondColon = name.indexOf("/", firstColon + 1);
    if (secondColon < 0) secondColon = 10000;
    var username = name.substring(6, firstColon);
    var repo = name.substring(firstColon + 1, secondColon);
    var fullpath = name.substring(secondColon + 1);
    var filename = fullpath.substring(fullpath.lastIndexOf("/") + 1);
    var dirpath = fullpath.substring(0, fullpath.lastIndexOf("/"));
    console.log("git:save::1");

    var sha = null;

    //if(repos[repo][dirpath])
    //{

    //console.log("git:save::2");
    //    var repoFileInfo = repos[repo][dirpath].files.find(obj => { return obj.name === filename });
    //    if (repoFileInfo && repoFileInfo != "undefined") sha = repoFileInfo.sha;
    //}
    //else{

        console.log("git:save::3");
        var result=await pullGitRepository({ username: username, repo: repo, path:dirpath });

    console.log("git:save::4");
        window.debug.log(result);

    console.log("git:save::5");
        if(repos[repo][dirpath])
        {

    console.log("git:save::6");
            var repoFileInfo = repos[repo][dirpath].files.find(obj => { return obj.name === filename });
            if (repoFileInfo && repoFileInfo != "undefined") sha = repoFileInfo.sha;
        }

    console.log("git:save::7");
    //}
    var f = {
        owner: username,
        repo: repo,
        path: fullpath,
        message: "commit",
        content: encode?btoa(content):content,
    };
    console.log("git:save::8");

    console.log("git:save::sha:"+sha);
    console.log("git:save::sha:"+f.sha);
    if (sha) f.sha = sha;
    console.log("git:save::9");
    console.log("git:save::sha:"+f.sha);

    var octokit = getGitHub({ auth: getToken() });
    octokit.repos.createOrUpdateFileContents(f).then((d) => {

        console.log("git:save::10");
        console.log("git:save::sha:"+sha);
        console.log("git:save::d-sha:"+d.data.content.sha);
        if (!sha) addRepoFile(repo, dirpath, { name: filename, filepath: fullpath, dirpath: dirpath, sha: d.data.content.sha, type: "file" });
        console.log("git:save::11");
        console.log(d);
        callback(null, d);
    }).catch((e) => { console.log(e); callback(e); });;
}
export function deleteFile(name, callback) {
    var firstColon = name.indexOf(":", 6);
    var secondColon = name.indexOf("/", firstColon + 1);
    if (secondColon < 0) secondColon = 10000;
    var username = name.substring(6, firstColon);
    var repo = name.substring(firstColon + 1, secondColon);
    var fullpath = name.substring(secondColon + 1);
    var filename = fullpath.substring(fullpath.lastIndexOf("/") + 1);
    var dirpath = fullpath.substring(0, fullpath.lastIndexOf("/"));
    var octokit = getGitHub({ auth: getToken() });
    var repoFileInfo = repos[repo][dirpath].files.find(obj => { return obj.name === filename });
    var sha = null;
    if (repoFileInfo && repoFileInfo != "undefined") sha = repoFileInfo.sha;
    var f = {
        owner: username,
        repo: repo,
        path: fullpath,
        message: "commit",
    };
    if (sha) f.sha = sha;

    octokit.repos.deleteFile(f).then((d) => {
        repos[repo][dirpath].files = repos[repo][dirpath].files.filter(function (obj) { return obj.name != filename; });
        callback(null, d);
    }).catch((e) => { window.debug.log(e); callback(e); });;
}

export function getToken() {
    var token = localStorage.getItem("git-token");
    return token;
}

export function getCode(guid, callback) {
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
        else if (count > 240) {
            clearInterval(loop);
            win.close();
            return callback({ error: "timeout" });
        }

    }, 500);
}

export function getAuthenticated() {
    var octokit = getGitHub({ auth: getToken() });
    return octokit.users.getAuthenticated();
}

export function setToken(token) {

    if (token) {
        localStorage.setItem("git-token", token);
    }
    else {
        localStorage.removeItem("git-token");
    }


    return token;
}

export function refreshGitTree(repousername, reponame, toDiv, selectedFileWidget,dirOnClick,fileOnClick) {

    var repoRoot = toDiv.querySelector("div.dirWidget[data-name='git://" + repousername + ":" + reponame + "']");
    var parentElement;
    if (repoRoot) {
        parentElement = repoRoot.parentElement;
        while (parentElement.firstChild) parentElement.removeChild(parentElement.lastChild);
    }
    else {
        parentElement = document.createElement('div');
        toDiv.appendChild(parentElement);
    }
    var _root=htmlToElement("<div class='dirWidget' data-name='git://" + repousername + ":" + reponame + "'><i class='material-icons'>keyboard_arrow_down</i>" + reponame + "</div>");
    _root.addEventListener("click", function () { dirOnClick(this); });
    parentElement.appendChild(_root);

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
            if (state == "closed") { display = " style='display:none' "; xxx = "*"; }
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
                var _child=htmlToElement(
                    "<div class='" + widgetClass + fileWidgetSelected + "' data-name='git://" + repousername + ":" + reponame + "/" +
                    files[j].filepath + "' " + nextname + " data-dirname='" + reponame + "' " + datastate + display + ">" +
                    "<div class='fileIndent' style='width:" + indentWidth + "px'></div><i class='material-icons'>" + fileIcon + "</i>" +
                    files[j].name + xxx + "</div>"
                );
                var tempName=_child.dataset.name;
                if(widgetClass ==  "dirWidget"){
                    var tempParentElement = document.createElement('div');
                    tempParentElement.appendChild(_child);
                    toDiv.querySelector("div.dirWidget[data-name='" + gitpath + "']").parentElement.appendChild(tempParentElement);
                    _child.addEventListener("click", function () { dirOnClick(this); });
                }
                else{
                    toDiv.querySelector("div.dirWidget[data-name='" + gitpath + "']").parentElement.appendChild(_child);
                    _child.addEventListener("click", function () { fileOnClick(this); });
                }
                
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
    var octokit = getGitHub({ auth: getToken() });
    var params={
        owner: username,
        repo: repo,
        path: path
    };
    octokit.repos.getContent(params).then((d) => callback(null, atob(d.data.content))).catch((e) => { window.debug.log(e); callback(e); });;
}

export function pullGitRepository(params, callbackrefresh) {

    var theFunction=function(_callback){
        var username=params.username;
        var repo=params.repo;
        var startpath=params.path || "";
        var maxdepth=params.depth || 1;
    
        waitForOctokit(function(){
            var octokit = getGitHub({ auth: getToken() });
            var recurseGit = function (path, depth, callback) {
                var _path = path;
                if (_path.slice(-1) == "/") _path = _path.slice(0, -1);
        
                octokit.repos.getContent({
                    owner: username,
                    repo: repo,
                    path: path
                }).then((sha) => {
                    var directories = [];
                    sha.data.forEach(function (file) {
                        if (file.name.substring(0, 1) != ".") {
                            console.log(file.name+": "+file.sha);
                            addRepoFile(repo, _path, { name: file.name, filepath: file.path, dirpath: _path, sha: file.sha, type: file.type });
                            if (_callback) _callback("running", repo, _path);
                            if (file.type == "dir" && file.name.substring(0, 1) != ".") {
                                if (file.path) {
                                    if(!repos[repo][file.path]){
                                        repos[repo][file.path]={ files: [], state:"closed"};
                                        setDirectoryState("git://"+username+":"+repo+"/"+file.path,"closed");
                                    }
                                    directories.push(file.path);
                                }
                            }
                        }
                    });
                    callback();
                }).catch((e) => { window.debug.log("error:"+e); callback(); });;;
        
        
            }
            recurseGit(startpath, 0, function () { if (_callback) _callback("done", repo, ""); });
        });
    }

   if(!callbackrefresh)
   {
    return new Promise(
        (resolve, reject) => {
            theFunction(function(status,repo,path){
                if(status=="done")
                {
                    console.log("done");
                    resolve({status:status,repo:repo,path:path});
                }
            });
            
        });
   }
   else{
    theFunction(callbackrefresh);
   }

    

    
}

export function cacheRepo(params, callbackrefresh) {

    var username=params.username;
    var repo=params.repo;
    var startpath=params.path || "";
    var maxdepth=params.depth || 1;

    waitForOctokit(function(){
        var octokit = getGitHub({ auth: getToken() });
        var recurseGit = function (path, depth, callback) {
            var _path = path;
            if (_path.slice(-1) == "/") _path = _path.slice(0, -1);
            octokit.repos.getContent({
                owner: "gormantec",
                repo: "wasmdom",
                path: path
            }).then((sha) => {
                var directories = [];
                sha.data.forEach(function (file) {
                    if (file.name.substring(0, 1) != ".") {
                        if (file.path && file.type == "dir" && file.name.substring(0, 1) != "." && (depth==0 || file.path.indexOf("assembly")>=0 || file.path.indexOf("dist")>=0)) {
                            recurseGit(file.path, depth, callback);
                        }
                        else {
                            getGitFile("gormantec", "wasmdom", file.path, (e,d)=>{
                                localStorage.setItem("gitfile-git://gormantec:wasmdom/"+file.path,btoa(d));
                            });
                            
                        }
                    }
                });
                //callback();
            }).catch((e) => { window.debug.log("error:"+e); callback("error",repo,""+e); });;;
    
    
        }
        recurseGit("assembly", 0, function () { if (callbackrefresh) callbackrefresh("done", repo, ""); });
    });
}








