/* Feature Name: Help Menu */

import { login, remove, compile, test } from '/modules/near/index.mjs';
import { createDownload,b64toBlob } from '/modules/createDownload.mjs';

export const menuMetadata = { "id": "removeNear", "class": "pageLeftToolbarButton", "materialIcon": "https://grants.near.org/Public/Custom/22766/near_icon_wht.png" };

export function menuAction() {

    document.getElementById("nearDialog").showModal();
}


export const dialogMetadata = [
    {
        "id": "nearDialog",
        "content": [
            { "id": "nearDialogName", "type": "input/text", "label": "Account:", value: "xxxxxx", readonly: "readonly" },
            {
                "id": "nearDialogSelect", "type": "select", "label": "Action:", "options": [
                    { "value": "remove", "text": "Remove", "selected": true },
                    { "value": "login", "text": "Login" },
                    { "value": "compile", "text": "Compile" },
                    { "value": "test", "text": "Test" },
                ]
            },
        ],
        "ok": { "value": "remove" }
    },
    {
        "id": "nearDialogTimer",
        "type": "timer"
    }
];

export function dialogAction(event) {

    if (event.type == "dialog" && event.id == "nearDialog") {
        var sourceCode = window.editor.getValue();
        var accountId = sourceCode.replace(/^[\s\S]*?@Near.*?"accountId".*?"(.*?)"[\s\S]*$/, "$1");
        var contractId = sourceCode.replace(/^[\s\S]*?@Near.*?"contractId".*?"(.*?)"[\s\S]*$/, "$1");

        if (event.value == "remove") {
            remove({ accountId: accountId, contractId: contractId }).catch(e => console.log(e));
        }
        else if (event.value == "login") {

            login({ accountId: accountId, contractId: contractId }).catch(e => console.log(e));
        }
        else if (event.value == "compile") {
            login({ accountId: accountId, contractId: contractId }).then(() => {

                compile([{ name: "assembly/index.ts", data: sourceCode, type: "string" }]).then((x) => {
                    b64toBlob(x, 'application/zip').then(blob => {
                        createDownload("assembly.zip", blob, { type: 'application/zip' });
                    });
                });
            });
        }
        else if (event.value == "test") {
            test({ accountId: accountId, contractId: contractId ,methods:[{method:"setGreeting",type:"changeMethods",parameters:{"message":"hello"}}]});
        }
    }
    else if (event.type == "select" && event.id == "nearDialogSelect") {
        event.setInputValue("confirmButton", event.value);
    }
}

export function afterLoad()
{
    var sourceCode = window.editor.getValue();
    var accountId = sourceCode.replace(/^[\s\S]*?@Near.*?"accountId".*?"(.*?)"[\s\S]*$/, "$1");
    var contractId = sourceCode.replace(/^[\s\S]*?@Near.*?"contractId".*?"(.*?)"[\s\S]*$/, "$1");
    document.getElementById("nearDialogName").value=accountId;
}
