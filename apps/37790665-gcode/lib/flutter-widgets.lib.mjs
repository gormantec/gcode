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
		this.style.height = "50px";
		this.style.height = "50px";
        this.style.width = "50px";
      }
}
export class Text extends Div
{
      constructor(_text) {
        super({"marginTop":"50%","child":new Div({"marginTop":"-10px",textAlign:"center","innerText":_text})});
      }
}