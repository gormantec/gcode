importScripts("https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.6/require.min.js");


function callback(e, d) {
    console.log("e:" + e);
    console.log("d:" + d);
}



onmessage = async function (e) {
    var tryCount = 0;//test  
    var dataURL = null;
    var dataBlob = null;
    var failed = false;
    var downloading = 0;
    console.log("worker 1: ");
    const sourceCode = e.data[0], mainFilename = e.data[1], editorFilename = e.data[2], outputFilename = e.data[3];
    require(["https://cdn.jsdelivr.net/npm/assemblyscript@latest/dist/sdk.js"], ({ asc }) => {

        console.log("got asc");

        const _allFIles = fetch("/dist/tsfiles.json").then(r => r.json()).then((dist_files) => {
            console.log("got tsfiles");
            asc.ready.then(() => {
                console.log("got asc then");
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


                            const _fileData = await load(name, true);
                            if (baseDir == "." && _fileData && name.indexOf("node_modules") < 0) {
                                return _fileData;
                            }
                            if (name == editorFilename || (name.indexOf("wasmdom-jsdom/") >= 0 && name.endsWith(editorFilename))) {

                                console.log("Got App:" + name);
                                console.log(baseDir + " / " + name);
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
                                const _fileString = await load(_name, true, 40000);
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
                                    console.log(baseDir + " / " + name);
                                    fetch("/" + _name)
                                        .then(response => response.ok ? response.text() : null)
                                        .then(text => {
                                            if (text) {
                                                if (!failed) setTimeout(_run, 2000);
                                                failed = true;
                                                try { await save(_name, text); } catch (e) { console.log("Save error: " + e); await save(_name, "NA"); }
                                            }
                                            else {
                                                await save(_name, "NA");
                                            }
                                        }).catch((error) => { console.log("fetch error:" + error); })
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
                                window.setTimeout(() => {
                                    waitForDownload(thenDo);
                                }, 500);
                            }
                        };
                        waitForDownload(() => {
                            if (failed) {
                                if (tryCount > 0) {
                                    window.debug.log("\b..");
                                }
                                else {
                                    window.debug.log("downloading depenadnt files..");
                                }
                                tryCount++;

                            }
                            else {
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



const FILE_PREFIX = "File-";
const CONTENT_TYPE_PREFIX = "ContentType-";
const DATE_PREFIX = "DateChange-";




async function save(filename, data, overwrite = true) {
    let saveData = null;
    let contentType = "[object String]";
    if (!overwrite && _localStorage.getItem(FILE_PREFIX + filename)) return;
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



async function load(filename, asString = false, ageInSec = -1) {
    let b64 =  await _localStorage.getItem(FILE_PREFIX + filename);
    let contentType = await _localStorage.getItem(CONTENT_TYPE_PREFIX + filename);
    let dateChange = await _localStorage.getItem(DATE_PREFIX + filename);
    if (ageInSec != -1 && ((new Date().getTime()) - ageInSec) > parseInt(dateChange)) return null;
    //window.debug.log(contentType);
    var result = null;
    if (contentType == "[object String]") {
        result = decodeURIComponent(escape(window.atob(b64)));
    }
    else if (contentType == "[object Object]") {
        result = asString ? decodeURIComponent(escape(window.atob(b64))) : JSON.parse(decodeURIComponent(escape(window.atob(b64))));
    }
    else if (contentType == "[object Uint8Array]") {
        var result1 = decodeURIComponent(escape(window.atob(str))).split('').map(function (c) { return c.charCodeAt(0); });
        result = asString ? result1.toString() : result1;
    }
    else if (contentType == "[object Array]") {
        result = asString ? JSON.parse(decodeURIComponent(escape(window.atob(b64)))).array.toString() : JSON.parse(decodeURIComponent(escape(window.atob(b64)))).array;
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