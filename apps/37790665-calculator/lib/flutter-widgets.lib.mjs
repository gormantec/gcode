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
        else this.style.height = "90px";
        this.style.width = params.width || "90px";
        this.style.cursor ="pointer";
    	this.style.pointerEvents="auto";
      }
}
export class Text extends Div
{
      constructor(_text) {
        super({"position":"relative",height:"100%","verticalAlign": "middle","child":new Div({"position":"relative","verticalAlign": "middle","height":"100%",textAlign:"center","innerText":_text})});
      }
}