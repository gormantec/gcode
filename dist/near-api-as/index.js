import { readFileSync } from "fs";
import { instantiateSync } from "@assemblyscript/loader";
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

var _dp=1;
var _ep=2;
var getObject=()=>{return null}
var _wasm={};

const imports = { 
    "wasi_snapshot_preview1":{
        fd_write:()=>{console.log("y");},
        proc_exit:()=>{console.log("x");}
    },      
    "near-api-as": {
        consoleLog: message => {
            console.log("%c[AS] "+message,"color: #008800");
          }
 },"wasmdom-jsdom": {
    getWindow: () => {
        return _wp;
    },
    getWindowLocationSearch: () => {
        var ptr = _wasm.__pin(_wasm.__newString(window.location.search));
        //setTimeout(()=>{_wasm.__unpin(ptr);},10000);
        return ptr;
    },
    getTimezoneOffset: () => {
        return new Date().getTimezoneOffset();
    },
    getDocument: () => {
        return _dp;
    },
    getDocumentElement: () => {
        return _ep;
    },
    getBody: (parent) => {
        return _bp;
    },
    templateContent: (parent) => {
        return _bp;
    },
    getHead: (parent) => {
        return _hp;
    },
    createElement: (name) => {
        var sname = _wasm.__getString(name);
        var e = window.document.createElement(sname);
        return getPointer(e);
    },
    nodeName: (parent) => {
        var e = getObject(parent);
        var n = "";
        if (e && e.nodeName) n = e.nodeName;
        var ptr = _wasm.__pin(_wasm.__newString(n));
        //setTimeout(()=>{_wasm.__unpin(ptr);},10000);
        return ptr;
    },
    setTimeout: (guid, duration) => {
        setTimeout(function () {
            _wasm.__alertTimeout(guid);
        }, duration);
        return 0;
    },
    appendChild: (parent, child) => {
        var childo = getObject(child);
        getObject(parent).appendChild(childo);
    },
    setAttribute: (parent, name, value) => {
        getObject(parent).setAttribute(_wasm.__getString(name), _wasm.__getString(value));
    },
    setInnerText: (parent, value) => {
        getObject(parent).innerText = _wasm.__getString(value);
    },
    getInnerText: (e) => {
        var ptr = _wasm.__pin(_wasm.__newString(getObject(e).innerText));
        //setTimeout(()=>{_wasm.__unpin(ptr);},10000);
        return ptr;
    },
    getAttribute: (parent, name) => {
        var st = (getObject(parent).getAttribute(_wasm.__getString(name)));
        if (!st) st = "[#WASMDOM:null]";
        var ptr = _wasm.__pin(_wasm.__newString(st));
        //setTimeout(()=>{_wasm.__unpin(ptr);},10000);
        return ptr
    },
    consoleLog: message => {
        console.log("%c[AS] " + _wasm.__getString(message), "color: #008800");
    }
    , setInnerHTML: (e, st) => {
        getObject(e).innerHTML = _wasm.__getString(st);
    }
    , getInnerHTML: (e) => {
        var ptr = _wasm.__pin(_wasm.__newString(getObject(e).innerHTML));
        //setTimeout(()=>{_wasm.__unpin(ptr);},10000);
        return ptr;
    }
    , setAccessKey: (e, key) => {
        getObject(e).accessKey = _wasm.__getString(key);
    }
    , getAccessKey: (e) => {
        var ptr = _wasm.__pin(_wasm.__newString(getObject(e).accessKey));
        //setTimeout(()=>{_wasm.__unpin(ptr);},10000);
        return ptr;
    }
    , children: (e) => {
        var c = getObject(e).children;
        var ar = [];
        for (var i = 0; i < c.length; i++) {
            ar.push(getPointer(c[i]));
        }

        var ptr = _wasm.__pin(_wasm.__newArray(_wasm.Int32Array_ID, ar));
        //setTimeout(()=>{_wasm.__unpin(ptr);},10000);
        return ptr;//new Float64Array(ar);
    }
    , querySelector: (e, st) => {
        var ss = _wasm.__getString(st);
        var result = getObject(e).querySelector(ss);
        if (!result) return -1;
        else return getPointer(result);
    }
    , querySelectorAll: (e, q) => {
        var result = getObject(e).querySelectorAll(_wasm.__getString(st));
        var ar = [];
        for (var i = 0; i < c.length; i++) {
            ar.push(getPointer(c[i]));
        }
        return ar;
    }
    , remove: (e) => {
        getObject(e).remove();
        removeObject(e);
    }
    , removeChild: (e, c) => {
        getObject(e).removeChild(getObject(c));
        removeObject(c);
    }
    , insertBefore: (p, n, e) => {
        getObject(p).insertBefore(getObject(n), e > -1 ? getObject(e) : null);
    }
    , addEventListener: (p, ss) => {
        var st = _wasm.__getString(ss);
        getObject(p).addEventListener(st, () => {
            _wasm.__alertEventListener(p, _wasm.__newString(st));
        });
    }
    , setStyleProperty: (p, name, value) => {
        var pName = _wasm.__getString(name);
        var pvalue = _wasm.__getString(value);
        getObject(p).style.setProperty(_wasm.__getString(name), _wasm.__getString(value));
    }
    , getStyleProperty: (p, name) => {
        var pName = _wasm.__getString(name);
        var ptr = _wasm.__pin(_wasm.__newString(getObject(p).style.getPropertyValue(pName)));
        //setTimeout(()=>{_wasm.__unpin(ptr);},10000);
        return ptr;
    },
    getResponseText: (p) => {
        var r = getObject(p);
        if (r instanceof Response) {
            var textPromise = getObject(p).text();
            return getPointer(textPromise);
        }
        else return -1;
    },
    getResponseJSON: (p) => {
        var r = getObject(p);
        if (r instanceof Response) {
            var textPromise = getObject(p).text();
            return getPointer(textPromise);
        }
        else return -1;
    },
    newPromise: (s)=>{
      const str=_wasm.__getString(s);
      console.log("exec1 newPromise"); 
      var p= Promise.resolve(str);
      return getPointer(p);
    },
    fetch: (uri, method, headers, body) => {
        var m = _wasm.__getString(method);
        var b = _wasm.__getString(body);
        var u = _wasm.__getString(uri);
        var h = _wasm.__getString(headers);
        if (!b || b == "" || b.trim().substring(0, 1) != "{") {
            var p = getPointer(fetch(u));

            console.log("fetch Pointer=" + p);
            return p;
        }
        else {
            var p = getPointer(fetch(u, { method: m, headers: JSON.parse(h), body: b }));

            console.log("fetch Pointer=" + p);
            return p;
        }

    },
    then: (p) => {
        var promise = getObject(p);
        promise.then((res) => {
            console.log("__alertPromise");
            console.log(res);
            if (res instanceof Response) {
                var r = getPointer(res);
                console.log("fetch Pointer=" + p + " Response=" + r);
                _wasm.__alertPromise(p, r);
            }
            else {
                console.log("fetch Pointer=" + p + " Response=" + r);
                _wasm.__alertPromiseText(p, _wasm.__pin(_wasm.__newString(res.toString())));
            }
        });
    }

}
};
const wasmModule = instantiateSync(readFileSync(__dirname + "/build/untouched.wasm"), imports);
_wasm=wasmModule.exports;
export default wasmModule.exports;
