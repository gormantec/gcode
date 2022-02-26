import { Div } from 'https://gcode.com.au/modules/pwa.mjs';

/*---------------------------------------------------------------------------*/
export class Row extends Div
{
      constructor(params) {
        super({"position":"relative","bottom":"unset","height":"20px","children":params.children});
      }
}
export class Column extends Div
{
      constructor(params) {
        super(params);
        this.style.position = "relative";
        this.style.display = "table-cell";
      }
}
export class OutlinedButton extends Div
{
      constructor(params) {
        super(params);
      }
}
export class Text extends Div
{
      constructor(_text) {
        super({"innerText":_text});
      }
}