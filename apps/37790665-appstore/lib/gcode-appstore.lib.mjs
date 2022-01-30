import {
    Div,
    AuthButtons
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
class App extends Div {
    constructor() {
        super({
            width: "180px",
            height: "300px",
            textAlign: "left",
            backgroundColor: "white",
            color: "#222222",
            margin: "5px",
            padding: "5px",
          	fontSize: "small",
            innerHTML: "<center><img src=\"https://play-lh.googleusercontent.com/y1J3-OrqJIlezTtaung2sPOnHY9wS2hdJh26ADkwcc3kdZy4DTGyv94IN_YRvdKy0y4=s360-rw\" width=160 height=160></center><p><b>boat crew</b>: Invite or meet new freinds. Pubich a trip and find a boat crew. Or search for a trip that needs a crew in your area.</p><div style=\"position:absolute;bottom:5px;left:5px;background-color:#138a72;border-radius:4px;padding:4px;color:white\"><a src=\"https://gcode.com.au/apps/37790665-boatcrew/index.html\">Open</a></div><div style=\"position:absolute;bottom:5px;right:5px\">****</div>",
            display: "inline-block",
            position: "relative"
        });
    }
}
export class AppsList extends Div {
    constructor() {
        super({
            textAlign: "center",
            backgroundColor: "rgb(19, 138, 114,0.1)",
            children: [new App(), new App(), new App(), new App()]
        });
    }
}