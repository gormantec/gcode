
import * as githubtree from '/modules/githubtree.mjs';

const FILE_PREFIX = "File-";
const CONTENT_TYPE_PREFIX = "ContentType-";
const DATE_PREFIX = "DateChange-";




export function save(filename, data, overwrite = true) {
    let saveData = null;
    let contentType = "[object String]";
    if (!overwrite && localStorage.getItem(FILE_PREFIX + filename)) return;
    if ({}.toString.call(data) == "[object String]") {
        saveData = window.btoa(window.unescape(encodeURIComponent(data)));
        contentType = "[object String]";
    }
    else if ({}.toString.call(data) == "[object Object]" && canJSON(data)) {
        saveData = window.btoa(unescape(encodeURIComponent(JSON.stringify(data))));
        contentType = "[object Object]";
    }
    else if ({}.toString.call(data) == "[object Uint8Array]") {
        var decoder = new TextDecoder('utf8');
        saveData = window.btoa(unescape(encodeURIComponent(decoder.decode(data))));
        contentType = "[object Uint8Array]";
    }
    else if ({}.toString.call(data) == "[object Array]") {
        saveData = window.btoa(unescape(encodeURIComponent(JSON.stringify({ array: data }))));
        contentType = "[object Array]";
    }
    else {
        return;
    }
    localStorage.setItem(FILE_PREFIX + filename, saveData);
    localStorage.setItem(CONTENT_TYPE_PREFIX + filename, contentType);
    localStorage.setItem(DATE_PREFIX + filename, (new Date()).getTime());
}

function canJSON(value) {
    try {
        JSON.stringify(value);
        return true;
    } catch (ex) {
        return false;
    }
}

export function parent(filename) {
    return null;
}



export function syncPreload(files) {

    var done=false;

    preload(files).then(()=>{
        done=true;
    });
    count++;
    while(done==false && count<100000)
    {
        var rnd=Math.sqrt(Math.random*Math.random*Math.random*Math.random*Math.random*100000);
        count++;
    }
}

export async function preload(files) {
    return new Promise((resolve, reject) => {
        
        try {

            if(files==null)resolve();
            else if(Array.isArray(files) && files.length==0)resolve();
            
            if (typeof files == "string") files = [files];
            let count = 0;
            for (let i = 0; i < files.length; i++) {
                let filename=null;
                if( typeof files[i] == "string" )filename=files[i];
                else if (files[i].dir && files[i].name ) filename = files[i].dir+files[i].name;
                else if (files[i].name) filename = files[i].name;
                if(filename && filename.substring(0, 6) == "git://")
                {

                    let firstColon = filename.indexOf(":", 6);
                    let secondColon = filename.indexOf("/", firstColon + 1);
                    let username = filename.substring(6, firstColon);
                    let repo = filename.substring(firstColon + 1, secondColon);
                    let path = filename.substring(secondColon + 1);
                    githubtree.waitForOctokit(()=>{
                        githubtree.getGitFile(username, repo, path, function (e, d) {
                        
                            let cached = localStorage.getItem("gitfile-" + filename);
                            if (!cached && !e && d) {
                                localStorage.setItem("gitfile-" + filename, window.btoa(window.unescape(encodeURIComponent(d))));
                            }
                            count++;
                            if (count == files.length) {
                                console.log("preloaded");
                                resolve();
                            }
                        });
                    });

                }
                else{
                    count++;
                    if (count >= files.length) {
                        console.log("preloaded");
                        resolve();
                    }
                }
                console.log("count("+count+") >= files.length("+files.length+")");
            }
        }
        catch (e) {
            console.log(e);
            reject(e);
        }
    });
}

export function load(filename, asString = false, ageInSec = -1) {
    let result = null;
    console.log("load:" + filename);
    if (filename.startsWith("git://")) {
        let b64 = localStorage.getItem("gitfile-" + filename);
        if(b64)
        {
            result = decodeURIComponent(escape(window.atob(b64)));
        }
        
    }
    else {
        if(filename.startsWith("./"))filename=filename.substring(2);
        let b64 = localStorage.getItem(FILE_PREFIX + filename);
        let contentType = localStorage.getItem(CONTENT_TYPE_PREFIX + filename);
        let dateChange = localStorage.getItem(DATE_PREFIX + filename);
        if (ageInSec != -1 && ((new Date().getTime()) - ageInSec) > parseInt(dateChange)) return null;

        if (contentType == "[object String]") {
            result = decodeURIComponent(escape(window.atob(b64)));
        }
        else if (contentType == "[object Object]") {
            result = asString ? decodeURIComponent(escape(window.atob(b64))) : JSON.parse(decodeURIComponent(escape(window.atob(b64))));
        }
        else if (contentType == "[object Uint8Array]") {
            let result1 = decodeURIComponent(escape(window.atob(str))).split('').map(function (c) { return c.charCodeAt(0); });
            result = asString ? result1.toString() : result1;
        }
        else if (contentType == "[object Array]") {
            result = asString ? JSON.parse(decodeURIComponent(escape(window.atob(b64)))).array.toString() : JSON.parse(decodeURIComponent(escape(window.atob(b64)))).array;
        }
    }

    return result;

}

export function remove(filename) {
    localStorage.removeItem(FILE_PREFIX + filename);
    localStorage.removeItem(CONTENT_TYPE_PREFIX + filename);
}

export function listNames() {
    var keys = Object.keys(localStorage);
    var files = [];
    if (keys) {
        var i = keys.length;
        keys.sort();
        keys.reverse();
        while (i--) {
            if (keys[i].startsWith(FILE_PREFIX) && !keys[i].startsWith(FILE_PREFIX + "dist/") && keys[i] != FILE_PREFIX) {
                files.push(keys[i].substring(FILE_PREFIX.length));
            }
        }
    }
    return files;
}
