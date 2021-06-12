/* Feature Name: Help Menu */

import { remove } from '/modules/near/index.mjs';

export const menuMetadata =  {"id":"removeNear","class":"pageLeftToolbarButton","materialIcon":"https://grants.near.org/Public/Custom/22766/near_icon_wht.png"};

export function menuAction(){

    document.getElementById("newFileDialog").showModal();
}


export const dialogMetadata = [
    {
        "id": "nearDialog",
        "content": [
            { "id": "nearDialogName", "type": "input/text", "label": "Account:",value:"xxxxxx",readonly:"readonly" },
            {
                "id": "nearDialogSelect", "type": "select", "label": "Action:", "options": [
                    { "value": "remove", "text": "Remove", "selected": true },
                ]
            },
        ],
        "ok": {  "value": "remove" }
    }
];

export function dialogAction(event) {
    if ( event.type=="dialog" && event.id=="nearDialog" && event.value == "remove") {
        var sourceCode=window.editor.getValue();
        var accountId = sourceCode.replace(/^[\s\S]*?@Near.*?"accountId".*?"(.*?)"[\s\S]*$/, "$1");
        var contractId = sourceCode.replace(/^[\s\S]*?@Near.*?"contractId".*?"(.*?)"[\s\S]*$/, "$1");
        remove({ accountId: accountId, contractId: contractId });
    }
    else if(event.type=="select" && event.id=="nearDialogSelect")
    {
    }
}

