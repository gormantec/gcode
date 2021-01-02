export async function loadFeatures() {

    let res = await fetch('/.config.json');
    if (res.ok) {
        let json = await res.json();
        let arr = Array.from(json.features);
        arr = arr.sort((a, b) => a.navPosition > b.navPosition);
        arr.forEach((f) => {
            let res2 = await fetch(f.uri, { method: 'HEAD' });
            if (res2.ok) {
                let { afterLoad, menuMetadata, menuAction, toolbarMetadata, dialogMetadata, toolbarAction } = import(f.uri);
                if (menuMetadata) {
                    let meta = menuMetadata;
                    if (isArray(menuMetadata) && menuMetadata.length > 0) meta = menuMetadata[0];
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
                        d.setAttribute("data-action", button.dataAction);
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
                        d.onclick = toolbarAction;
                    });

                }

                if (isArray(dialogMetadata)) {
                    dialogMetadata.forEach((dialog) => {
                        let d = window.document.createElement("dialog");
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
                            Array.fom(dialog.content).forEach((widget) => {
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
                                }
                                else if (widget.type.startsWith("select")) {
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
                                }
                            });
                        }
                        form.appendChild(menu);
                        d.appendChild(form);
                        document.insertBefore(d, document.firstChild);
                    });
                }

                if (isFunction(afterLoad)) afterLoad();


            }
        }
        );
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
        arr.forEach((f) => {
            let res2 = await fetch(f.uri, { method: 'HEAD' });
            if (res2.ok) {
                let { refresh } = import(f.uri);
                if (isFunction(refresh)) refresh();
            }
        });
    }
}