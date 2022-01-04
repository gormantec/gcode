export function menuAction() {

    document.getElementById("publishPwaDialog").showModal();
}


export const dialogMetadata = [
    {
        "id": "publishPwaDialog",
        "content": [
            {
                "id": "publishPwaDialogSelect", "type": "select", "label": "Action:", "options": [
                    { "value": "publish", "text": "Test", "selected": true }
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
            if (confirm("Publish?")) {
            }

        }
    }
    else if (event.type == "select" && event.id == "publishPwaDialogSelect") {
        event.setInputValue("confirmButton", event.value);
    }
}

export function afterLoad() {

}
