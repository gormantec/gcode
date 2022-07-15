import { Div } from 'https://gcode.com.au/modules/pwa.mjs';

/*---------------------------------------------------------------------------*/
export class Row extends Div
{
      constructor(params) {
        super({"position":"relative","top":"unset","bottom":"unset","left":"unset","right":"unset","children":params.children});
        for(var i=0;i<this.childrenCount;i++)
        {
          this.element.children[i].style.width = (Math.floor(1000/this.childrenCount)/10)+"%";
        }
      }
}
export class Column extends Div
{
      constructor(params) {
        super({"position":"relative","display":"inline-block","top":"unset","bottom":"unset","left":"unset","right":"unset"});
        if(params instanceof Div) this.setChild(params);
        else if(params.child) this.setChild(params.child);
		this.style.height = this.firstChild.style.height;
      }
}

export class OutlinedButton extends Div
{
      constructor(params) {
        super(params);
		if(params.height) this.style.height = params.height;
        else this.style.height = "80px";
        this.style.width = params.width || "80px";
        this.style.cursor ="pointer";
    	this.style.pointerEvents="auto";
      }
}

export class Text extends Div
{
      constructor(_text) {
        super({"position":"absolute",top:"0px",bottom:"0px",left:"0px",right:"0px",display: "flex",
        alignItems: "center",
        justifyContent: "center","child":new Div({"classNameOverride":true,"innerText":_text})});
      }
}
export class ListView extends Div
{
  constructor(params)
  {
    super(params);
    this.childrenElements=this.element.children;
    while (this.element.firstChild) {
      this.element.removeChild(this.element.lastChild);
    }
    for(let i=0;i<this.childrenElements.length;i++)
    {
      this.appendChild(new Div({"position":"relative",child:this.childrenElements[i]}));
    }
  }
}
export class Container extends Div
{
  constructor(params)
  {
    super(params);
  }
}
export class Center extends Div
{
  constructor(params)
  {
    super(params);
    this.element.style.display="flex";
    this.element.style.alignItems="center";
    this.element.style.justifyContent="center";
  }
}


