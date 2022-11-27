/*jshint esversion: 9 */
import {
    Page,
    PWA,
    DivForm
} from 'https://gcode.com.au/modules/pwa.mjs';

import {
    login,
    contract
} from 'https://gcode.com.au/modules/near/index.mjs';

let _crewrequests;

async function nearConnect() {

    if (!_crewrequests && PWA.getPWA().userhash) {
        var config = await login({
            accountId: "gcode-4" + PWA.getPWA().userhash.toLowerCase() + ".testnet",
            contractId: "gcode-eeabe089d973.testnet"
        });
        config.methods = ["submitRequest", "listRequests"];
        _crewrequests = await contract(config);
        return _crewrequests;
    }
    return _crewrequests;
}


async function submitCrewRequest(data) {
    if (PWA.getPWA().userhash) {
        try {
            let crewrequests = await nearConnect();
            await crewrequests.submitRequest({
                fromAccountId: "gcode-4" + PWA.getPWA().userhash.toLowerCase() + ".testnet",
                toAccountId: data.crewAccountId,
                data: JSON.stringify(data)
            }, 300000000000000);
            console.log("sent");
        } catch (e) {
            console.log(e);
        }
    }
}

export async function listCrewRequest(accountId) {

    let requests=[];
  	try {
        let crewrequests = await nearConnect();
        let requestsStr = await crewrequests.listRequests({
            accountIds: JSON.stringify([accountId]),
            max: 20
        }, 300000000000000);
      requests=JSON.parse(requestsStr);
        console.log("retrived:" + requests);
    } catch (e) {
        console.log(e);
    }
    return requests;
}

function sendAskButtonAction(e) {

    var formMessage = e.parentDiv.querySelector("#formMessage").innerText;
    var formDriverslicence = e.parentDiv.querySelector("#formDriverslicence").value;
    var formAged16orover = e.parentDiv.querySelector("#formAged16orover").value;
    var formCrewAccountId = e.parentDiv.querySelector("#formCrewAccountId").value;
    console.log("formMessage:" + formMessage);
    console.log("formDriverslicence:" + formDriverslicence);
    console.log("formAged16orover:" + formAged16orover);
    console.log("formCrewAccountId:" + formCrewAccountId);
    PWA.getPWA().setPage(Page.getPage("SubmitPage"));
    if (PWA.getPWA().credentials) {
        submitCrewRequest({
            from: PWA.getPWA().credentials.name,
            message: formMessage,
            driverslicence: formDriverslicence,
            aged16orover: formAged16orover,
            crewAccountId: formCrewAccountId
        });
    }
    setTimeout(() => {
        PWA.getPWA().setPage(Page.getPage("ChatPage"));
    }, 2000);

}



export class AskDivForm extends DivForm {

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