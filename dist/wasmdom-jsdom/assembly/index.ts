// The entry file of your WebAssembly module.
import { Window, Document, Console } from "wasmdom"; 
import { Debug,Promise,Response,JSContract, JSObject } from "wasmdom-globals";
import { run } from "./src/app";
import * as jsdom from "./wasmdom-jsdom";

var window: Window;
var document: Document;
var console: Console;

function show(): i32 {
  window = new Window();
  document = window.document;
  console = window.console;
  run(window,document,console);
  return 0;
}

function __alertEventListener(p: i32, s: string): i32 {
  window.alertEventListener(p, s);
  return 0;
}
function __alertTimeout(guid: i32): i32 {
  window.alertTimeout(guid);
  return 0;
}

function __alertPromise(p: i32,r: i32):i32{
  Promise.fromPointer(p).alertResponse(new Response(r));
  return 0;
}
function __alertPromiseJSContract(p: i32,r: i32,accountId:string,contractId:string):i32{
  Promise.fromPointer(p).alertJSContract(new JSContract(r,p,accountId,contractId));
  return 0;
}

function __alertPromiseJSObject(p: i32,r: i32,s:string):i32{
  Promise.fromPointer(p).alertJSObject(new JSObject(r,p,s));
  return 0;
}



function __alertPromiseText(p: i32,r: string):i32{
  Promise.fromPointer(p).alertResponseText(r);
  return 0;
}

const Int32Array_ID = idof<Int32Array>()


export {show,__alertEventListener,__alertTimeout,__alertPromise,__alertPromiseText,__alertPromiseJSContract,__alertPromiseJSObject,Int32Array_ID,jsdom};
