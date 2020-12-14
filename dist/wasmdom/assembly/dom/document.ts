import * as jsdom from "../wasmdom";
import { Element, Callback } from "./element";
import { Debug } from "./debug";

//interface CallbackTwoParams<T1 = void, T2 = void,T3 = void> {(param1: T1,param2: T2): T3;}

class Response{
    pointer:i32;
    constructor(pointer:i32=-1) {
        this.pointer=pointer;
    }
    public text():Promise
    {
        if(this.pointer==-1)return new Promise();
        else{
            var p:i32=jsdom.getResponseText(this.pointer);
            return new Promise(p);
        }
    }
    public json():Promise
    {
        if(this.pointer==-1)return new Promise();
        else{
            var p:i32=jsdom.getResponseJSON(this.pointer);
            return new Promise(p);
        }
    }
}

type ResponseType<T> = ((r:T)=>Promise|null)|null;

class Promise{
    pointer:i32;
    func:ResponseType<Response>;
    funcText:ResponseType<string>;
    afterThen: Promise|null = null;
    static _promises:Promise[] = [];
    constructor(pointer:i32=-1) {
        this.pointer=pointer;
        Promise._promises.push(this);
    }
    public then(func:ResponseType<Response> =null,funcText:ResponseType<Response> = null):Promise
    {
        this.afterThen= new Promise();
        this.func=func;
        this.funcText=null;
        if(this.pointer>=0)jsdom.then(this.pointer);
        return <Promise>this.afterThen;
    }

    public thenString(func:ResponseType<string> = null):Promise
    {
        this.afterThen= new Promise();
        this.func=null;
        this.funcText=func;
        if(this.pointer>=0)jsdom.then(this.pointer);
        return <Promise>this.afterThen;
    }
    public alertResponse(r:Response):void{
        
        if(this.func)
        {
            var prom:Promise|null =this.func(r);
            if(prom){
                var i=Promise._promises.indexOf(prom);
                Promise._promises.splice(i,1);
                (<Promise>this.afterThen).pointer=prom.pointer;
                (<Promise>this.afterThen).func=prom.func;
                jsdom.then((<Promise>this.afterThen).pointer);
            }
        }

    }
    public alertResponseText(r:string):void{
        
        if(this.funcText)
        {
            this.funcText(r);
        }

    }
    public static fromPointer(p:i32):Promise
    {
        var prom:Promise|null = null;
        for(var i=0;i<Promise._promises.length && !prom;i++)
        {
            if(Promise._promises[i].pointer==p)
            {
                prom=Promise._promises[i];
            }
        }
        return <Promise>prom;
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

class Document {
 
    documentElement: Element;
    debug: Debug;
    constructor() {
        Debug.log("[Document:constructor] start");
        this.debug = new Debug();
        var apointer = jsdom.getDocument();
        Debug.log("[Document:apointer] "+apointer.toString());
        apointer=jsdom.getDocumentElement();
        Debug.log("[DocumentElement:apointer] "+apointer.toString());
        this.documentElement = Element.fromPointer(apointer);
        Debug.log("[Document:constructor] end");  
    }

    public get head():Element{
        return Element.fromPointer(jsdom.getHead(this.documentElement.pointer));
    }
    public get body():Element{
        return Element.fromPointer(jsdom.getBody(this.documentElement.pointer));
    }

    public createElement(s: string): Element {
        Debug.log("createElement");
        return new Element(s);
    }
    /**
     * Returns the first child element that matches a specified CSS selector(s) of an element
     */
    public querySelector(q: string): Element|null {
        var p:i32=jsdom.querySelector(this.documentElement.pointer, q);
        if(p<0) return null;
        else return Element.fromPointer(p);
    }

    /**
    * Returns all child elements that matches a specified CSS selector(s) of an element
    */
    public querySelectorAll(q: string): Element[] {
        var rs: Int32Array = jsdom.querySelectorAll(this.documentElement.pointer, q);
        var e: Array<Element> = [];
        if (rs && rs.length > 0) {
            for (var i: i32 = 0; i < rs.length; i++) {
                e.push(Element.fromPointer(rs[i]));
            }
        }
        Debug.log("[Element::querySelectorAll] end");
        return e;
    }
}

class Globals {
    splashColor: string | null;
    icon180x180: string | null;
    splashDuration: string | null;
}

class PWAGlobals {
    globals: Globals;
    constructor() {
        this.globals = new Globals();
    }
}

class Console {
    public log(s: string): void {
        jsdom.consoleLog(s);
    }
}

class Window {
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
    public fetch(uri:string):Promise
    {
        var p:i32 = jsdom.fetch(uri);
        var pr:Promise = new Promise(p);
        return pr;
    }

 

    public alertPromise(p:i32,r:i32):void
    {
        
    }
}




class URLSearchParams {
    search: string | null;
    constructor(search: string | null) {
        this.search = search;
    }
    public get(name: string): string {

        var r:string="";
        if(this.search!=null)
        {
            var s:String =<String>this.search;
            var start:i32=s.indexOf("=",s.indexOf(name)+1)+1;
            var end:i32=s.indexOf("&",start);
            if(end>=0)
            {
                r=s.substring(start,end).trim();
            }
            else{
                r=s.substring(start).trim();
            }
        }
        return r;
    }
};

function setTimeout(callback: () => void, duration: i32): void {
    if (Window.window) Window.window.setTimeout(callback, duration);
}

function fetch(uri:string):Promise
{
    if(Window.window)
    {
        var prom:Promise=Window.window.fetch(uri);
        return prom;
    }
    else{
        return new Promise();
    }
}

class DomDate extends Date{

    _getTimezoneOffset:i32=99999999;

    
    
    get24HourTimeUTC():string
    {
        var date:f64=<f64>this.getTime();
        var days:f64=date/(<f64>(1000*60*60*24));
        var hours:f64=date/(<f64>(1000*60*60));
        return ("00"+(<i64>((days-Math.floor(days))*<f64>24)).toString()).slice(-2)+":"+("00"+(<i64>((hours-Math.floor(hours))*<f64>60)).toString()).slice(-2);
    }

    get24HourTime():string
    {
        var date:f64=<f64>this.getTime();
        var days:f64=date/(<f64>(1000*60*60*24));
        var hours:f64=date/(<f64>(1000*60*60));
        return ("00"+this.getHours().toString()).slice(-2)+":"+("00"+this.getMinutes().toString()).slice(-2);
    }

    getHours():i32
    {
        var date:f64=<f64>this.getTime()-<f64>(this.getTimezoneOffset()*60*1000);
        var days:f64=date/(<f64>(1000*60*60*24));
        return <i32>((days-Math.floor(days))*<f64>24);
    }
    getMinutes():i32
    {
        var date:f64=<f64>this.getTime()-<f64>(this.getTimezoneOffset()*60*1000);
        var hours:f64=date/(<f64>(1000*60*60));
        return <i32>(<i64>((hours-Math.floor(hours))*<f64>60));
    }
    getTimezoneOffset():i32
    {
        if(this._getTimezoneOffset==99999999)this._getTimezoneOffset=jsdom.getTimezoneOffset();
        return this._getTimezoneOffset;
    }

}


export { Debug, Document, Console, Window, URLSearchParams,Promise,Response,fetch, setTimeout,DomDate as Date };