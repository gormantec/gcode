import {
    PWA,
    Div,
    Script
} from 'https://gcode.com.au/modules/pwa.mjs';

import {
    getScript
} from 'https://gcode.com.au/modules/getScript.mjs';

const AppleID = await getScript('https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js', ["AppleID"]);

export class AppleAuthButton extends Div {
    constructor() {
        super({
            "display": "flex",
            "justifyContent": "center",
            child: new Div({
                "id": "appleid-signin",
                "position": "absolute",
                "data": {
                    "color": "black",
                    "border": "true",
                    "type": "sign in"
                },
                "bottom": "35px",
                "height": "32px",
                "width": "200px",
                borderRadius: "5px",
                paddingTop: "15px",
                fontSize: "24px",
                "cursor": "pointer",
                "pointerEvents": "auto",
                "textAlign": "center",
                "innerText": "Login"
            })
        });
        this.appendChild(new Script({
            code: "AppleID.auth.init(${P1});",
            params: {
                "P1": {
                    clientId: 'au.com.gcode.appleauth',
                    scope: 'name email',
                    redirectURI: 'https://gcode.com.au/apps/37790665-UDID/index.html',
                    state: 'e86d6da0f9cd53acd9cdada9cd8a6cdaabda9cd6cdada91da8c72d',
                    nonce: 'gormantec501',
                    usePopup: true
                }
            }
        }));
        // Listen for authorization success.
        document.addEventListener('AppleIDSignInOnSuccess', (event) => {
            // Handle successful response.
            console.log(event.detail);
        });

        // Listen for authorization failures.
        document.addEventListener('AppleIDSignInOnFailure', (event) => {
            // Handle error.
            console.log(event.detail.error);
        });
    }
}