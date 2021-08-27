import {jsdom} from "wasmdom";
import { Debug } from "../lib/debug";

export class Response{
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
export class JSObject{
    pointer:i32;
    constructor(pointer:i32=-1) {
        this.pointer=pointer;
    }
}
export class JSContract extends JSObject{
    accountId:string;
    contractId:string;
    constructor(pointer:i32=-1,accountId:string="",contractId:string="") {
        super(pointer)
        this.pointer=pointer;
        this.accountId=accountId;
        this.contractId=contractId;
    }
}







type ResponseType<T> = ((r:T)=>Promise|null)|null;
type StringResponseType<T> = ((r:T)=>Promise|null)|null;
type JSContractResponseType<T> = ((r:T)=>Promise|null)|null;
export type ResolveFuncType=(resolve:ResponseType<string>,reject:ResponseType<string>,g:string[])=>void;
// @ts-ignore
@global @inline const MY_NAME="XXX";
// @ts-ignore
@global @inline const _promises:Promise[]=[];

export class Promise{
    pointer:i32;
    func:ResponseType<Response>;
    funcText:StringResponseType<string>;
    funcJSContract:JSContractResponseType<JSContract>;
    funcJSObject:ResponseType<JSObject>;
    afterThen: Promise|null = null;
    resolveFunc:ResolveFuncType|null=null;
    globals:string[]=[];
    name:string;
    
    constructor(pointer:i32=-1) {
        this.pointer=pointer;
        this.name="Normal";
        _promises.push(this);
    }
    public toString():string{
        return "Promise[pointer="+this.pointer.toString()+"]";
    }
    public then(func:ResponseType<Response> =null,funcText:StringResponseType<string> = null):Promise
    {
        Debug.log("then::::n="+this.name+" g="+this.globals.toString());
        this.afterThen= new Promise();
        //Debug.log("Promises="+_promises.toString());
        this.func=func;
        this.funcText=null;
        if(this.pointer>=0)jsdom.then(this.pointer);
        return <Promise>this.afterThen;
    }
    public thenOther<T>(func:ResponseType<T>):Promise
    {
        if(isString<T>())
        {
            return this.thenString(<StringResponseType<string>>func);
        }
        else{
            return this.then(<ResponseType<Response>>func);
        }
    }

    public thenString(func:StringResponseType<string> = null):Promise
    {
        Debug.log("then::::n="+this.name+" g="+this.globals.toString());

            this.afterThen= new Promise();
            this.func=null;
            this.funcText=func;
            if(this.pointer>=0)jsdom.then(this.pointer);
            return <Promise>this.afterThen;

    }
    public thenJSContract(func:JSContractResponseType<JSContract> = null):Promise
    {
        Debug.log("then::::n="+this.name+" g="+this.globals.toString());
        Debug.log(typeof func);
        if(func)Debug.log(func.toString());
        if(func)Debug.log(nameof(func));

            this.afterThen= new Promise();
            this.func=null;
            this.funcText=null;
            this.funcJSContract=func;
            if(this.pointer>=0)jsdom.then(this.pointer);
            return <Promise>this.afterThen;

    }
    public thenJSObject(func:ResponseType<JSObject> = null):Promise
    {
        Debug.log("then::::n="+this.name+" g="+this.globals.toString());
        Debug.log(typeof func);
        if(func)Debug.log(func.toString());
        if(func)Debug.log(nameof(func));

            this.afterThen= new Promise();
            this.func=null;
            this.funcText=null;
            this.funcJSObject=func;
            if(this.pointer>=0)jsdom.then(this.pointer);
            return <Promise>this.afterThen;

    }

    public alertJSObject(r:JSObject):void{
        //Debug.log("got alertResponse");
        Debug.log("alertJSObject:::n="+this.name+" g="+this.globals.toString());  
        if(this.funcJSObject)
        {
            var prom:Promise|null =this.funcJSObject(r);
            if(prom){
                var i:i32=_promises.indexOf(prom);
                _promises.splice(i,1);
                (<Promise>this.afterThen).pointer=prom.pointer;
                (<Promise>this.afterThen).func=prom.func;
                jsdom.then((<Promise>this.afterThen).pointer);
            }
        }

    }
    
    public alertJSContract(r:JSContract):void{
        //Debug.log("got alertResponse");
        Debug.log("alertJSContract::::n="+this.name+" g="+this.globals.toString());  
        if(this.funcJSContract)
        {
            var prom:Promise|null =this.funcJSContract(r);
            if(prom){
                var i:i32=_promises.indexOf(prom);
                //Debug.log("Promises="+_promises.toString());
                //Debug.log("removed ["+i.toString()+"] count="+_promises[i].toString());
                _promises.splice(i,1);
                //Debug.log("Promises="+_promises.toString());
                (<Promise>this.afterThen).pointer=prom.pointer;
                (<Promise>this.afterThen).func=prom.func;
                //Debug.log("Promises="+_promises.toString());
                jsdom.then((<Promise>this.afterThen).pointer);
            }
        }

    }
    public alertResponse(r:Response):void{
        //Debug.log("got alertResponse");
        Debug.log("alertResponse::::n="+this.name+" g="+this.globals.toString());  
        if(this.func)
        {
            var prom:Promise|null =this.func(r);
            if(prom){
                var i:i32=_promises.indexOf(prom);
                //Debug.log("Promises="+_promises.toString());
                //Debug.log("removed ["+i.toString()+"] count="+_promises[i].toString());
                _promises.splice(i,1);
                //Debug.log("Promises="+_promises.toString());
                (<Promise>this.afterThen).pointer=prom.pointer;
                (<Promise>this.afterThen).func=prom.func;
                //Debug.log("Promises="+_promises.toString());
                jsdom.then((<Promise>this.afterThen).pointer);
            }
        }

    }
    public alertResponseText(r:string):void{
        //Debug.log("got alertResponseText");
        Debug.log("alertResponseText::::n="+this.name+" r=["+r.substring(0,20)+"..]");
        if(this.funcText)
        {
            var prom:Promise|null=this.funcText(r);
            if(prom){
                var i:i32=_promises.indexOf(prom);
                //Debug.log("Promises="+_promises.toString());
                //Debug.log("removed ["+i.toString()+"] count="+_promises[i].toString());
                _promises.splice(i,1);
                //Debug.log("Promises="+_promises.toString());
                (<Promise>this.afterThen).pointer=prom.pointer;
                (<Promise>this.afterThen).func=prom.func;
                //Debug.log("Promises="+_promises.toString());
                jsdom.then((<Promise>this.afterThen).pointer);
            }
        }

    }
    public static fromPointer(p:i32):Promise
    {
        var prom:Promise|null = null;
        for(var i=0;i<_promises.length && !prom;i++)
        {
            //Debug.log("find if p("+p.toString()+") == pointer("+_promises[i].pointer.toString()+")");
            if(_promises[i].pointer==p)
            {
                prom=_promises[i];
            }
        }
        return <Promise>prom;
    }
    public static getPromises():Promise[]{
        //Debug.log(MY_NAME);
        return _promises;
    }

    public static newPromise(func:StringResponseType<string>,s:string):Promise
    {
        var p:Promise= new Promise(jsdom.newPromise(s));
        p.funcText=func;
        p.name="newPromise";
        return p;
    }
    public static resolve(s:string):Promise
    {
        var p:Promise= new Promise(jsdom.newPromise(s));
        p.name="newPromise";
        return p;
    }
}
 