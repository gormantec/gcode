import {jsdom} from "wasmdom-jsdom";
import { Element } from "./element";
import { Debug } from "wasmdom-globals";

//interface CallbackTwoParams<T1 = void, T2 = void,T3 = void> {(param1: T1,param2: T2): T3;}




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



class Console {
    public log(s: string): void {
        jsdom.consoleLog(s);
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


export { Document, Console, URLSearchParams,DomDate as Date };