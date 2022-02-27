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
      	if(this.calcDiv.actionValue!=null) this.Equals();
		this.equalsValue=false;
        this.calcDiv.actionValue=this.calcDiv.value;
        this.calcDiv.action="/";
    }
  	Times() {
      	if(this.calcDiv.actionValue!=null) this.Equals();
		this.equalsValue=false;
        this.calcDiv.actionValue=this.calcDiv.value;
        this.calcDiv.action="*";
    }
  	Minus() {
      	if(this.calcDiv.actionValue!=null) this.Equals();
		this.equalsValue=false;
        this.calcDiv.actionValue=this.calcDiv.value;
        this.calcDiv.action="-";
    }
  	Plus() {
      	if(this.calcDiv.actionValue!=null) this.Equals();
		this.equalsValue=false;
        this.calcDiv.actionValue=this.calcDiv.value;
        this.calcDiv.action="+";
    }
  	Decimal() {
		this.calcDiv.value=this.calcDiv.value+".";
    }
  	Equals() {
      	if(this.calcDiv.actionValue!=null && this.calcDiv.action!=null)
        {
          console.log("eval "+""+this.calcDiv.actionValue+""+this.calcDiv.action+""+this.calcDiv.value);
          this.calcDiv.value=eval(""+this.calcDiv.actionValue+""+this.calcDiv.action+""+this.calcDiv.value);
          this.calcDiv.action=null;
          this.secondValue=false;
          this.equalsValue=true;
        }
    }
    Num(v) {
      	if(this.calcDiv.action==null && this.calcDiv.value==0 || this.equalsValue==true)
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