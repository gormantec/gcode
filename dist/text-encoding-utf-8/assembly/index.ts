class TextDecoderConfig {
    fatal:boolean
}

export class TextDecoder{


    format:string;

    constructor(format:string,options:TextDecoderConfig)
    {
        this.format=format;
    }

    public decode(buf:ArrayBuffer):string
    {
        return String.UTF8.decode(buf);
    }

    public encode(s:string):ArrayBuffer
    {
        return String.UTF8.encode(s);
    }

}