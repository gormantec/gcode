import {Div} from 'https://gcode.com.au/modules/pwa.mjs';

class CalcClass {

    AC() {
		this.calcDiv
    }

    Invert() {

        this.calcDiv.value=eval("-"+this.calcDiv.value);
    }

    Perc() {
		this.calcDiv.value=this.calcDiv.value/100;
    }
    Num(v) {
		this.calcDiv.value=eval(this.calcDiv.value+this.calcDiv.action+v);
    }

    Divide() {
        this.calcDiv.action="/";
    }
  	newDiv(params){
      this.calcDiv=new CalcDiv(params);
      return this.calcDiv;
    }

}

class CalcDiv extends Div {
    constructor(params) {
        super(params);
      	this.action="";
    }
  	get value(){ return Number(this.element.innerText);}
    set value(v){ this.element.innerText=v;}
  	
}


export var calc = new CalcClass();