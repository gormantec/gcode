import {
    Div
} from 'https://gcode.com.au/modules/pwa.mjs';

/*---------------------------------------------------------------------------*/
export class Row extends Div {
    constructor(params) {
        super({
            "position": "relative",
            "top": "unset",
            "bottom": "unset",
            "left": "unset",
            "right": "unset",
            "children": params.children
        });
        for (var i = 0; i < this.childrenCount; i++) {
            this.element.children[i].style.width = (Math.floor(1000 / this.childrenCount) / 10) + "%";
        }
    }
}
export class Column extends Div {
    constructor(params) {
        super({
            "position": "relative",
            "display": "inline-block",
            "top": "unset",
            "bottom": "unset",
            "left": "unset",
            "right": "unset"
        });
        if (params instanceof Div) this.setChild(params);
        else if (params.child) this.setChild(params.child);
        this.style.height = this.firstChild.style.height;
    }
}

export class OutlinedButton extends Div {
    constructor(params) {
        super(params);
        if (params.height) this.style.height = params.height;
        else this.style.height = "80px";
        this.style.width = params.width || "80px";
        this.style.cursor = "pointer";
        this.style.pointerEvents = "auto";
    }
}

export class Text extends Div {
    constructor(_text) {
        super({
                "classNameOverride": true,
          		"tagName":"span",
                "innerText": _text
        });
    }
}
export class ListView extends Div {
    constructor(params) {
        super(params);
        this.divChildren = params.children;
        while (this.element.firstChild) {
            this.element.removeChild(this.element.lastChild);
        }
        for (let i = 0; i < this.divChildren.length; i++) {
            console.log("x");
            this.appendChild(new Div({
                "position": "relative",
                height: this.divChildren[i].style.height,
                child: this.divChildren[i]
            }));
        }
    }
}
export class Container extends Div {
    constructor(params) {
        super(params);
    }
}
export class Center extends Div {
    constructor(params) {
        super(params);
        this.element.style.display = "flex";
        this.element.style.alignItems = "center";
        this.element.style.justifyContent = "center";
    }
}

export class ListTile extends Div {
    constructor(params) {
        super(params);
      	this.style.height="40px";
        if(params.title){
          params.title.style.height="18px";
          params.title.style.fontSize="16px";
          params.title.style.top="0px";
          params.title.style.left="42px";
          this.appendChild(params.title);
    	}
        if(params.subtitle){
          params.subtitle.style.height="12px";
          params.subtitle.style.fontSize="10px";
          params.subtitle.style.top="20px";
          params.subtitle.style.left="42px";
          this.appendChild(params.subtitle);
        }
        if(params.leading){
          
          params.subtitle.style.height="40px";
          params.subtitle.style.fontSize="38px";
          params.subtitle.style.top="0px";
          params.subtitle.style.left="0px";
          this.appendChild(params.leading);
        }
        if(params.trailing){
          params.subtitle.style.height="40px";
          params.subtitle.style.fontSize="38px";
          params.subtitle.style.top="0px";
          params.subtitle.style.right="0px";
          this.appendChild(params.trailing);
        }
    }
}
export class Icon extends Div {
    constructor(icon) {
        super();
        this.setChild(new Div({
                tagName: "i",
                class: "material-icons",
                classNameOverride: true,
                innerText: icon
            }));
    }}
export const Icons = {
  battery_full:"battery_full",
  star:"star"
}