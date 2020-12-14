import * as jsdom from "../wasmdom";
import { Element } from "./element";

export class Style{
    parentPointer: i32;
    

    constructor(parentPointer:i32 = -1) {
        this.parentPointer=parentPointer;
    }

    public setProperty(name:string,value:string|null):void
    {
        if(this.parentPointer>-0 && value!=null)
        {
            jsdom.setStyleProperty(this.parentPointer,name,<string>value);
        }
        else if(this.parentPointer>-0 ){
            jsdom.setStyleProperty(this.parentPointer,name,"");
        }
    }
    public getProperty(name:string):string|null
    {
        if(this.parentPointer>-0 && name!=null)
        {
            return jsdom.getStyleProperty(this.parentPointer,name);
        }
        return null;
    }
    

    public set opacity(value:string|null){this.setProperty("opacity",value);}

    public set backgroundColor(value:string|null){this.setProperty("background-color",value);}

    public set color(value:string|null){this.setProperty("color",value);}

    public set height(value:string|null){this.setProperty("height",value);}

    public set fontSize(value:string|null){this.setProperty("font-size",value);}

    public set display(value:string|null){this.setProperty("display",value);}
    public set padding(value:string|null){this.setProperty("padding",value);}
    public set footerHeight(value:string|null){this.setProperty("footer-height",value);}
    public set bottom(value:string|null){this.setProperty("bottom",value);}
    public set top(value:string|null){this.setProperty("top",value);}
    public set left(value:string|null){this.setProperty("left",value);}
    public set right(value:string|null){this.setProperty("right",value);}

    public set borderRadius(value:string|null){this.setProperty("border-radius",value);}
    public set textAlign(value:string|null){this.setProperty("text-align",value);}
    public set cursor(value:string|null){this.setProperty("cursor",value);}
    public set width(value:string|null){this.setProperty("width",value);}

    public set backgroundPosition(value:string|null){this.setProperty("background-position",value);}
    public set backgroundRepeat(value:string|null){this.setProperty("background-repeat",value);}
    public set backgroundImage(value:string|null){this.setProperty("background-image",value);}
    public get backgroundImage():string|null{return this.getProperty("background-image");}
    public set backgroundSize(value:string|null){this.setProperty("background-size",value);}


    public set animationName(value:string|null){this.setProperty("animation-name",value);}
    public set animationDuration(value:string|null){this.setProperty("animation-duration",value);}
    public set animationTimingFunction(value:string|null){this.setProperty("animation-timing-function",value);}

    

}