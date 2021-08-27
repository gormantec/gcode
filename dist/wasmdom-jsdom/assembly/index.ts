// The entry file of your WebAssembly module.
import { Window, Document, Console } from "wasmdom"; 
import { Debug,Promise,Response,JSContract } from "wasmdom-globals";
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
  //Debug.log("---->" + typeof s);
  //Debug.log("---->" + s);
  window.alertEventListener(p, s);
  return 0;
}
function __alertTimeout(guid: i32): i32 {
  //Debug.log("__alertTimeout" + guid.toString());
  window.alertTimeout(guid);
  return 0;
}

function __alertPromise(p: i32,r: i32):i32{
  //Debug.log("__alertPromise::Promise="+p.toString());
  //Debug.log("Promises="+Promise.getPromises().toString());
  Promise.fromPointer(p).alertResponse(new Response(r));
  return 0;
}
function __alertPromiseJSContract(p: i32,r: string):i32{
  Debug.log("__alertPromiseJSContract::Promise="+p.toString());
  Promise.fromPointer(p).alertResponse(new JSContract(r));
  return 0;
}

function __alertPromiseText(p: i32,r: string):i32{
  //Debug.log("Promises="+Promise.getPromises().toString());
  //Debug.log("__alertPromiseText::Promise="+p.toString());
  Promise.fromPointer(p).alertResponseText(r);
  return 0;
}

const Int32Array_ID = idof<Int32Array>()


export {show,__alertEventListener,__alertTimeout,__alertPromise,__alertPromiseText,__alertPromiseJSContract,Int32Array_ID,jsdom};
