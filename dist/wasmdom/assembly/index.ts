// The entry file of your WebAssembly module.
import { Window, Document, Debug, Console, Promise, Response } from "./dom/document";
import { run } from "./src/app";

var window: Window;
var document: Document;
var console: Console;

export function show(): i32 {
  window = new Window();
  document = window.document;
  console = window.console;
  run(window,document,console);
  return 0;
}

export function __alertEventListener(p: i32, s: string): i32 {
  Debug.log("---->" + typeof s);
  Debug.log("---->" + s);
  window.alertEventListener(p, s);
  return 0;
}
export function __alertTimeout(guid: i32): i32 {
  Debug.log("__alertTimeout" + guid.toString());
  window.alertTimeout(guid);
  return 0;
}

export function __alertPromise(p: i32,r: i32):i32{
  Promise.fromPointer(p).alertResponse(new Response(r));
  return 0;
}
export function __alertPromiseText(p: i32,r: string):i32{
  Promise.fromPointer(p).alertResponseText(r);
  return 0;
}

export const Int32Array_ID = idof<Int32Array>()
