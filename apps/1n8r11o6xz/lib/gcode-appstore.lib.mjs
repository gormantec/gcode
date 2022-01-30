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
        super({width:"180px",height:"320px",textAlign:"left",backgroundColor:"white",color:"#222222",margin:"5px",padding:"5px",innerHTML:"<img src=\"https://play-lh.googleusercontent.com/y1J3-OrqJIlezTtaung2sPOnHY9wS2hdJh26ADkwcc3kdZy4DTGyv94IN_YRvdKy0y4=s360-rw\" width=160 height=160><b>boat crew</b><p>Invite or meet new freinds. Pubich a trip and find a boat crew. Or search for a trip that needs a crew in your area.</p>",display:"inline-block",position:"relative"});
    }
}
export class AppsList extends Div {
    constructor() {
        super({
          textAlign:"center",
          backgroundColor:"rgb(19, 138, 114,0.05)",
          children:[new App(),new App(),new App(),new App()]
        });
    }
}