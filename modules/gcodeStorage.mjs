
import * as githubtree from '/modules/githubtree.mjs';

const FILE_PREFIX = "File-";
const CONTENT_TYPE_PREFIX = "ContentType-";
const DATE_PREFIX = "DateChange-";




export function save(filename, data, overwrite = true) {
    let saveData = null;
    let contentType = "[object String]";
    if (!overwrite && localStorage.getItem(FILE_PREFIX  + filename)) return;
    if ({}.toString.call(data) == "[object String]") {
        saveData = window.btoa(unescape(encodeURIComponent(data)));
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
    localStorage.setItem(FILE_PREFIX  + filename, saveData);
    localStorage.setItem(CONTENT_TYPE_PREFIX  + filename, contentType);
    localStorage.setItem(DATE_PREFIX  + filename, (new Date()).getTime());
}

function canJSON(value) {
    try {
        JSON.stringify(value);
        return true;
    } catch (ex) {
        return false;
    }
}

export function parent(filename)
{
    return null;
}

export function load(filename,asString = false,ageInSec=-1) {
    var result=null;
    if(filename.startsWith("git://"))
    {
        var firstColon = element.dataset.name.indexOf(":", 6);
        var secondColon = element.dataset.name.indexOf("/", firstColon + 1);
        var username = element.dataset.name.substring(6, firstColon);
        var repo = element.dataset.name.substring(firstColon + 1, secondColon);
        var path = element.dataset.name.substring(secondColon + 1);
        //githubtree.getGitFile(username, repo, path, function (e, d) {
            result = localStorage.getItem("gitfile-" + filename);
            /*if (cached) {
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
            window.editor.setValue(d);
            */
        //});
    }
    else{
        let b64 = localStorage.getItem(FILE_PREFIX + filename);
        let contentType = localStorage.getItem(CONTENT_TYPE_PREFIX + filename);
        let dateChange = localStorage.getItem(DATE_PREFIX + filename);
        if(ageInSec!=-1 && ((new Date().getTime())-ageInSec)>parseInt(dateChange)) return null;
        //window.debug.log(contentType);
        
        if (contentType == "[object String]") {
            result= decodeURIComponent(escape(window.atob(b64)));
        }
        else if (contentType == "[object Object]") {
            result= asString?decodeURIComponent(escape(window.atob(b64))):JSON.parse(decodeURIComponent(escape(window.atob(b64))));
        }
        else if (contentType == "[object Uint8Array]") {
            var result1=decodeURIComponent(escape(window.atob(str))).split('').map(function (c) { return c.charCodeAt(0); });
            result= asString?result1.toString():result1;
        }
        else if (contentType == "[object Array]") {
            result= asString?JSON.parse(decodeURIComponent(escape(window.atob(b64)))).array.toString():JSON.parse(decodeURIComponent(escape(window.atob(b64)))).array;
        }
    }


    //window.debug.log("result="+result);
    //window.debug.log("filename="+filename);
    //window.debug.log("asString="+asString);
    //window.debug.log(result);
    return result;

}

export function remove(filename) {
    localStorage.removeItem(FILE_PREFIX + filename);
    localStorage.removeItem(CONTENT_TYPE_PREFIX + filename);
}

export function listNames() {
    var keys = Object.keys(localStorage);
    var files=[];
    if(keys)
    {
        var i = keys.length;
        keys.sort();
        keys.reverse();
        while (i--) {
            if (keys[i].startsWith(FILE_PREFIX) && !keys[i].startsWith(FILE_PREFIX+"dist/") && keys[i] != FILE_PREFIX) {
                files.push(keys[i].substring(FILE_PREFIX.length));
            }
        }
    }
    return files;
}
