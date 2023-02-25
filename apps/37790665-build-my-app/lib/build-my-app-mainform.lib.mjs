import {
    Page,
    PWA,
    DivForm
} from 'https://gcode.com.au/modules/pwa.mjs';


export class MainForm extends DivForm {

    constructor() {
        super({
            paddingTop: "30px",
            formInputs: [{
                    name: "message",
                    type: "text",
                    height: "150px"
                },
                {
                    name: "drivers licence",
                    type: "select",
                    height: "40px",
                    options: ["No", "Yes"]
                },
                {
                    name: "aged 16 or over",
                    type: "select",
                    height: "40px",
                    options: ["No", "Yes"]
                },
                {
                    name: "crewAccountId",
                    type: "hidden"
                },
                {
                    name: "crewTimestamp",
                    type: "hidden"
                }
            ],
            sendButton: {
                onclick: sendAskButtonAction
            }
        });
    }
}
