
import * as jsdom from "../wasmdom";
import { Document, Console } from "./document";
import { Element, Callback } from "./element";
import { Debug } from "./debug";
import { Promise } from "./promise";

export class Window {
    document: Document;
    pointer: i32;
    guids: Callback[];
    location: Location;
    PWA: PWAGlobals;
    console: Console;
    static _window: Window;

    constructor() {

        Debug.log("new Window(0)");
        this.document = new Document();
        Debug.log("new Window(1)");
        this.console = new Console();
        Debug.log("new Window(2)");
        this.pointer = jsdom.getWindow();
        Debug.log("new Window(3)");
        this.guids = [];
        Debug.log("new Window(4)");
        this.location = new Location();
        Debug.log("new Window(5)");
        this.PWA = new PWAGlobals();
        Debug.log("new Window(6)");
        Window._window = this;
    }

    static get window(): Window {
        if (!Window._window) {
            Window._window = new Window();
            return Window._window;
        }
        else {
            return Window._window;
        }

    }
    static set window(win: Window) {
        Window._window = win;
    }

    public alertEventListener(p: i32, s: string): i32 {

        var e: Element | null = Element.fromPointer(p);
        if (e != null) {
            e.alertEventListener(s);
        }
        return 0;
    }
    public setTimeout(callback: () => void, duration: i32): void {
        var _callback = new Callback(callback);
        this.guids.push(_callback);
        jsdom.setTimeout(_callback.guid, duration);
    }
    public alertTimeout(guid: i32): void {
        var index = -1;
        for (var i = 0; i < this.guids.length && index < 0; i++) {
            if (this.guids[i].guid == guid) index = i;
        }
        if (index >= 0) {
            this.guids[index].callback();
            this.guids.splice(index, 1);
        }
    }
    public fetch(uri:string,method:string,headers:string,body:string):Promise
    {        
        var p:i32 = jsdom.fetch(uri,method,headers,body);
        var pr:Promise = new Promise(p);
        return pr;
    }

    public alertPromise(p:i32,r:i32):void
    {
        
    }
}

class Location {
    public get search(): string
    {
        Debug.log("------------------->Location.search");
        var s:string=jsdom.getWindowLocationSearch();
        Debug.log("------------------->Location.search="+s);
        return s;
    }
}

class PWAGlobals {
    globals: Globals;
    constructor() {
        this.globals = new Globals();
    }
}

class Globals {
    splashColor: string | null;
    icon180x180: string | null;
    splashDuration: string | null;
}


export function setTimeout(callback: () => void, duration: i32): void {
    if (Window.window) Window.window.setTimeout(callback, duration);
}

export function fetch(uri:string,method:string,headers:string,body:string):Promise
{
    if(Window.window)
    {
        var prom:Promise=Window.window.fetch(uri,method,headers,body);
        return prom;
    }
    else{
        return new Promise();
    }
}