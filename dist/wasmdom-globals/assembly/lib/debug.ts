import * as jsdom from "wasmdom-jsdom";

class Debug {
    public static log(v: string): void {
        jsdom.consoleLog(v);
    }
};

export{Debug};