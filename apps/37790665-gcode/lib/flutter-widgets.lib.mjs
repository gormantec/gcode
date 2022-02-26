import { Div } from 'https://gcode.com.au/modules/pwa.mjs';

/*---------------------------------------------------------------------------*/
export class Row extends Div
{
      constructor() {
        super({});
      }
}
export class Column extends Div
{
      constructor() {
        super({});
      }
}
export class OutlinedButton extends Div
{
      constructor() {
        super({});
      }
}
export class Text extends Div
{
      constructor(_text) {
        super({"innerText":_text});
      }
}