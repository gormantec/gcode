import { Div } from 'https://gcode.com.au/modules/pwa.mjs';

/*---------------------------------------------------------------------------*/
export class Row extends Div
{
      constructor(params) {
        super(params);
      }
}
export class Column extends Div
{
      constructor(params) {
        super(params);
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