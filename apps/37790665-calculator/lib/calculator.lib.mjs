import {Div} from 'https://gcode.com.au/modules/pwa.mjs';

class CalcClass {

    AC() {
      
      	this.equalsValue=false;
		this.calcDiv.value=0;
        this.calcDiv.action=null;
      
    }

    Invert() {
      	this.equalsValue=false;
        this.calcDiv.value=eval("-"+this.calcDiv.value);
    }

    Perc() {
      	this.equalsValue=false;
		this.calcDiv.value=this.calcDiv.value/100;
    }
    Divide() {
      	this.equalsValue=false;
        this.calcDiv.actionValue=this.calcDiv.value;
        this.calcDiv.action="/";
    }
  	Times() {
      	this.equalsValue=false;
      	this.equalsValue=false;
        this.calcDiv.actionValue=this.calcDiv.value;
        this.calcDiv.action="*";
    }
  	Minus() {
      	this.equalsValue=false;
        this.calcDiv.actionValue=this.calcDiv.value;
        this.calcDiv.action="-";
    }
  	Plus() {
      	this.equalsValue=false;
        this.calcDiv.actionValue=this.calcDiv.value;
        this.calcDiv.action="+";
    }
  	Decimal() {
      	if(this.calcDiv.value.indexOf(".")<0)
        {
          this.equalsValue=false;
          this.calcDiv.value=this.calcDiv.value+".";
        }
    }
  	Equals() {
      	if(this.equalsValue==true)
        {
          console.log("equalsValue==true");
          this.calcDiv.actionValue=this.oldActionValue;
          this.calcDiv.action=this.oldAction;
        }
      	if(this.calcDiv.actionValue!=null && this.calcDiv.action!=null)
        {
          console.log("eval "+""+this.calcDiv.actionValue+""+this.calcDiv.action+""+this.calcDiv.value);
          this.calcDiv.value=eval(""+this.calcDiv.actionValue+""+this.calcDiv.action+""+this.calcDiv.value);
          
          this.secondValue=false;
          this.equalsValue=true;
          this.oldActionValue=this.calcDiv.actionValue;
          this.oldAction=this.calcDiv.action;
          this.calcDiv.action=null;
        }
    }
    Num(v) {
      	if(this.calcDiv.action==null && this.calcDiv.value=="0" || this.equalsValue==true)
        {
          console.log("set to "+v);
          this.calcDiv.value=v;
          this.equalsValue=false;
        }
      	else if(this.calcDiv.action==null)
        {
          console.log("append "+v);
          this.calcDiv.value=""+this.calcDiv.value+""+v;
        }
      	else if(this.calcDiv.action!=null)
        {
          	if(this.secondValue==true)
            {
              console.log("append "+v);
              this.calcDiv.value=""+this.calcDiv.value+""+v;
            }
          	else
            {
              this.calcDiv.actionValue=this.calcDiv.value;
              this.calcDiv.value=v;
              this.secondValue=true;
            }
        }
      	this.equalsValue=false;
		
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
  	get value(){ return this.element.innerText;}
    set value(v){ this.element.innerText=v;}
  	
}


export var calc = new CalcClass();