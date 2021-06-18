import * as jsdom from "../wasmdom";

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

export class Promise{
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
