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
        super({width:"160px",height:"220px",backgroundColor:"#EEEEEE",margin:"5px",innerText:"<b>boat crew</b><p>Invite or meet new freinds. Pubich a trip and find a boat crew. Or search for a trip that needs a crew in your area.</p>",display:"inline-block",position:"relative"});
    }
}
export class AppsList extends Div {
    constructor() {
        super({
          children:[new App(),new App(),new App(),new App()]
        });
    }
}