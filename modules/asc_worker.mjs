importScripts("https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.6/require.min.js");




onmessage = async function (e) {  


    var tryCount = 0;//test  
    var dataURL = null;
    var dataBlob = null;
    console.log("worker run: ");
    var _run = async function () {
    var failed = false;
    var downloading = 0;


    
    const sourceCode = e.data[0], mainFilename = e.data[1], editorFilename = e.data[2], outputFilename = e.data[3], cID=e.data[4],dapp=(true==e.data[5] || "true"==e.data[4] || "TRUE"==e.data[4]);
    var callback=function(e, d) {
        postMessage({cID:cID,error:e,data:d});
    }
    require(["https://cdn.jsdelivr.net/npm/assemblyscript@latest/dist/sdk.js"], ({ asc }) => {


        const _allFIles = fetch("/dist/tsfiles.json").then(r => r.json()).then((dist_files) => {
            asc.ready.then(() => {
                const stdout = asc.createMemoryStream();
                const stderr = asc.createMemoryStream();
                const _errorHandle = console.error;
                console.error = () => { console.log("."); };
                try {
                    asc.main([
                        mainFilename,
                        "--exportRuntime",
                        "--binaryFile", outputFilename,
                    ], {
                        stdout,
                        stderr,
                        readFile(name, baseDir) {
                            const _fileData = load(name, true); 
                            if (baseDir == "." && _fileData && name.indexOf("node_modules") < 0) {
                                return _fileData;
                            }
                            if (name == editorFilename || (name.indexOf("wasmdom-jsdom/") >= 0 && name.endsWith(editorFilename))) {
                                return sourceCode;
                            }
                            else if (name == "asconfig.json" && dapp == true) {
                                JSON.stringify({ "extends": "near-sdk-as/asconfig.json" });
                            }
                            else if (name == "asconfig.json" && dapp != true) {
                                return JSON.stringify({ "targets": { "release": { "binaryFile": "'+outputFilename+'", "optimize": true }, "options": {} } });
                            }
                            else if (name.startsWith("/node_modules/")) {

                                const _name = "dist/" + name.substring(14);
                                const _fileString = load(_name, true, 40000);
                                if (_fileString && _fileString != "NA") {
                                    return _fileString;
                                }
                                else if (_fileString == "NA") {
                                    return null;
                                }
                                else if (_name.startsWith("dist/") && (_name.endsWith(".ts") || _name.endsWith("package.json")) && !(dist_files.files[md5("/" + _name)])) {
                                    return null;
                                }
                                else {
                                    downloading++;
                                    fetch("/" + _name)
                                        .then(response => response.ok ? response.text() : null)
                                        .then(text => {
                                            if (text) {
                                                if (!failed) setTimeout(_run, 2000);
                                                failed = true;
                                                try { save(_name, text); } catch (e) { console.log("Save error: " + e); save(_name, "NA"); }
                                            }
                                            else {
                                                save(_name, "NA");
                                            }
                                        }).catch((error) => { console.log("."); })
                                        .finally(() => {
                                            downloading--;
                                        });
                                    return null;
                                }

                                return null;

                            }
                            else {
                                return null;
                            }

                        },
                        writeFile(name, data, baseDir) {
                            console.log("write file: " + name);
                            if (typeof data == "object" && name == outputFilename && !failed) {
                                const reader = new FileReader();
                                dataURL = "reading";
                                reader.addEventListener("load", function () {
                                    console.log("got dataURL: " + reader.result.substring(0, 30));
                                    dataURL = reader.result;
                                }, false);

                                //createDownawait load(name, new Blob([Uint8Array.from(data)], { type: 'application/wasm' }));
                                dataBlob = new Blob([Uint8Array.from(data)]);

                                reader.readAsDataURL(new Blob([Uint8Array.from(data)], { type: 'application/wasm' }));
                            }
                        },
                        listFiles(dirname, baseDir) {
                            console.log(`>>> listFiles: baseDir=${baseDir} dirname = ${dirname} `);
                            return [];
                        }
                    }, err => {
                        var waitForDownload = function (thenDo) {
                            if (downloading == 0) thenDo();
                            else {
                                setTimeout(() => {
                                    waitForDownload(thenDo);
                                }, 500);
                            }
                        };
                        waitForDownload(() => {
                            if (failed) {
                                if (tryCount > 0) {
                                     console.log("\b..");
                                     postMessage({timerValue:""+((tryCount/(tryCount+4))-10)+"%"});
                                }
                                else {
                                     console.log("downloading depenadnt files..");
                                }
                                tryCount++;

                            }
                            else {
                                postMessage({timerValue:"90%"});
                                console.log("--compile done---");
                                if (stdout && stdout.toString().trim() != "") console.log(`>>> STDOUT >>>\n${stdout.toString()}`);
                                if (stderr && stderr.toString().trim() != "") console.log(`>>> STDERR >>>\n${stderr.toString()}`);
                                console.log("-----------------");
                                if (err) {
                                    console.log("------ERROR------");
                                    console.log(err);
                                    console.log(">>> ERROR THROWN >>>");
                                    console.log(err);
                                    callback(err);
                                }
                                else {
                                    console.log("Compiled Ok");
                                    var readTryCount = 0;
                                    var waitRead = () => {
                                        if (dataURL == "reading" || (dataURL == null && readTryCount < 100)) {
                                            console.log("reading..");
                                            if (readTryCount == 0) console.log("reading file..");
                                            else console.log("\b..");
                                            readTryCount++;
                                            setTimeout(waitRead, 500);
                                        }
                                        else {

                                            console.log("reading done");
                                            var b64data = dataURL.substring(dataURL.indexOf(";base64,") + 8);
                                            var accountId = sourceCode.replace(/^[\s\S]*?@Near.*?"accountId".*?"(.*?)"[\s\S]*$/, "$1");
                                            var contractId = sourceCode.replace(/^[\s\S]*?@Near.*?"contractId".*?"(.*?)"[\s\S]*$/, "$1");
                                            callback(null, { "dataURL": dataURL, dataBlob: dataBlob });
                                        }
                                    };
                                    waitRead();
                                }
                            }
                        });
                    });
                }
                catch (e) {
                    console.log("asc error: " + e);
                }
                console.error = _errorHandle;
            }).catch(callback);
        }).catch((error) => { console.log("fetch error:" + error); callback(error); })
    });
}
_run();

}



const FILE_PREFIX = "File-";
const CONTENT_TYPE_PREFIX = "ContentType-";
const DATE_PREFIX = "DateChange-";




function save(filename, data, overwrite = true) {
    let saveData = null;
    let contentType = "[object String]";
    if (!overwrite && _localStorage.getItem(FILE_PREFIX + filename)) return;
    if ({}.toString.call(data) == "[object String]") {
        saveData = btoa(unescape(encodeURIComponent(data)));
        contentType = "[object String]";
    }
    else if ({}.toString.call(data) == "[object Object]" && canJSON(data)) {
        saveData = btoa(unescape(encodeURIComponent(JSON.stringify(data))));
        contentType = "[object Object]";
    }
    else if ({}.toString.call(data) == "[object Uint8Array]") {
        var decoder = new TextDecoder('utf8');
        saveData = btoa(unescape(encodeURIComponent(decoder.decode(data))));
        contentType = "[object Uint8Array]";
    }
    else if ({}.toString.call(data) == "[object Array]") {
        saveData = btoa(unescape(encodeURIComponent(JSON.stringify({ array: data }))));
        contentType = "[object Array]";
    }
    else {
        return;
    }
    _localStorage.setItem(FILE_PREFIX + filename, saveData);
    _localStorage.setItem(CONTENT_TYPE_PREFIX + filename, contentType);
    _localStorage.setItem(DATE_PREFIX + filename, (new Date()).getTime());
}

function canJSON(value) {
    try {
        JSON.stringify(value);
        return true;
    } catch (ex) {
        return false;
    }
}



function load(filename, asString = false, ageInSec = -1) {
    let b64 =  _localStorage.getItem(FILE_PREFIX + filename);
    let contentType = _localStorage.getItem(CONTENT_TYPE_PREFIX + filename);
    let dateChange = _localStorage.getItem(DATE_PREFIX + filename);
    if (ageInSec != -1 && ((new Date().getTime()) - ageInSec) > parseInt(dateChange)) return null;
    // console.log(contentType);
    var result = null;
    if (contentType == "[object String]") {
        result = decodeURIComponent(escape(atob(b64)));
    }
    else if (contentType == "[object Object]") {
        result = asString ? decodeURIComponent(escape(atob(b64))) : JSON.parse(decodeURIComponent(escape(atob(b64))));
    }
    else if (contentType == "[object Uint8Array]") {
        var result1 = decodeURIComponent(escape(atob(str))).split('').map(function (c) { return c.charCodeAt(0); });
        result = asString ? result1.toString() : result1;
    }
    else if (contentType == "[object Array]") {
        result = asString ? JSON.parse(decodeURIComponent(escape(atob(b64)))).array.toString() : JSON.parse(decodeURIComponent(escape(atob(b64)))).array;
    }

    return result;

}

function remove(filename) {
    _localStorage.removeItem(FILE_PREFIX + filename);
    _localStorage.removeItem(CONTENT_TYPE_PREFIX + filename);
}

function listNames() {
    var keys = Object.keys(_localStorage);
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

const _items={};

var _localStorage = {
    getItem:  function(name){
        return _items[name];
    },
    removeItem:function(name){
        _items[name]=null;
    },
    setItem:function(name,value){

        _items[name]=value;
    },
}



function md5cycle(x, k) {
    var a = x[0], b = x[1], c = x[2], d = x[3];
    
    a = ff(a, b, c, d, k[0], 7, -680876936);
    d = ff(d, a, b, c, k[1], 12, -389564586);
    c = ff(c, d, a, b, k[2], 17,  606105819);
    b = ff(b, c, d, a, k[3], 22, -1044525330);
    a = ff(a, b, c, d, k[4], 7, -176418897);
    d = ff(d, a, b, c, k[5], 12,  1200080426);
    c = ff(c, d, a, b, k[6], 17, -1473231341);
    b = ff(b, c, d, a, k[7], 22, -45705983);
    a = ff(a, b, c, d, k[8], 7,  1770035416);
    d = ff(d, a, b, c, k[9], 12, -1958414417);
    c = ff(c, d, a, b, k[10], 17, -42063);
    b = ff(b, c, d, a, k[11], 22, -1990404162);
    a = ff(a, b, c, d, k[12], 7,  1804603682);
    d = ff(d, a, b, c, k[13], 12, -40341101);
    c = ff(c, d, a, b, k[14], 17, -1502002290);
    b = ff(b, c, d, a, k[15], 22,  1236535329);
    
    a = gg(a, b, c, d, k[1], 5, -165796510);
    d = gg(d, a, b, c, k[6], 9, -1069501632);
    c = gg(c, d, a, b, k[11], 14,  643717713);
    b = gg(b, c, d, a, k[0], 20, -373897302);
    a = gg(a, b, c, d, k[5], 5, -701558691);
    d = gg(d, a, b, c, k[10], 9,  38016083);
    c = gg(c, d, a, b, k[15], 14, -660478335);
    b = gg(b, c, d, a, k[4], 20, -405537848);
    a = gg(a, b, c, d, k[9], 5,  568446438);
    d = gg(d, a, b, c, k[14], 9, -1019803690);
    c = gg(c, d, a, b, k[3], 14, -187363961);
    b = gg(b, c, d, a, k[8], 20,  1163531501);
    a = gg(a, b, c, d, k[13], 5, -1444681467);
    d = gg(d, a, b, c, k[2], 9, -51403784);
    c = gg(c, d, a, b, k[7], 14,  1735328473);
    b = gg(b, c, d, a, k[12], 20, -1926607734);
    
    a = hh(a, b, c, d, k[5], 4, -378558);
    d = hh(d, a, b, c, k[8], 11, -2022574463);
    c = hh(c, d, a, b, k[11], 16,  1839030562);
    b = hh(b, c, d, a, k[14], 23, -35309556);
    a = hh(a, b, c, d, k[1], 4, -1530992060);
    d = hh(d, a, b, c, k[4], 11,  1272893353);
    c = hh(c, d, a, b, k[7], 16, -155497632);
    b = hh(b, c, d, a, k[10], 23, -1094730640);
    a = hh(a, b, c, d, k[13], 4,  681279174);
    d = hh(d, a, b, c, k[0], 11, -358537222);
    c = hh(c, d, a, b, k[3], 16, -722521979);
    b = hh(b, c, d, a, k[6], 23,  76029189);
    a = hh(a, b, c, d, k[9], 4, -640364487);
    d = hh(d, a, b, c, k[12], 11, -421815835);
    c = hh(c, d, a, b, k[15], 16,  530742520);
    b = hh(b, c, d, a, k[2], 23, -995338651);
    
    a = ii(a, b, c, d, k[0], 6, -198630844);
    d = ii(d, a, b, c, k[7], 10,  1126891415);
    c = ii(c, d, a, b, k[14], 15, -1416354905);
    b = ii(b, c, d, a, k[5], 21, -57434055);
    a = ii(a, b, c, d, k[12], 6,  1700485571);
    d = ii(d, a, b, c, k[3], 10, -1894986606);
    c = ii(c, d, a, b, k[10], 15, -1051523);
    b = ii(b, c, d, a, k[1], 21, -2054922799);
    a = ii(a, b, c, d, k[8], 6,  1873313359);
    d = ii(d, a, b, c, k[15], 10, -30611744);
    c = ii(c, d, a, b, k[6], 15, -1560198380);
    b = ii(b, c, d, a, k[13], 21,  1309151649);
    a = ii(a, b, c, d, k[4], 6, -145523070);
    d = ii(d, a, b, c, k[11], 10, -1120210379);
    c = ii(c, d, a, b, k[2], 15,  718787259);
    b = ii(b, c, d, a, k[9], 21, -343485551);
    
    x[0] = add32(a, x[0]);
    x[1] = add32(b, x[1]);
    x[2] = add32(c, x[2]);
    x[3] = add32(d, x[3]);
    
    }
    
    function cmn(q, a, b, x, s, t) {
    a = add32(add32(a, q), add32(x, t));
    return add32((a << s) | (a >>> (32 - s)), b);
    }
    
    function ff(a, b, c, d, x, s, t) {
    return cmn((b & c) | ((~b) & d), a, b, x, s, t);
    }
    
    function gg(a, b, c, d, x, s, t) {
    return cmn((b & d) | (c & (~d)), a, b, x, s, t);
    }
    
    function hh(a, b, c, d, x, s, t) {
    return cmn(b ^ c ^ d, a, b, x, s, t);
    }
    
    function ii(a, b, c, d, x, s, t) {
    return cmn(c ^ (b | (~d)), a, b, x, s, t);
    }
    
    function md51(s) {
    var txt = '';
    var n = s.length,
    state = [1732584193, -271733879, -1732584194, 271733878], i;
    for (i=64; i<=s.length; i+=64) {
    md5cycle(state, md5blk(s.substring(i-64, i)));
    }
    s = s.substring(i-64);
    var tail = [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0];
    for (i=0; i<s.length; i++)
    tail[i>>2] |= s.charCodeAt(i) << ((i%4) << 3);
    tail[i>>2] |= 0x80 << ((i%4) << 3);
    if (i > 55) {
    md5cycle(state, tail);
    for (i=0; i<16; i++) tail[i] = 0;
    }
    tail[14] = n*8;
    md5cycle(state, tail);
    return state;
    }
    
    /* there needs to be support for Unicode here,
     * unless we pretend that we can redefine the MD-5
     * algorithm for multi-byte characters (perhaps
     * by adding every four 16-bit characters and
     * shortening the sum to 32 bits). Otherwise
     * I suggest performing MD-5 as if every character
     * was two bytes--e.g., 0040 0025 = @%--but then
     * how will an ordinary MD-5 sum be matched?
     * There is no way to standardize text to something
     * like UTF-8 before transformation; speed cost is
     * utterly prohibitive. The JavaScript standard
     * itself needs to look at this: it should start
     * providing access to strings as preformed UTF-8
     * 8-bit unsigned value arrays.
     */
    function md5blk(s) { /* I figured global was faster.   */
    var md5blks = [], i; /* Andy King said do it this way. */
    for (i=0; i<64; i+=4) {
    md5blks[i>>2] = s.charCodeAt(i)
    + (s.charCodeAt(i+1) << 8)
    + (s.charCodeAt(i+2) << 16)
    + (s.charCodeAt(i+3) << 24);
    }
    return md5blks;
    }
    
    var hex_chr = '0123456789abcdef'.split('');
    
    function rhex(n)
    {
    var s='', j=0;
    for(; j<4; j++)
    s += hex_chr[(n >> (j * 8 + 4)) & 0x0F]
    + hex_chr[(n >> (j * 8)) & 0x0F];
    return s;
    }
    
    function hex(x) {
    for (var i=0; i<x.length; i++)
    x[i] = rhex(x[i]);
    return x.join('');
    }
    
    function md5(s) {
    return hex(md51(s));
    }
    
    /* this function is much faster,
    so if possible we use it. Some IEs
    are the only ones I know of that
    need the idiotic second function,
    generated by an if clause.  */
    
    function add32(a, b) {
    return (a + b) & 0xFFFFFFFF;
    }
    
    if (md5('hello') != '5d41402abc4b2a76b9719d911017c592') {
    function add32(x, y) {
    var lsw = (x & 0xFFFF) + (y & 0xFFFF),
    msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xFFFF);
    }
    }