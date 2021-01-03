import dialogPolyfill from '/dist/dialog-polyfill/dialog-polyfill.esm.js';

export async function loadFeatures() {



    let res = await fetch('/config.json');
    if (res.ok) {
        let json = await res.json();
        let arr = Array.from(json.features);
        arr = arr.sort((a, b) => a.navPosition > b.navPosition);
        for (var ii = 0; ii < arr.length; ii++) {
            let f = arr[ii];
            console.log('' + f.uri);
            let res2 = await fetch(f.uri, { "method": "HEAD" });
            if (res2.ok) {
                let dialogs=[];
                let { afterLoad, menuMetadata, menuAction, toolbarMetadata, dialogMetadata, toolbarAction } = await import(f.uri);

                if (menuMetadata) {
                    console.log("menuMetadata: exists");
                    let meta = menuMetadata;
                    if (isArray(menuMetadata) && menuMetadata.length > 0) meta = menuMetadata[0];

                    console.log("menuMetadata: ("+meta.id+") isArray="+isArray(menuMetadata) );
                    if (meta.id) {
                        let d = window.document.createElement("div");
                        let i = window.document.createElement("i");
                        d.setAttribute("id", meta.id);
                        d.setAttribute("class", meta.class);
                        i.setAttribute("class", "material-icons-outlined");
                        i.innerText = meta.materialIcon;
                        d.appendChild(i);
                        let pageLeftToolbar = window.document.querySelector("#pageLeftToolbar");
                        let terminalButton = window.document.querySelector("#terminalButton");
                        pageLeftToolbar.insertBefore(d, terminalButton);

                        console.log("Added: "+meta.id + " to  "+pageLeftToolbar);

                        if (isFunction(menuAction)) {
                            document.getElementById(meta.id).onclick = menuAction;
                        }
                    }
                }
                if (isArray(toolbarMetadata)) {
                    let pageLeftToolbar = window.document.querySelector("#pageLeftToolbarTop");
                    pageLeftToolbar.innerText = "";
                    toolbarMetadata.forEach((button) => {
                        let d = window.document.createElement("div");
                        let i = window.document.createElement("i");
                        let img = window.document.createElement("img");
                        d.setAttribute("class", "toolbarButton");
                        d.dataset.action=button.dataAction;
                        if (button.materialIcon) {
                            i.setAttribute("class", "material-icons");
                            i.innerText = button.materialIcon;
                            d.appendChild(i);
                        }
                        else if (button.imageIcon) {
                            img.setAttribute("src", button.imageIcon);
                            d.appendChild(img);
                        }
                        pageLeftToolbar.appendChild(d);
                        d.addEventListener("click", toolbarAction);
                    });

                }

                if (isArray(dialogMetadata)) {
                    dialogMetadata.forEach((dialog) => {
                        let d = window.document.createElement("dialog");
                        d.setAttribute("id", dialog.id);
                        dialogs[dialog.id] = d;
                        let form = window.document.createElement("form");
                        let menu = window.document.createElement("menu");
                        let b_cancel = window.document.createElement("button");
                        b_cancel.setAttribute("class", "cancelButton");
                        b_cancel.setAttribute("value", "cancel");
                        let b_ok = window.document.createElement("button");
                        b_ok.setAttribute("id", dialog.ok.id);
                        b_ok.setAttribute("value", dialog.ok.value);
                        menu.appendChild(b_cancel);
                        menu.appendChild(b_ok);
                        if (isArray(dialog.content)) {
                            Array.from(dialog.content).forEach((widget) => {
                                console.log(widget);
                                if (widget.type.startsWith("input")) {
                                    var type = "text";
                                    if (widget.type.indexOf("/") > 0) type = widget.type.substring(widget.type.indexOf("/") + 1);
                                    let input = window.document.createElement("input");
                                    let p = window.document.createElement("p");
                                    let label = window.document.createElement("label");
                                    label.setAttribute("for", widget.id);
                                    label.innerText = widget.label;
                                    input.setAttribute("id", widget.id);
                                    input.setAttribute("type", type);
                                    p.appendChild(label);
                                    p.appendChild(input);
                                    form.appendChild(p);
                                }
                                else if (widget.type.startsWith("select")) {
                                    console.log("found select");
                                    let select = window.document.createElement("select");
                                    let p = window.document.createElement("p");
                                    let label = window.document.createElement("label");
                                    label.setAttribute("for", widget.id);
                                    label.innerText = widget.label;
                                    select.setAttribute("id", widget.id);
                                    if (isArray(widget.options)) {
                                        Array.from(widget.options).forEach((o) => {
                                            let option = window.document.createElement("option");
                                            option.setAttribute("value", o.value);
                                            option.innerText = o.text;
                                            option.selected = (o.selected == true);
                                            select.appendChild(option);
                                        });
                                    }

                                    p.appendChild(label);
                                    p.appendChild(select);
                                    form.appendChild(p);
                                }
                            });
                        }
                        form.appendChild(menu);
                        d.appendChild(form);
                        document.body.insertBefore(d, document.body.firstChild);                    
                        dialogPolyfill.registerDialog(d);

                    });
                }

                if (isFunction(afterLoad)){
                    try{
                        afterLoad(dialogs);
                    }
                    catch(e){
                        console.error(e);
                    }
                }
            }
            else{
                console.log("Error: "+f.uri+" does not exist.");
            }
        }
    }
}

function isFunction(f) {
    return (f && {}.toString.call(f) === '[object Function]');

}

function isArray(a) {
    return (a && {}.toString.call(a) === '[object Array]');

}

export async function refreshFeatures() {
    let res = await fetch('/.config.json');
    if (res.ok) {
        let json = await res.json();
        let arr = Array.from(json.features);
        arr = arr.sort((a, b) => a.navPosition > b.navPosition);
        for (var ii = 0; ii < arr.length; ii++) {
            let f = arr[ii];
            let res2 = await fetch(f.uri, { method: 'HEAD' });
            if (res2.ok) {
                let { refresh } = await import(f.uri);
                if (isFunction(refresh)) refresh();
            }
        };
    }
}