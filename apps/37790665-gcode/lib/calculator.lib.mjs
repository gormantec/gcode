import {Div} from 'https://gcode.com.au/modules/pwa.mjs';

class CalcClass {

    AC() {
		this.calcDiv.value=0;
        this.calcDiv.action=null;
      
    }

    Invert() {
      
        this.calcDiv.value=eval("-"+this.calcDiv.value);
    }

    Perc() {
		this.calcDiv.value=this.calcDiv.value/100;
    }
    Divide() {
        this.calcDiv.action="/";
    }
  	Times() {
        this.calcDiv.action="*";
    }
  	Minus() {
        this.calcDiv.action="-";
    }
  	Plus() {
        this.calcDiv.action="+";
    }
  	Decimal() {
		this.calcDiv.value=this.calcDiv.value+".";
    }
  	Equals() {
		this.calcDiv.value=this.calcDiv.value/100;
    }
    Num(v) {
      	if(this.calcDiv.action==null && this.calcDiv.value==0)
        {
          console.log("set to "+v);
          this.calcDiv.value=v;
        }
      	else if(this.calcDiv.action==null)
        {
          console.log("append "+v);
          this.calcDiv.value=""+this.calcDiv.value+""+v;
        }
      	else if(this.calcDiv.action!=null)
        {
          console.log("eval "+""+this.calcDiv.value+""+this.calcDiv.action+""+v);
          this.calcDiv.value=eval(""+this.calcDiv.value+""+this.calcDiv.action+""+v);
          this.calcDiv.action=null;
        }
		
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