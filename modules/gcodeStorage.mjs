const FILE_PREFIX = "File-";
const CONTENT_TYPE_PREFIX = "ContentType-";

export function save(filename, data) {
    let saveData = null;
    let contentType = "[object String]";
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
        saveData = btoa(JSON.stringify({array:data}));
        contentType = "[object Array]";
    }
    else{
        return;
    }
    localStorage.setItem(FILE_PREFIX +"-"+ filename, saveData);
    localStorage.setItem(CONTENT_TYPE_PREFIX +"-"+ filename, contentType);
}

function canJSON(value) {
    try {
        JSON.stringify(value);
        return true;
    } catch (ex) {
        return false;
    }
}

export function open(filename) {
    let b64 = localStorage.getItem(FILE_PREFIX + filename);
    let contentType = localStorage.getItem(FILE_PREFIX + filename);
    if (contentType == "[object String]")
    {
        return atob(b64);
    }
    else if (contentType == "[object Object]")
    {
        return JSON.parse(atob(b64));
    }
    else if (contentType == "[object Uint8Array]")
    {
        return atob(str).split('').map(function (c) { return c.charCodeAt(0); });
    }
    else if (contentType == "[object Array]")
    {
        return JSON.parse(atob(b64)).array;
    }
    
}

export function remove(filename) {
    localStorage.removeItem(FILE_PREFIX + filename);
    localStorage.removeItem(CONTENT_TYPE_PREFIX + filename);
}