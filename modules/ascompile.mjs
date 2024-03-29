
import { compile, login, test } from '/modules/near/index.mjs';
import { getScript } from '/modules/getScript.mjs';
import { createDownload, b64toBlob } from '/modules/createDownload.mjs';
import { parsejs } from './parsejs.mjs';
import { load, preload} from '/modules/gcodeStorage.mjs';

const getRequire = getScript('https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.6/require.min.js', ["require"]);

const ascWorker = new Worker('/modules/asc_worker.mjs');

const callBacks={};
const closeTimer = () => {
    document.querySelector("#nearDialogTimerValue").style.width = "100%";
    setTimeout(() => {
        document.querySelector("#nearDialogTimer").close();
        document.querySelector("#nearDialogTimerValue").style.width = "10%";
    }, 1000);
};

ascWorker.onmessage = function(e) {
    if(e.data.cID && callBacks[e.data.cID]!=null && e.data.error)
    {
        callBacks[e.data.cID](e.data.error);
        callBacks[e.data.cID]=null;
        closeTimer();
    }
    else if(e.data.cID && callBacks[e.data.cID]!=null)
    {
        callBacks[e.data.cID](null,e.data.data);
        callBacks[e.data.cID]=null;
        closeTimer();
    }
    else if(e.data.timerValue)
    {
        document.querySelector("#nearDialogTimerValue").style.width = e.data.timerValue;
    }
}


export function run(sourceCode, mainFilename, editorFilename, outputFilename, dapp, callback) {
    console.log("editorFilename:" + editorFilename);
    var cID="CID"+Math.floor(Math.random()*10000000000000);
    callBacks[cID]=callback;

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
            console.log("login");
            login({ accountId: accountId, contractId: contractId }).then(() => {
                console.log("logged in");
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

   
                var importsList=sourceCode.match(/import.*?\sfrom\s['"]\.\/lib\/[a-zA-Z0-9_-]*\.lib['"]/g);

                var importFiles=[];
                if(importsList && importsList.length>0)
                {
                    for(var i=0;i<importsList.length;i++)
                    {
                        var fileName=importsList[i].replace(/(import.*?\sfrom\s['"]\.\/lib\/)([a-zA-Z0-9_-]*\.lib)(['"])/g,"$2");
                        console.log("fileName: "+fileName);
                        let dir="";
                        if(editorFilename.lastIndexOf("/")>0)dir=editorFilename.substring(0,editorFilename.lastIndexOf("/")+1);
                        console.log(dir+fileName+".ts");
                        importFiles.push({name:fileName+".ts",dir:dir});
                    }
                }
                console.log(importFiles);
                preload(importFiles).then(()=>{
                    var filesArray=[{ name: "assembly/index.ts", data: sourceCode, type: "string" }];
                    for(var i=0;i<importFiles.length;i++)
                    {
                        let slib=load(importFiles[i].dir+importFiles[i].name);
                        if(slib && typeof slib=="string" && slib.length>0)
                        {
                            filesArray.push({ name: "assembly/lib/"+importFiles[i].name, data: slib, type: "string" });
                        }       
                    }
                    compile({
                        accountId: accountId,
                        contractId: contractId,
                        filesArray: filesArray
                    }).then((x) => {
    
                        document.querySelector("#nearDialogTimerValue").style.width = "95%";
                        b64toBlob(x.content, 'application/zip').then(blob => {
                            createDownload("assembly.zip", blob, { type: 'application/zip' });
                        });
                        parsejs(data,(testdata)=>{
                            test(testdata).then(()=>{callback(null, {});closeTimer();}).catch((e)=>{callback(e);closeTimer();});
                        });
                        
                    }).catch((e)=>{callback(e);closeTimer();});
                }).catch((e)=>{callback(e);closeTimer();});

            }).catch((e)=>{callback(e);closeTimer();});
        }
        else {


            document.querySelector("#nearDialogTimer").showModal();
            document.querySelector("#nearDialogTimerValue").style.width = "5%";
            setTimeout(() => { document.querySelector("#nearDialogTimerValue").style.width = "10%"; }, 4000);
            setTimeout(() => { document.querySelector("#nearDialogTimerValue").style.width = "15%"; }, 8000);

            //var tryCount = 0;//test  
            //var dataURL = null;
            //var dataBlob = null;
            ascWorker.postMessage([sourceCode,mainFilename,editorFilename,outputFilename,cID]);
            /*
            var _run = async function () {
                var failed = false;
                var downloading = 0;
                
                getRequire.then(({ require }) => {
                    
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
                                                                if (!failed) window.setTimeout(_run, 2000);
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
                                                window.setTimeout(() => {
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
                                    //console.log("asc error: " + e);
                                }
                                console.error = _errorHandle;
                            }).catch(callback);                            
                        }).catch((error) => { console.log("fetch error:" + error); callback(error);})
                    });

                    
                    callback({error:"error"});
                }).catch(callback);

            }
            _run();*/
        }
    }
    catch (e) { console.log(e); callback(e); }
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



