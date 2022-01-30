import {
    Div, AuthButtons
} from 'https://gcode.com.au/modules/pwa.mjs';

export class LoginButton extends AuthButtons {
    constructor() {
        super({
            facebookkey: "1240916769304778",
            appearance: "list",
            nextPage: "AppsPage"
        });
    }
}
class App extends Div{
    constructor() {
        super({width:"140px",height:"200px",backgroundColor:"#EEEEEE",margin:"5px",innerText:"test",display:"inline-block",position:"relative"});
    }
}
export class AppsList extends Div {
    constructor() {
        super({
          children:[new App(),new App(),new App(),new App()]
        });
    }
}