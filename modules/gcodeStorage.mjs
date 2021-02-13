const FILE_PREFIX = "File-";
const CONTENT_TYPE_PREFIX = "ContentType-";

export function save(filename, data, overwrite = true) {
    let saveData = null;
    let contentType = "[object String]";
    if (!overwrite && localStorage.getItem(FILE_PREFIX  + filename)) return;
    if ({}.toString.call(data) == "[object String]") {
        saveData = btoa(data);
        contentType = "[object String]";
    }
    else if ({}.toString.call(data) == "[object Object]" && canJSON(data)) {
        saveData = btoa(JSON.stringify(data));
        contentType = "[object Object]";
    }
    else if ({}.toString.call(data) == "[object Uint8Array]") {
        var decoder = new TextDecoder('utf8');
        saveData = btoa(decoder.decode(data));
        contentType = "[object Uint8Array]";
    }
    else if ({}.toString.call(data) == "[object Array]") {
        saveData = btoa(JSON.stringify({ array: data }));
        contentType = "[object Array]";
    }
    else {
        return;
    }
    localStorage.setItem(FILE_PREFIX  + filename, saveData);
    localStorage.setItem(CONTENT_TYPE_PREFIX  + filename, contentType);
}

function canJSON(value) {
    try {
        JSON.stringify(value);
        return true;
    } catch (ex) {
        return false;
    }
}

export function load(filename,asString = false) {
    let b64 = localStorage.getItem(FILE_PREFIX + filename);
    let contentType = localStorage.getItem(CONTENT_TYPE_PREFIX + filename);
    console.log(contentType);
    var result="";
    if (contentType == "[object String]") {
        result= atob(b64);
    }
    else if (contentType == "[object Object]") {
        result= asString?atob(b64):JSON.parse(atob(b64));
    }
    else if (contentType == "[object Uint8Array]") {
        var result1=atob(str).split('').map(function (c) { return c.charCodeAt(0); });
        result= asString?result1.toString():result1;
    }
    else if (contentType == "[object Array]") {
        result= asString?JSON.parse(atob(b64)).array.toString():JSON.parse(atob(b64)).array;
    }
    //console.log("filename="+filename);
    //console.log("asString="+asString);
    //console.log(result);
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
            if (keys[i].startsWith(FILE_PREFIX) && keys[i] != FILE_PREFIX) {
                files.push(keys[i].substring(FILE_PREFIX.length));
            }
        }
    }
    return files;
}
