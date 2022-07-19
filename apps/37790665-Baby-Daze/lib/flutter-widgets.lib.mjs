import { Div } from 'https://gcode.com.au/modules/pwa.mjs';

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
            "tagName": "span",
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
            super.appendChild(new Div({
                "position": "relative",
                "padding": "8px",
                height: this.divChildren[i].style.height,
                child: this.divChildren[i]
            }));
        }
    }
  	
  	appendChild(child)
    {
      	this.divChildren.push(child);
      	super.appendChild(new Div({
                "position": "relative",
                "padding": "8px",
                height: child.style.height,
                child: child
            }));
    }
}
export class Container extends Div {
    constructor(params) {
        super(params);
    }
}
export class Video extends Div {
    constructor(params) {
        super({
          			width: params.width?params.width:"320px",
                    height: params.height?params.height:"180px",
                    id: params.id?params.id:"video-"+Date.now(),
                    tagName: "video",
              		backgroundColor:"black",
                    classNameOverride: true
              });
      	if(params.src)
        {
          	this.element.src=params.src;
        }
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
        this.style.height = "40px";
        if (params.title) {
            this.appendChild(new Container({
                height: "18px",
                fontSize: "16px",
                top: "0px",
                left: "42px",
                child: params.title
            }));
        }
        if (params.subtitle) {
            this.appendChild(new Container({

                height: "14px",
                fontSize: "12px",
                top: "22px",
                left: "42px",
                child: params.subtitle
            }));
        }
        if (params.leading) {
            this.appendChild(new Container({
                height: "25px",
                fontSize: "24px",
                top: "0px",
                left: "0px",
                width: "40px",
                child: params.leading
            }));
        }
        if (params.trailing) {
            this.appendChild(new Container({
                height: "30px",
                fontSize: "24px",
                top: "5px",
                right: "0px",
                width: "30px",
                child: params.trailing
            }));
        }
    }
}

export class Icon extends Div {
    constructor(icon) {
        super();
        let params = {
            tagName: "i",
            class: "material-icons",
            classNameOverride: true,
            innerText: icon
        };
        this.getParentStyle("fontSize").then((fontSize) => {
            if (fontSize) {
                params.fontSize = fontSize;
            }
            this.setChild(new Div(params));
        });

    }
}
export const Icons = {
    "battery_full": "battery_full",
    "star": "star",
    "star_outline": "star_outline",
    "flag": "flag",
    "alarm": "alarm"
};


