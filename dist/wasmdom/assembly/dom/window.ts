
import * as jsdom from "../wasmdom";
import { Debug, Promise,Document, Console,Element, Callback } from "wasmdom/dom";

export class Window {
    document: Document;
    pointer: i32;
    guids: Callback[];
    location: Location;
    PWA: PWAGlobals;
    console: Console;
    static _window: Window;

    constructor() {
        this.document = new Document();
        this.console = new Console();
        this.pointer = jsdom.getWindow();
        this.guids = [];
        this.location = new Location();
        this.PWA = new PWAGlobals();
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

        Debug.log("fetch Promise====>"+p.toString());
        var pr:Promise = new Promise(p);
        Debug.log("fetch Promise=====>"+Promise.getPromises().toString());

        Promise.fromPointer(p);

        return pr;
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