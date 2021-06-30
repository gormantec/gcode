import {jsdom} from "wasmdom";

class Debug {
    public static log(v: string): void {
        jsdom.consoleLog(v);
    }
};

export{Debug}; 