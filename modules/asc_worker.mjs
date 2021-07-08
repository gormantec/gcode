import { save, load } from '/modules/gcodeStorage.mjs';

import * as requireModule from "https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.6/require.min.js";
import "https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.6/require.min.js";
import * as ascModule from "https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.6/require.min.js";
import "https://cdn.jsdelivr.net/npm/assemblyscript@latest/dist/sdk.js";

console.log(requireModule);
console.log(requireModule.require);
console.log(requireModule.exports);

console.log(window);
console.log(asc);
console.log(ascModule);
console.log(ascModule.require);
console.log(ascModule.exports);
   
function callback(e,d)
{
    console.log("e:"+e);
    console.log("d:"+d);
}



onmessage = function (e) {
    var tryCount = 0;//test  
    var dataURL = null;
    var dataBlob = null;
    var failed = false;
    var downloading = 0;
    console.log("worker 1: ");
    const sourceCode=e.data[0],mainFilename=e.data[1],editorFilename=e.data[2],outputFilename=e.data[3];
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

                            
                            const _fileData = load(name, true);
                            if (baseDir == "." && _fileData && name.indexOf("node_modules") < 0) {
                                return _fileData;
                            }
                            if (name == editorFilename || (name.indexOf("wasmdom-jsdom/") >= 0 && name.endsWith(editorFilename))) {

                                console.log("Got App:" + name);
                                console.log(baseDir+" / "+name); 
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
                                else if(_name.startsWith("dist/") && (_name.endsWith(".ts") || _name.endsWith("package.json")) && !(dist_files.files[md5("/"+_name)])){
                                    return null;
                                }
                                else{
                                    downloading++;
                                    console.log(baseDir+" / "+name); 
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
                                    console.log("got dataURL: " + reader.result.substring(0,30));
                                    dataURL = reader.result;
                                }, false);

                                //createDownload(name, new Blob([Uint8Array.from(data)], { type: 'application/wasm' }));
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
                                }
                                else {
                                    console.log("downloading depenadnt files..");
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
        }).catch((error) => { console.log("fetch error:" + error); callback(error);})
    });

}



