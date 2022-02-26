import { Div } from 'https://gcode.com.au/modules/pwa.mjs';

/*---------------------------------------------------------------------------*/
export class Row extends Div
{
      constructor(params) {
        super({"position":"relative","bottom":"unset","height":"30px","children":params.children});
      }
}
export class Column extends Div
{
      constructor(params) {
        super({"position":"relative","display":"inline","bottom":"unset","left":"unset","right":"unset","height":"30px","width":"30px"});
        if(params instanceof Div) this.setChild(params);
        else if(params.child) this.setChild(params.child);
        
      }
}
export class OutlinedButton extends Div
{
      constructor(params) {
        super(params);
		this.style.height = "30px";
        this.style.width = "30px";
      }
}
export class Text extends Div
{
      constructor(_text) {
        super({"innerText":_text});
      }
}