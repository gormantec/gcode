import * as loader from "https://cdn.jsdelivr.net/npm/@assemblyscript/loader/index.js";
import {init} from './imports.js'

const importObject = init(window);
var doFetch=true;
var wasmdomFile="https://gcode.com.au/modules/wasmdom.wasm";
if(window.location.hostname.indexOf("localhost")>=0){
  wasmdomFile="/wasmdom.wasm";
  console.log("using local file");
}
else if(window.wasmdomUint8Array instanceof Uint8Array){
  wasmdomFile=window.wasmdomUint8Array;doFetch=false;
  console.log("found Uint8Array");
}
else if(window.wasmdomURL && window.wasmdomURL.length>0){
  wasmdomFile=window.wasmdomURL;
  console.log("found wasmdomURL");
}
console.log("doFetch="+doFetch);
loader.instantiate(doFetch?fetch(wasmdomFile):wasmdomFile, importObject.imports).then(({module, instance, exports}) =>{
    if(exports["__newArray"] && exports["__newString"] && exports["show"])
    {
        importObject.wasm = exports;
        exports.show();
    }
    else{
        console.log("could not find module.");
        console.log("__retain = "+exports["__retain"]);
        console.log("__newArray = "+exports["__newArray"]);
        console.log("__newString = "+exports["__newString"]);
        console.log("show = "+exports["show"]);
    }
}
);