import { DivForm } from 'https://gcode.com.au/modules/pwa.mjs';


export class MainForm extends DivForm {

    constructor() {
        super({
            paddingTop: "30px",
            formInputs: [
               {
                    name: "app name",
                    type: "text"
                },
                {
                    name: "show header",
                    type: "select",
                    height: "40px",
                    options: ["No", "Yes"]
                },
                {
                    name: "show footer",
                    type: "select",
                    height: "40px",
                    options: ["No", "Yes"]   
                },
                {
                    name: "show button",
                    type: "select",
                    height: "40px",
                    options: ["No", "Yes"]   
                },
               	{
                    name: "primary color",
                    type: "text" 
                },
               	{
                    name: "icon",
                    type: "text"
                },
                {
                    name: "crewAccountId",
                    type: "hidden"
                },
                {
                    name: "crewTimestamp",  
                    type: "hidden"
                },
               {
                    name: "message",
                    type: "text",
                    height: "150px"
                }
            ],
            sendButton: {
              	innerText: "build",
                onclick: ()=>{console.log("!");}
            }
        });
    }
}
