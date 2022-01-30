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
        super({width:"140px",height:"140px",backgroundColor:"blue",margin:"5px"});
    }
}
export class AppsList extends Div {
    constructor() {
        super({
          children:[new App(),new App(),new App(),new App()]
        });
    }
}