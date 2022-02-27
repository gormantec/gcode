import {Div} from 'https://gcode.com.au/modules/pwa.mjs';

class CalcClass {
    constructor() {
        this.listeners = [];
    }


    AC() {
        this.updateListener("ACxxx");
    }

    Invert() {

        console.log("Invert");
    }

    Perc() {

        console.log("Perc");
    }

    Divide() {

        console.log("Divide");
    }
    addChangeListener(aDiv) {
        this.listeners.push(aDiv);
    }
    updateListener(value) {
        for (var i = 0; i < this.listeners.length; i++) {
          	console.log(i);
            this.listeners[i].element.innerText = value;
        }
    }
}

export class CalcDiv extends Div {
    constructor(params) {
        super(params);
        if (params.calc) {
            params.calc.addChangeListener(this);
        }
    }
}


export var calc = new CalcClass();