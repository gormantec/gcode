
import { save, load } from '/modules/gcodeStorage.mjs';

export function run(sourceCode, mainFilename, editorFilename, outputFilename, dapp, callback) {
    console.log("editorFilename:" + editorFilename);
    try {

        var tryCount = 0;
        var dataURL = null;
        var _run = async function () {
            var failed = false;
            var downloading = 0;
            require(["https://cdn.jsdelivr.net/npm/assemblyscript@latest/dist/sdk.js"], ({ asc }) => {
                asc.ready.then(() => {
                    const stdout = asc.createMemoryStream();
                    const stderr = asc.createMemoryStream();
                    asc.main([
                        mainFilename,
                        "--binaryFile", outputFilename,
                    ], {
                        stdout,
                        stderr,
                        readFile(name, baseDir) {
                            //console.log("name = " + name + "  baseDir = " + baseDir);
                            const _fileData=load(name,true);
                            if (baseDir == "." &&  _fileData && name.indexOf("node_modules")<0) {
                                return _fileData;
                            }
                            if (name == editorFilename || (name.indexOf("wasmdom/") >= 0 && name.endsWith(editorFilename))) {
                                window.debug.log("Got App:" + name);
                                return sourceCode;
                            }
                            else if (name == "asconfig.json" && dapp == true) {
                                //console.log("dapp asconfig:" + name);
                                JSON.stringify({ "extends": "near-sdk-as/asconfig.json" });
                            }
                            else if (name == "asconfig.json" && dapp != true) {
                                //window.debug.log("got file:" + name);
                                return JSON.stringify({ "targets": { "release": { "binaryFile": "'+outputFilename+'", "optimize": true }, "options": {} } });
                            }
                            else if (name.startsWith("/node_modules/")) {

                                const _name = "dist/" + name.substring(14)
                                const _fileString = load(_name, true);
              
                                if (_fileString && _fileString != "NA") {
                                    //console.log("found:"+_name);
                                    return _fileString;
                                }
                                else if (_fileString == "NA") {
                                    return null;
                                }
                                else {
                                    downloading++;
                                    //console.log("fetch: https://gcode.com.au/"+_name);
                                    fetch("https://gcode.com.au/"+_name)
                                        .then(response => response.ok ? response.text() : null)
                                        .then(text => {
                                            if (text) {
                                                if (!failed) window.setTimeout(_run, 2000);
                                                failed = true;
                                                try{ save(_name,text); } catch(e){console.log("Save error: "+e);save(_name,"NA");}
                                                //console.log("added:"+_name);
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
                                //console.log("????: "+name);
                                return null;
                            }

                        },
                        writeFile(name, data, baseDir) {
                            console.log("write file: "+name);
                            console.log("write file: "+(typeof data));
                            if (typeof data == "object" && name == outputFilename && !failed) {
                                const reader = new FileReader();
                                dataURL = "reading";
                                reader.addEventListener("load", function () {
                                    console.log("write load: "+(typeof reader.result));
                                    dataURL = reader.result;
                                }, false);

                                createDownload(name,new Blob([Uint8Array.from(data)], { type: 'application/wasm' }));
                                
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

                                if (stdout.toString().trim() != "") window.debug.log(`>>> STDOUT >>>\n${stdout.toString()}`);
                                if (stderr.toString().trim() != "") window.debug.log(`>>> STDERR >>>\n${stderr.toString()}`);
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
                                            //upload(dataURL);
                                            //test();
                                            callback(null, { "dataURL": dataURL });
                                        }
                                    };
                                    waitRead();

                                }
                            }
                        });
                    });
                });
            });
        }
        _run();
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

function createDownload(blobname,blob)
{
    //var blob = dataURItoBlob(message.content);

    var blobUrl = URL.createObjectURL(blob);

    var save = document.createElement('a');
    save.style.marginLeft ="-80px";
    save.style.marginTop ="10px";
    save.style.color ="white";
    save.href = blobUrl;
    save.download = blobname;
    save.innerHTML="[download]";
    document.getElementById("userIcon").insertBefore(save,document.getElementById("userIcon").firstChild);
    save.addEventListener("click",()=>{
        save.remove();
    });

}

