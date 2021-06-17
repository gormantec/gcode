
import { save, load } from '/modules/gcodeStorage.mjs';
import { compile, login, test } from '/modules/near/index.mjs';
import { getScript } from '/modules/getScript.mjs';
import { createDownload, b64toBlob } from '/modules/createDownload.mjs';

const getRequire = getScript('https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.6/require.min.js', ["require"]);

export function run(sourceCode, mainFilename, editorFilename, outputFilename, dapp, callback) {
    console.log("editorFilename:" + editorFilename);
    try {
        if (dapp) {
            var accountId = sourceCode.replace(/^[\s\S]*?@Near.*?"accountId".*?"(.*?)"[\s\S]*$/, "$1");
            var contractId = sourceCode.replace(/^[\s\S]*?@Near.*?"contractId".*?"(.*?)"[\s\S]*$/, "$1");
            if (accountId == sourceCode) accountId = "";
            if (contractId == sourceCode) contractId = "";
            console.log(accountId);
            document.querySelector("#nearDialogTimer").showModal();
            document.querySelector("#nearDialogTimerValue").style.width = "5%";
            setTimeout(() => { document.querySelector("#nearDialogTimerValue").style.width = "10%"; }, 4000);
            setTimeout(() => { document.querySelector("#nearDialogTimerValue").style.width = "15%"; }, 8000);
            var closeTimer=() => {
                document.querySelector("#nearDialogTimerValue").style.width = "100%";
                callback(null, {});
                setTimeout(() => {
                    document.querySelector("#nearDialogTimer").close();
                    document.querySelector("#nearDialogTimerValue").style.width = "10%";
                }, 1000);
            };
            login({ accountId: accountId, contractId: contractId }).then(() => {

                setTimeout(() => { document.querySelector("#nearDialogTimerValue").style.width = "20%"; }, 10000);
                setTimeout(() => { document.querySelector("#nearDialogTimerValue").style.width = "25%"; }, 15000);
                setTimeout(() => { document.querySelector("#nearDialogTimerValue").style.width = "30%"; }, 20000);
                setTimeout(() => { document.querySelector("#nearDialogTimerValue").style.width = "35%"; }, 25000);
                setTimeout(() => { document.querySelector("#nearDialogTimerValue").style.width = "40%"; }, 30000);
                setTimeout(() => { document.querySelector("#nearDialogTimerValue").style.width = "45%"; }, 35000);
                setTimeout(() => { document.querySelector("#nearDialogTimerValue").style.width = "50%"; }, 40000);
                setTimeout(() => { document.querySelector("#nearDialogTimerValue").style.width = "55%"; }, 45000);
                setTimeout(() => { document.querySelector("#nearDialogTimerValue").style.width = "60%"; }, 50000);
                setTimeout(() => { document.querySelector("#nearDialogTimerValue").style.width = "65%"; }, 55000);
                setTimeout(() => { document.querySelector("#nearDialogTimerValue").style.width = "70%"; }, 60000);
                setTimeout(() => { document.querySelector("#nearDialogTimerValue").style.width = "75%"; }, 65000);
                setTimeout(() => { document.querySelector("#nearDialogTimerValue").style.width = "80%"; }, 70000);
                setTimeout(() => { document.querySelector("#nearDialogTimerValue").style.width = "85%"; }, 75000);
                setTimeout(() => { document.querySelector("#nearDialogTimerValue").style.width = "90%"; }, 80000);
                compile({
                    accountId: accountId,
                    contractId: contractId,
                    filesArray: [{ name: "assembly/index.ts", data: sourceCode, type: "string" }]
                }).then((x) => {

                    document.querySelector("#nearDialogTimerValue").style.width = "95%";
                    b64toBlob(x.content, 'application/zip').then(blob => {
                        createDownload("assembly.zip", blob, { type: 'application/zip' });
                    });
                    test(x.response.testdata).then(closeTimer).catch(closeTimer);
                }).catch(closeTimer);
            }).catch(closeTimer);
        }
        else {

            var tryCount = 0;//test  
            var dataURL = null;
            var dataBlob = null;
            var _run = async function () {
                var failed = false;
                var downloading = 0;
                getRequire.then(({ require }) => {
                    require(["https://cdn.jsdelivr.net/npm/assemblyscript@latest/dist/sdk.js"], ({ asc }) => {
                        asc.ready.then(() => {
                            const stdout = asc.createMemoryStream();
                            const stderr = asc.createMemoryStream();
                            asc.main([
                                mainFilename,
                                "--exportRuntime",
                                "--binaryFile", outputFilename,
                            ], {
                                stdout,
                                stderr,
                                readFile(name, baseDir) {
                                    console.log(baseDir+" \ "+name);
                                    const _fileData = load(name, true);
                                    if (baseDir == "." && _fileData && name.indexOf("node_modules") < 0) {
                                        return _fileData;
                                    }
                                    if (name == editorFilename || (name.indexOf("wasmdom/") >= 0 && name.endsWith(editorFilename))) {
                                        window.debug.log("Got App:" + name);
                                        return sourceCode;
                                    }
                                    else if (name == "asconfig.json" && dapp == true) {
                                        JSON.stringify({ "extends": "near-sdk-as/asconfig.json" });
                                    }
                                    else if (name == "asconfig.json" && dapp != true) {
                                        return JSON.stringify({ "targets": { "release": { "binaryFile": "'+outputFilename+'", "optimize": true }, "options": {} } });
                                    }
                                    else if (name.startsWith("/node_modules/")) {

                                        const _name = "dist/" + name.substring(14)
                                        const _fileString = load(_name, true);

                                        if (_fileString && _fileString != "NA") {
                                            return _fileString;
                                        }
                                        else if (_fileString == "NA") {
                                            return null;
                                        }
                                        else {
                                            downloading++;
                                            fetch("https://gcode.com.au/" + _name)
                                                .then(response => response.ok ? response.text() : null)
                                                .then(text => {
                                                    if (text) {
                                                        if (!failed) window.setTimeout(_run, 2000);
                                                        failed = true;
                                                        try { save(_name, text); } catch (e) { console.log("Save error: " + e); save(_name, "NA"); }
                                                    }
                                                    else {
                                                        save(_name, "NA");
                                                    }
                                                }).catch((error) => { window.debug.log("fetch error:" + error); })
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
                                    console.log("write file: " + (typeof data));
                                    if (typeof data == "object" && name == outputFilename && !failed) {
                                        const reader = new FileReader();
                                        dataURL = "reading";
                                        reader.addEventListener("load", function () {
                                            console.log("write load: " + (typeof reader.result));
                                            dataURL = reader.result;
                                        }, false);

                                        createDownload(name,new Blob([Uint8Array.from(data)], { type: 'application/wasm' })); 
                                        dataBlob = new Blob([Uint8Array.from(data)]);

                                        reader.readAsDataURL(new Blob([Uint8Array.from(data)], { type: 'application/wasm' }));
                                    }
                                },
                                listFiles(dirname, baseDir) {
                                    window.debug.log(`>>> listFiles: baseDir=${baseDir} dirname = ${dirname} `);
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

                                        if (stdout && stdout.toString().trim() != "") window.debug.log(`>>> STDOUT >>>\n${stdout.toString()}`);
                                        if (stderr && stderr.toString().trim() != "") window.debug.log(`>>> STDERR >>>\n${stderr.toString()}`);
                                        if (err) {
                                            window.debug.log(">>> ERROR THROWN >>>");
                                            window.debug.log(err);
                                            callback(err);
                                        }
                                        else {
                                            window.debug.log("Compiled Ok");
                                            var readTryCount = 0;
                                            var waitRead = () => {
                                                if (dataURL == "reading" || (dataURL == null && readTryCount < 100)) {
                                                    if (readTryCount == 0) window.debug.log("reading file..");
                                                    else window.debug.log("\b..");
                                                    readTryCount++;
                                                    setTimeout(waitRead, 500);
                                                }
                                                else {
                                                    var b64data = dataURL.substring(dataURL.indexOf(";base64,") + 8);
                                                    var accountId = sourceCode.replace(/^[\s\S]*?@Near.*?"accountId".*?"(.*?)"[\s\S]*$/, "$1");
                                                    var contractId = sourceCode.replace(/^[\s\S]*?@Near.*?"contractId".*?"(.*?)"[\s\S]*$/, "$1");
                                                    callback(null, { "dataURL": dataURL ,dataBlob:dataBlob});
                                                }
                                            };
                                            waitRead();

                                        }
                                    }
                                });
                            });
                        });
                    });
                });

            }
            _run();
        }
    }
    catch (e) { window.debug.log(e); }
}



function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {
        type: mimeString
    });
}



