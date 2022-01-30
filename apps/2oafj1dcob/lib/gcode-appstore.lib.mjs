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
        super({width:"320px",height:"220px",textAlign:"left",backgroundColor:"rgb(19, 138, 114,0.2)",color:"#222222",margin:"5px",innerHTML:"<b>boat crew</b><p>Invite or meet new freinds. Pubich a trip and find a boat crew. Or search for a trip that needs a crew in your area.</p>",display:"inline-block",position:"relative"});
    }
}
export class AppsList extends Div {
    constructor() {
        super({
          textAlign:"center",
          children:[new App(),new App(),new App(),new App()]
        });
    }
}