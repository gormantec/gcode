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

type ResponseType<T> = ((r:T)=>Promise|null)|null;
// @ts-ignore
@global @inline const MY_NAME="XXX";
// @ts-ignore
@global @inline const _promises:Promise[]=[];

export class Promise{
    pointer:i32;
    func:ResponseType<Response>;
    funcText:ResponseType<string>;
    afterThen: Promise|null = null;
    resolveFunc:((resolve:ResponseType<string>,reject:ResponseType<string>,g:string[])=>Promise|null)|null=null;
    globals:string[]=[];
    
    constructor(pointer:i32=-1) {
        this.pointer=pointer;
        _promises.push(this);
    }
    public toString():string{
        return "Promise[pointer="+this.pointer.toString()+"]";
    }
    public then(func:ResponseType<Response> =null,funcText:ResponseType<Response> = null):Promise
    {
        //Debug.log("Promises="+_promises.toString());
        this.afterThen= new Promise();
        //Debug.log("Promises="+_promises.toString());
        this.func=func;
        this.funcText=null;
        if(this.pointer>=0)jsdom.then(this.pointer);
        return <Promise>this.afterThen;
    }

    public thenString(func:ResponseType<string> = null):Promise
    {
        if(this.resolveFunc)
        {
            Debug.log("-----------1");
            return <Promise>this.resolveFunc(func,()=>{return null;},<string[]>this.globals);
        }
        else{
            Debug.log("-----------2");
            this.afterThen= new Promise();
            this.func=null;
            this.funcText=func;
            if(this.pointer>=0)jsdom.then(this.pointer);
            return <Promise>this.afterThen;
        }
        

    }
    public alertResponse(r:Response):void{
        //Debug.log("got alertResponse");

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
        if(this.funcText)
        {
            this.funcText(r);
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

    public static newPromise(func:(resolve:ResponseType<string>,reject:ResponseType<string>,g:string[])=>Promise|null,g:string[]):Promise
    {
        var p:Promise= new Promise(jsdom.newPromise());

        p.globals=g;

        p.resolveFunc=func;

        return p;
    }
}
 