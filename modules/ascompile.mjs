export function run(sourceCode,mainFilename,editorFilename,outputFilename,callback){

    try {
                
        var tryCount=0;
        var dataURL=null;
        var _run = async function () {
            var failed=false;
            var downloading=0;
            require(["https://cdn.jsdelivr.net/npm/assemblyscript@latest/dist/sdk.js"], ({ asc }) => {
                asc.ready.then(() => {
                    const stdout = asc.createMemoryStream();
                    const stderr = asc.createMemoryStream();
                    asc.main([
                        mainFilename,
                        "-O3",
                        "--runtime", "full",
                        "--binaryFile", outputFilename
                    ], {
                        stdout,
                        stderr,
                        readFile(name, baseDir) {
                            if (name == editorFilename || (name.indexOf("wasmdom/")>=0 && name.endsWith(editorFilename))) {
                                //console.log("Got App:" + name);
                                return sourceCode;
                            }
                            else if(name.endsWith("asconfig.json"))
                            {
                                console.log("got "+name);
                                return '{\n' +
                                '    "targets": {\n' +
                                '      "release": {\n' +
                                '        "optimizeLevel": 3,\n' +
                                '        "shrinkLevel": 3\n' +
                                '      },\n' +
                                '      "debug": {\n' +
                                '        "debug": true\n' +
                                '      }\n' +
                                '    },\n' +
                                '    "options": {\n' +
                                '      "runtime": "none",\n' +
                                '      "transform": ["visitor-as/dist/examples/includeBytesTransform.js", "near-sdk-bindgen", "visitor-as/dist/examples/exportAs.js"]\n'+
                                '    },\n' +
                                '   "entries": ["./assembly/bindgen.ts"]\n' +
                                  '}\n';
                            }
                            else if (name.indexOf("node_modules/")>=0) {
                                var pos=name.lastIndexOf("node_modules/") +13;
                                var _name = name;
                                var b64 = localStorage.getItem("dist/" + _name.substring(pos));
                                var cached = null;
                                if (b64) {
                                    cached = atob(b64);
                                    return cached;
                                }
                                else if (b64=="NA") {
                                    return null;
                                }
                                else {
                                    downloading++;
                                    fetch("https://gcode.com.au/dist/" + _name.substring(pos))
                                        .then(response =>response.ok?response.text():null)
                                        .then(text => {
                                            if(text)
                                            {
                                                if(!failed)window.setTimeout(_run,2000);
                                                failed=true;
                                                localStorage.setItem("dist/" + _name.substring(pos), btoa(text));
                                            }
                                            else{
                                                localStorage.setItem("dist/" + _name.substring(pos), "NA");
                                            }
                                        }).catch((error) => { console.log("fetch error:" + error); })
                                        .finally(()=>{
                                            downloading--;
                                        });
                                    return null;
                                }
                                
                            }
                            else {
                                return null;
                            }

                        },
                        writeFile(name, data, baseDir) {

                            if (typeof data == "object" && name == outputFilename && !failed) {
                                const reader = new FileReader();
                                dataURL="reading";
                                reader.addEventListener("load", function () {
                                    dataURL = reader.result;
                                }, false);
                                reader.readAsDataURL(new Blob([Uint8Array.from(data)], { type: 'application/wasm' }));
                            }
                        },
                        listFiles(dirname, baseDir) {
                            console.log(`>>> listFiles: baseDir=${baseDir} dirname = ${dirname} `);
                            return [];
                        }
                    }, err => {
                        var waitForDownload=function(thenDo){
                            if(downloading==0)thenDo();
                            else{
                                window.setTimeout(()=>{
                                    waitForDownload(thenDo);
                                },500);
                            }
                        };
                        waitForDownload(()=>{
                            if(failed)
                            {
                                if(tryCount>0)
                                {
                                    console.log("\b..");
                                }
                                else{
                                    console.log("downloading depenadnt files..");
                                }
                                tryCount++;

                            }
                            else{

                                    if(stdout.toString().trim()!="")console.log(`>>> STDOUT >>>\n${stdout.toString()}`);
                                    if(stderr.toString().trim()!="")console.log(`>>> STDERR >>>\n${stderr.toString()}`);
                                    if (err) {
                                        console.log(">>> ERROR THROWN >>>");
                                        console.log(err);
                                        callback(err);
                                    }
                                    else {
                                        console.log("Compiled Ok");
                                        var readTryCount=0;
                                        var waitRead=()=>{
                                            if(dataURL=="reading" || (dataURL==null && readTryCount<10))
                                            {
                                                if(readTryCount==0)console.log("reading file..");
                                                else console.log("\b..");
                                                readTryCount++;
                                                setTimeout(waitRead,500);
                                            }
                                            else{
                                                callback(null,{"dataURL":dataURL});
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
    catch (e) { console.log(e); }
}