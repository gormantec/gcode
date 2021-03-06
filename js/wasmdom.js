/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 642:
/***/ ((module) => {

var objects = [];
var getPointer = function (object) {
  if(!object) throw "undefined object!";
  var index = objects.findIndex(item => item.object === object);
  if (index < 0) {
    var d=parseInt((Date.now())/60000);
    var r=parseInt(Math.random() * 2000000000);
    var id = d + r;
    objects.push({id:id,object:object});
    index = objects.length-1;
  }
  return objects[index].id;
};

var getObject = function (pointer) {
  var i = objects.findIndex(item => item.id == pointer);
  if(objects[i])return objects[i].object;
  else{
    console.log("Could not find pointer="+pointer+ " at "+ i + " in "+objects);
    return null;
  }
};

var removeObject = function (pointer) {
  var i = objects.findIndex(item => item.id == pointer);
  objects.splice(i, 1);
};

// only include _fetch if this is in NODE
function init(window,_fetch,_Response) {
  if(_fetch)fetch=_fetch;
  if(_Response)Response=_Response;
  
  var _wasm={};
  var _wp=getPointer(window);
  var _dp=getPointer(window.document);
  var _ep=getPointer(window.document.documentElement);
  var _hp=getPointer(window.document.head);
  var _bp=getPointer(window.document.body);
  return {
    get wasm(){
      return _wasm;},
    set wasm(w){
      _wasm=w;
    },
    imports:{
    wasmdom: {
      getWindow: ()=>{
        return _wp;
      },
      getWindowLocationSearch: ()=>{
        var ptr=_wasm.__retain(_wasm.__newString(window.location.search));
        //setTimeout(()=>{_wasm.__release(ptr);},10000);
        return ptr;
      },
      getTimezoneOffset: ()=>{
        return new Date().getTimezoneOffset();
      },
      getDocument: ()=>{
        return _dp;
      },
      getDocumentElement: ()=>{
        return _ep;
      },
      getBody: (parent)=>{
        return _bp;
      },
      getHead: (parent)=>{
        return _hp;
      },
      createElement: (name)=>{
        var sname=_wasm.__getString(name);
        var e = window.document.createElement(sname);
        return getPointer(e);
      },
      nodeName: (parent)=>{
        var e=getObject(parent);
        var n = "";
        if(e && e.nodeName)n=e.nodeName;
        var ptr=_wasm.__retain(_wasm.__newString(n));
        //setTimeout(()=>{_wasm.__release(ptr);},10000);
        return ptr;
      },
      setTimeout: (guid,duration)=>{
        setTimeout(function(){
          _wasm.__alertTimeout(guid);
        },duration);
        return 0;
      },
      appendChild: (parent, child)=>{
        var childo=getObject(child);
        getObject(parent).appendChild(childo);
      },
      setAttribute: (parent, name, value)=>{
        getObject(parent).setAttribute(_wasm.__getString(name), _wasm.__getString(value));
      },
      setInnerText: (parent, value)=>{
        getObject(parent).innerText = _wasm.__getString(value);
      },
      getInnerText: (e)=>{
        var ptr=_wasm.__retain(_wasm.__newString(getObject(e).innerText));
        //setTimeout(()=>{_wasm.__release(ptr);},10000);
        return ptr;
      },
      getAttribute: (parent, name)=>{
        var st=(getObject(parent).getAttribute(_wasm.__getString(name)));
        if(!st)st="[#WASMDOM:null]";
        var ptr=_wasm.__retain(_wasm.__newString(st));
        //setTimeout(()=>{_wasm.__release(ptr);},10000);
        return ptr
      },
      consoleLog: message => {
        console.log("%c[AS] "+_wasm.__getString(message),"color: #008800");
      }
      ,setInnerHTML: (e,st)=>{
        getObject(e).innerHTML = _wasm.__getString(st);
      }
      ,getInnerHTML: (e)=>{
        var ptr=_wasm.__retain(_wasm.__newString(getObject(e).innerHTML));
        //setTimeout(()=>{_wasm.__release(ptr);},10000);
        return ptr;
      }
      ,setAccessKey: (e,key)=>{
        getObject(e).accessKey = _wasm.__getString(key);
      }
      ,getAccessKey: (e)=>{
        var ptr=_wasm.__retain(_wasm.__newString(getObject(e).accessKey));
        //setTimeout(()=>{_wasm.__release(ptr);},10000);
        return ptr;
      }
      ,children: (e)=>{
        var c=getObject(e).children;
        var ar=[];
        for(var i=0;i<c.length;i++)
        {
          ar.push(getPointer(c[i]));
        }

        var ptr=_wasm.__retain(_wasm.__newArray(_wasm.Int32Array_ID,ar));
        //setTimeout(()=>{_wasm.__release(ptr);},10000);
        return ptr;//new Float64Array(ar);
      }
      ,querySelector: (e,st)=>{
        var ss=_wasm.__getString(st);
        var result=getObject(e).querySelector(ss);
        if(!result) return -1;
        else return getPointer(result);
      }
      ,querySelectorAll: (e,q)=>{
        var result=getObject(e).querySelectorAll(_wasm.__getString(st));
        var ar=[];
        for(var i=0;i<c.length;i++)
        {
          ar.push(getPointer(c[i]));
        }
        return ar;
      }
      ,remove: (e)=>{
        getObject(e).remove();
        removeObject(e);
      }
      ,removeChild: (e,c)=>{
        getObject(e).removeChild(getObject(c));
        removeObject(c);
      }
      ,insertBefore: (p,n,e)=>{
        getObject(p).insertBefore(getObject(n),e>-1?getObject(e):null);
      }
      ,addEventListener: (p,ss)=>{
        var st=_wasm.__getString(ss);
        getObject(p).addEventListener(st,()=>{
          _wasm.__alertEventListener(p,_wasm.__newString(st));
        });
      }
      ,setStyleProperty: (p,name,value)=>{
        var pName=_wasm.__getString(name);
        var pvalue=_wasm.__getString(value);
        getObject(p).style.setProperty(_wasm.__getString(name),_wasm.__getString(value));
      }
      ,getStyleProperty: (p,name)=>{
        var pName=_wasm.__getString(name);
        var ptr=_wasm.__retain(_wasm.__newString(getObject(p).style.getPropertyValue(pName)));
        //setTimeout(()=>{_wasm.__release(ptr);},10000);
        return ptr;
      },
      getResponseText: (p)=>{
        var r=getObject(p);
        if(r instanceof Response){
          var textPromise = getObject(p).text();
          return getPointer(textPromise);
        }
        else return -1;
      },
      getResponseJSON: (p)=>{
        var r=getObject(p);
        if(r instanceof Response){
          var textPromise = getObject(p).text();
          return getPointer(textPromise);
        }
        else return -1;
      },
      fetch: (uri)=>
      {
        var p= getPointer(fetch(_wasm.__getString(uri)));
        return p;
      },
      then: (p)=>
      {
        var promise= getObject(p);
        promise.then((res)=>{
          if(res instanceof Response)
          {
            var r= getPointer(res);
            _wasm.__alertPromise(p,r);
          }
          else {
            _wasm.__alertPromiseText(p,_wasm.__retain(_wasm.__newString(res.toString())));
          }
        });
      }

    }
  }
  };
}

module.exports.init=init;

/***/ }),

/***/ 745:
/***/ ((module, exports) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// GENERATED FILE. DO NOT EDIT.
var loader = (function(exports) {
  "use strict";
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.instantiate = instantiate;
  exports.instantiateSync = instantiateSync;
  exports.instantiateStreaming = instantiateStreaming;
  exports.demangle = demangle;
  exports.default = void 0;
  // Runtime header offsets
  const ID_OFFSET = -8;
  const SIZE_OFFSET = -4; // Runtime ids
  
  const ARRAYBUFFER_ID = 0;
  const STRING_ID = 1; // const ARRAYBUFFERVIEW_ID = 2;
  // Runtime type information
  
  const ARRAYBUFFERVIEW = 1 << 0;
  const ARRAY = 1 << 1;
  const STATICARRAY = 1 << 2; // const SET = 1 << 3;
  // const MAP = 1 << 4;
  
  const VAL_ALIGN_OFFSET = 6; // const VAL_ALIGN = 1 << VAL_ALIGN_OFFSET;
  
  const VAL_SIGNED = 1 << 11;
  const VAL_FLOAT = 1 << 12; // const VAL_NULLABLE = 1 << 13;
  
  const VAL_MANAGED = 1 << 14; // const KEY_ALIGN_OFFSET = 15;
  // const KEY_ALIGN = 1 << KEY_ALIGN_OFFSET;
  // const KEY_SIGNED = 1 << 20;
  // const KEY_FLOAT = 1 << 21;
  // const KEY_NULLABLE = 1 << 22;
  // const KEY_MANAGED = 1 << 23;
  // Array(BufferView) layout
  
  const ARRAYBUFFERVIEW_BUFFER_OFFSET = 0;
  const ARRAYBUFFERVIEW_DATASTART_OFFSET = 4;
  const ARRAYBUFFERVIEW_DATALENGTH_OFFSET = 8;
  const ARRAYBUFFERVIEW_SIZE = 12;
  const ARRAY_LENGTH_OFFSET = 12;
  const ARRAY_SIZE = 16;
  const BIGINT = typeof BigUint64Array !== "undefined";
  const THIS = Symbol();
  const STRING_DECODE_THRESHOLD = 32;
  const decoder = new TextDecoder("utf-16le");
  /** Gets a string from an U32 and an U16 view on a memory. */
  
  function getStringImpl(buffer, ptr) {
    const len = new Uint32Array(buffer)[ptr + SIZE_OFFSET >>> 2] >>> 1;
    const arr = new Uint16Array(buffer, ptr, len);
  
    if (len <= STRING_DECODE_THRESHOLD) {
      return String.fromCharCode.apply(String, arr);
    }
  
    return decoder.decode(arr);
  }
  /** Prepares the base module prior to instantiation. */
  
  
  function preInstantiate(imports) {
    const extendedExports = {};
  
    function getString(memory, ptr) {
      if (!memory) return "<yet unknown>";
      return getStringImpl(memory.buffer, ptr);
    } // add common imports used by stdlib for convenience
  
  
    const env = imports.env = imports.env || {};
  
    env.abort = env.abort || function abort(msg, file, line, colm) {
      const memory = extendedExports.memory || env.memory; // prefer exported, otherwise try imported
  
      throw Error(`abort: ${getString(memory, msg)} at ${getString(memory, file)}:${line}:${colm}`);
    };
  
    env.trace = env.trace || function trace(msg, n, ...args) {
      const memory = extendedExports.memory || env.memory;
      console.log(`trace: ${getString(memory, msg)}${n ? " " : ""}${args.slice(0, n).join(", ")}`);
    };
  
    env.seed = env.seed || Date.now;
    imports.Math = imports.Math || Math;
    imports.Date = imports.Date || Date;
    return extendedExports;
  }
  /** Prepares the final module once instantiation is complete. */
  
  
  function postInstantiate(extendedExports, instance) {
    const exports = instance.exports;
    const memory = exports.memory;
    const table = exports.table;
    const new_ = exports["__new"];
    const retain = exports["__retain"];
    const rttiBase = exports["__rtti_base"] || ~0; // oob if not present
  
    /** Gets the runtime type info for the given id. */
  
    function getInfo(id) {
      const U32 = new Uint32Array(memory.buffer);
      const count = U32[rttiBase >>> 2];
      if ((id >>>= 0) >= count) throw Error(`invalid id: ${id}`);
      return U32[(rttiBase + 4 >>> 2) + id * 2];
    }
    /** Gets and validate runtime type info for the given id for array like objects */
  
  
    function getArrayInfo(id) {
      const info = getInfo(id);
      if (!(info & (ARRAYBUFFERVIEW | ARRAY | STATICARRAY))) throw Error(`not an array: ${id}, flags=${info}`);
      return info;
    }
    /** Gets the runtime base id for the given id. */
  
  
    function getBase(id) {
      const U32 = new Uint32Array(memory.buffer);
      const count = U32[rttiBase >>> 2];
      if ((id >>>= 0) >= count) throw Error(`invalid id: ${id}`);
      return U32[(rttiBase + 4 >>> 2) + id * 2 + 1];
    }
    /** Gets the runtime alignment of a collection's values. */
  
  
    function getValueAlign(info) {
      return 31 - Math.clz32(info >>> VAL_ALIGN_OFFSET & 31); // -1 if none
    }
    /** Gets the runtime alignment of a collection's keys. */
    // function getKeyAlign(info) {
    //   return 31 - Math.clz32((info >>> KEY_ALIGN_OFFSET) & 31); // -1 if none
    // }
  
    /** Allocates a new string in the module's memory and returns its retained pointer. */
  
  
    function __newString(str) {
      const length = str.length;
      const ptr = new_(length << 1, STRING_ID);
      const U16 = new Uint16Array(memory.buffer);
  
      for (var i = 0, p = ptr >>> 1; i < length; ++i) U16[p + i] = str.charCodeAt(i);
  
      return ptr;
    }
  
    extendedExports.__newString = __newString;
    /** Reads a string from the module's memory by its pointer. */
  
    function __getString(ptr) {
      const buffer = memory.buffer;
      const id = new Uint32Array(buffer)[ptr + ID_OFFSET >>> 2];
      if (id !== STRING_ID) throw Error(`not a string: ${ptr}`);
      return getStringImpl(buffer, ptr);
    }
  
    extendedExports.__getString = __getString;
    /** Gets the view matching the specified alignment, signedness and floatness. */
  
    function getView(alignLog2, signed, float) {
      const buffer = memory.buffer;
  
      if (float) {
        switch (alignLog2) {
          case 2:
            return new Float32Array(buffer);
  
          case 3:
            return new Float64Array(buffer);
        }
      } else {
        switch (alignLog2) {
          case 0:
            return new (signed ? Int8Array : Uint8Array)(buffer);
  
          case 1:
            return new (signed ? Int16Array : Uint16Array)(buffer);
  
          case 2:
            return new (signed ? Int32Array : Uint32Array)(buffer);
  
          case 3:
            return new (signed ? BigInt64Array : BigUint64Array)(buffer);
        }
      }
  
      throw Error(`unsupported align: ${alignLog2}`);
    }
    /** Allocates a new array in the module's memory and returns its retained pointer. */
  
  
    function __newArray(id, values) {
      const info = getArrayInfo(id);
      const align = getValueAlign(info);
      const length = values.length;
      const buf = new_(length << align, info & STATICARRAY ? id : ARRAYBUFFER_ID);
      let result;
  
      if (info & STATICARRAY) {
        result = buf;
      } else {
        const arr = new_(info & ARRAY ? ARRAY_SIZE : ARRAYBUFFERVIEW_SIZE, id);
        const U32 = new Uint32Array(memory.buffer);
        U32[arr + ARRAYBUFFERVIEW_BUFFER_OFFSET >>> 2] = retain(buf);
        U32[arr + ARRAYBUFFERVIEW_DATASTART_OFFSET >>> 2] = buf;
        U32[arr + ARRAYBUFFERVIEW_DATALENGTH_OFFSET >>> 2] = length << align;
        if (info & ARRAY) U32[arr + ARRAY_LENGTH_OFFSET >>> 2] = length;
        result = arr;
      }
  
      const view = getView(align, info & VAL_SIGNED, info & VAL_FLOAT);
  
      if (info & VAL_MANAGED) {
        for (let i = 0; i < length; ++i) view[(buf >>> align) + i] = retain(values[i]);
      } else {
        view.set(values, buf >>> align);
      }
  
      return result;
    }
  
    extendedExports.__newArray = __newArray;
    /** Gets a live view on an array's values in the module's memory. Infers the array type from RTTI. */
  
    function __getArrayView(arr) {
      const U32 = new Uint32Array(memory.buffer);
      const id = U32[arr + ID_OFFSET >>> 2];
      const info = getArrayInfo(id);
      const align = getValueAlign(info);
      let buf = info & STATICARRAY ? arr : U32[arr + ARRAYBUFFERVIEW_DATASTART_OFFSET >>> 2];
      const length = info & ARRAY ? U32[arr + ARRAY_LENGTH_OFFSET >>> 2] : U32[buf + SIZE_OFFSET >>> 2] >>> align;
      return getView(align, info & VAL_SIGNED, info & VAL_FLOAT).subarray(buf >>>= align, buf + length);
    }
  
    extendedExports.__getArrayView = __getArrayView;
    /** Copies an array's values from the module's memory. Infers the array type from RTTI. */
  
    function __getArray(arr) {
      const input = __getArrayView(arr);
  
      const len = input.length;
      const out = new Array(len);
  
      for (let i = 0; i < len; i++) out[i] = input[i];
  
      return out;
    }
  
    extendedExports.__getArray = __getArray;
    /** Copies an ArrayBuffer's value from the module's memory. */
  
    function __getArrayBuffer(ptr) {
      const buffer = memory.buffer;
      const length = new Uint32Array(buffer)[ptr + SIZE_OFFSET >>> 2];
      return buffer.slice(ptr, ptr + length);
    }
  
    extendedExports.__getArrayBuffer = __getArrayBuffer;
    /** Copies a typed array's values from the module's memory. */
  
    function getTypedArray(Type, alignLog2, ptr) {
      return new Type(getTypedArrayView(Type, alignLog2, ptr));
    }
    /** Gets a live view on a typed array's values in the module's memory. */
  
  
    function getTypedArrayView(Type, alignLog2, ptr) {
      const buffer = memory.buffer;
      const U32 = new Uint32Array(buffer);
      const bufPtr = U32[ptr + ARRAYBUFFERVIEW_DATASTART_OFFSET >>> 2];
      return new Type(buffer, bufPtr, U32[bufPtr + SIZE_OFFSET >>> 2] >>> alignLog2);
    }
    /** Attach a set of get TypedArray and View functions to the exports. */
  
  
    function attachTypedArrayFunctions(ctor, name, align) {
      extendedExports[`__get${name}`] = getTypedArray.bind(null, ctor, align);
      extendedExports[`__get${name}View`] = getTypedArrayView.bind(null, ctor, align);
    }
  
    [Int8Array, Uint8Array, Uint8ClampedArray, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array].forEach(ctor => {
      attachTypedArrayFunctions(ctor, ctor.name, 31 - Math.clz32(ctor.BYTES_PER_ELEMENT));
    });
  
    if (BIGINT) {
      [BigUint64Array, BigInt64Array].forEach(ctor => {
        attachTypedArrayFunctions(ctor, ctor.name.slice(3), 3);
      });
    }
    /** Tests whether an object is an instance of the class represented by the specified base id. */
  
  
    function __instanceof(ptr, baseId) {
      const U32 = new Uint32Array(memory.buffer);
      let id = U32[ptr + ID_OFFSET >>> 2];
  
      if (id <= U32[rttiBase >>> 2]) {
        do {
          if (id == baseId) return true;
          id = getBase(id);
        } while (id);
      }
  
      return false;
    }
  
    extendedExports.__instanceof = __instanceof; // Pull basic exports to extendedExports so code in preInstantiate can use them
  
    extendedExports.memory = extendedExports.memory || memory;
    extendedExports.table = extendedExports.table || table; // Demangle exports and provide the usual utility on the prototype
  
    return demangle(exports, extendedExports);
  }
  
  function isResponse(src) {
    return typeof Response !== "undefined" && src instanceof Response;
  }
  
  function isModule(src) {
    return src instanceof WebAssembly.Module;
  }
  /** Asynchronously instantiates an AssemblyScript module from anything that can be instantiated. */
  
  
  async function instantiate(source, imports = {}) {
    if (isResponse(source = await source)) return instantiateStreaming(source, imports);
    const module = isModule(source) ? source : await WebAssembly.compile(source);
    const extended = preInstantiate(imports);
    const instance = await WebAssembly.instantiate(module, imports);
    const exports = postInstantiate(extended, instance);
    return {
      module,
      instance,
      exports
    };
  }
  /** Synchronously instantiates an AssemblyScript module from a WebAssembly.Module or binary buffer. */
  
  
  function instantiateSync(source, imports = {}) {
    const module = isModule(source) ? source : new WebAssembly.Module(source);
    const extended = preInstantiate(imports);
    const instance = new WebAssembly.Instance(module, imports);
    const exports = postInstantiate(extended, instance);
    return {
      module,
      instance,
      exports
    };
  }
  /** Asynchronously instantiates an AssemblyScript module from a response, i.e. as obtained by `fetch`. */
  
  
  async function instantiateStreaming(source, imports = {}) {
    if (!WebAssembly.instantiateStreaming) {
      return instantiate(isResponse(source = await source) ? source.arrayBuffer() : source, imports);
    }
  
    const extended = preInstantiate(imports);
    const result = await WebAssembly.instantiateStreaming(source, imports);
    const exports = postInstantiate(extended, result.instance);
    return { ...result,
      exports
    };
  }
  /** Demangles an AssemblyScript module's exports to a friendly object structure. */
  
  
  function demangle(exports, extendedExports = {}) {
    extendedExports = Object.create(extendedExports);
    const setArgumentsLength = exports["__argumentsLength"] ? length => {
      exports["__argumentsLength"].value = length;
    } : exports["__setArgumentsLength"] || exports["__setargc"] || (() => {
      /* nop */
    });
  
    for (let internalName in exports) {
      if (!Object.prototype.hasOwnProperty.call(exports, internalName)) continue;
      const elem = exports[internalName];
      let parts = internalName.split(".");
      let curr = extendedExports;
  
      while (parts.length > 1) {
        let part = parts.shift();
        if (!Object.prototype.hasOwnProperty.call(curr, part)) curr[part] = {};
        curr = curr[part];
      }
  
      let name = parts[0];
      let hash = name.indexOf("#");
  
      if (hash >= 0) {
        const className = name.substring(0, hash);
        const classElem = curr[className];
  
        if (typeof classElem === "undefined" || !classElem.prototype) {
          const ctor = function (...args) {
            return ctor.wrap(ctor.prototype.constructor(0, ...args));
          };
  
          ctor.prototype = {
            valueOf() {
              return this[THIS];
            }
  
          };
  
          ctor.wrap = function (thisValue) {
            return Object.create(ctor.prototype, {
              [THIS]: {
                value: thisValue,
                writable: false
              }
            });
          };
  
          if (classElem) Object.getOwnPropertyNames(classElem).forEach(name => Object.defineProperty(ctor, name, Object.getOwnPropertyDescriptor(classElem, name)));
          curr[className] = ctor;
        }
  
        name = name.substring(hash + 1);
        curr = curr[className].prototype;
  
        if (/^(get|set):/.test(name)) {
          if (!Object.prototype.hasOwnProperty.call(curr, name = name.substring(4))) {
            let getter = exports[internalName.replace("set:", "get:")];
            let setter = exports[internalName.replace("get:", "set:")];
            Object.defineProperty(curr, name, {
              get() {
                return getter(this[THIS]);
              },
  
              set(value) {
                setter(this[THIS], value);
              },
  
              enumerable: true
            });
          }
        } else {
          if (name === 'constructor') {
            (curr[name] = (...args) => {
              setArgumentsLength(args.length);
              return elem(...args);
            }).original = elem;
          } else {
            // instance method
            (curr[name] = function (...args) {
              // !
              setArgumentsLength(args.length);
              return elem(this[THIS], ...args);
            }).original = elem;
          }
        }
      } else {
        if (/^(get|set):/.test(name)) {
          if (!Object.prototype.hasOwnProperty.call(curr, name = name.substring(4))) {
            Object.defineProperty(curr, name, {
              get: exports[internalName.replace("set:", "get:")],
              set: exports[internalName.replace("get:", "set:")],
              enumerable: true
            });
          }
        } else if (typeof elem === "function" && elem !== setArgumentsLength) {
          (curr[name] = (...args) => {
            setArgumentsLength(args.length);
            return elem(...args);
          }).original = elem;
        } else {
          curr[name] = elem;
        }
      }
    }
  
    return extendedExports;
  }
  
  var _default = {
    instantiate,
    instantiateSync,
    instantiateStreaming,
    demangle
  };
  exports.default = _default;
  return exports;
})({});
if (true) !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function() { return loader; }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
else {}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
(() => {
const loader = __webpack_require__(745);
const importObject = __webpack_require__(642).init(window);
var doFetch=true;
var wasmdomFile="https://gcode.com.au/modules/wasmdom.wasm";
if(window.location.hostname.indexOf("localhost")>=0)wasmdomFile="/wasmdom.wasm";
if(window.wasmdomUint8Array instanceof Uint8Array){wasmdomFile=window.wasmdomUint8Array;doFetch=false;console.log("found Uint8Array");}
else if(window.wasmdomURL && window.wasmdomURL.length>0){wasmdomFile=window.wasmdomURL;console.log("found wasmdomURL");}
loader.instantiate(doFetch?fetch(wasmdomFile):wasmdomFile, importObject.imports).then(({module, instance, exports}) =>{
    if(exports["__retain"] && exports["__newArray"] && exports["__newString"] && exports["show"])
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


})();

/******/ })()
;