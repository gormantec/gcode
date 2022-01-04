
import * as githubtree from '/modules/githubtree.mjs';

export const menuMetadata = { "id": "publishPWA", "class": "pageLeftToolbarButton", "materialIcon": "wysiwyg" };


export function menuAction() {

    document.getElementById("publishPwaDialog").showModal();
}


export const dialogMetadata = [
    {
        "id": "publishPwaDialog",
        "content": [
            {
                "id": "publishPwaDialogSelect", "type": "select", "label": "Action:", "options": [
                    { "value": "publish", "text": "Publish to GIT", "selected": true }
                ]
            },
        ],
        "ok": { "value": "publish" }//default value
    },
    {
        "id": "publishPwaDialogTimer",
        "type": "timer"
    }
];

export function dialogAction(event) {

    if (event.type == "dialog" && event.id == "publishPwaDialog") {
        if (event.value == "publish") {
            if (githubtree.getToken()) {

                publishToGit(window.editor.getValue());
            }
            else{
                confirm("Please login to GIT");
            }

        }
    }
    else if (event.type == "select" && event.id == "publishPwaDialogSelect") {
        event.setInputValue("confirmButton", event.value);
    }
}

export function afterLoad() {

}

function publishToGit(code, user)
{

}
