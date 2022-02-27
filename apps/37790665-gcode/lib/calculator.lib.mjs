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
      	if(!this.calcDiv.action && this.calcDiv.value==0)
        {
          this.calcDiv.action=v;
        }
      	else if(!this.calcDiv.action)
        {
          this.calcDiv.value=this.calcDiv.value+""+v;
        }
      	else if(this.calcDiv.action)
        {
          this.calcDiv.value=eval(this.calcDiv.value+this.calcDiv.action+v);
          this.calcDiv.action=null;
        }
		
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
      	this.action=null;
    }
  	get value(){ return Number(this.element.innerText);}
    set value(v){ this.element.innerText=v;}
  	
}


export var calc = new CalcClass();