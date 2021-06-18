export class Provider{

}

export class JsonRpcProvider extends Provider{
    url: string;

    constructor(url:string)
    {
        super();
        this.url=url;
    }

}