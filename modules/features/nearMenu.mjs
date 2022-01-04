/* Feature Name: Help Menu */

import { login, remove, compile, test } from '/modules/near/index.mjs';
import { createDownload, b64toBlob } from '/modules/createDownload.mjs';
import { parsejs } from '../parsejs.mjs';

import { save, load } from '/modules/gcodeStorage.mjs';

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
                    { "value": "test", "text": "Test", "selected": true },
                    { "value": "login", "text": "Login" },
                    { "value": "compile", "text": "Compile" },
                    { "value": "remove", "text": "Remove" }
                ]
            },
        ],
        "ok": { "value": "test" }
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
            if (confirm("Remove Account?")) {
                remove({ accountId: accountId, contractId: contractId }).catch(e => console.log(e));
            }

        }
        else if (event.value == "login") {

            login({ accountId: accountId, contractId: contractId }).catch(e => console.log(e));
        }
        else if (event.value == "compile") {

            var filename = document.getElementById("filename").innerText;

            if (filename.endsWith(".dapp.ts")) {
                import('/modules/ascompile.mjs').then(({ run }) => {
                    run(
                        window.editor.getValue(),
                        filename,
                        filename,
                        "optimized.wasm",
                        true,
                        (e, d) => {
                            if(e)console.log("error:"+e);
                            if(d)console.log("data:"+d);
                        });
                });
            }


        }
        else if (event.value == "test") {
            var data = window.editor.getValue();
            //console.log(data);
            parsejs(data, (testdata) => {
                test(testdata);
            });

        }
    }
    else if (event.type == "select" && event.id == "nearDialogSelect") {
        event.setInputValue("confirmButton", event.value);
    }
}

export function afterLoad() {
    var sourceCode = window.editor.getValue();
    var accountId = sourceCode.replace(/^[\s\S]*?@Near.*?"accountId".*?"(.*?)"[\s\S]*$/, "$1");
    var contractId = sourceCode.replace(/^[\s\S]*?@Near.*?"contractId".*?"(.*?)"[\s\S]*$/, "$1");
    document.getElementById("nearDialogName").value = accountId;
}
