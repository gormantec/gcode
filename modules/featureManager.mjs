import dialogPolyfill from '/dist/dialog-polyfill/dialog-polyfill.esm.js';
import { save, load } from '/modules/gcodeStorage.mjs';

let fileChangedListeners=[];

function parsableJSON(value) {
    try {
        JSON.parse(value);
        return true;
    } catch (ex) {
        return false;
    }
}

export async function loadFeatures() {

    let s=load(".config.json");
    let json = parsableJSON(s)?JSON.parse(s):null;
    let ok = false;
    if (!json) {
        var res = await fetch('/config.json');
        ok = res.ok;
        if(res.ok)json = await res.json();
    }
    else ok = true;
    if (ok) {
        
        save(".config.json", json, false);
        let arr = Array.from(json.features);
        arr = arr.sort((a, b) => a.navPosition > b.navPosition);
        for (var ii = 0; ii < arr.length; ii++) {
            let f = arr[ii];
            let res2 = await fetch(f.uri, { "method": "HEAD" });
            if (res2.ok) {
                let dialogs = [];
                let { afterLoad, fileChanged, menuMetadata, menuAction, toolbarMetadata, toolbarAction, dialogMetadata, dialogAction,runButtonFileSufix,runButtonAction } = await import(f.uri);
                if(runButtonFileSufix && runButtonFileSufix.length>1 && runButtonFileSufix.indexOf(".")>=0 && runButtonAction)
                {
                    if (isFunction(runButtonAction)) {
                        document.getElementById("runHeaderButton").addEventListener("click", (e) =>{
                            var filename = document.getElementById("filename").innerText;
                            if (filename.endsWith(runButtonFileSufix)) {
                                return runButtonAction({ event: e });
                            }
                        }
                        );
                    }
                }
                if(fileChanged)
                {
                    if (isFunction(fileChanged)) {
                        fileChangedListeners.push(fileChanged);
                    }
                }
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
                        if(meta.materialIcon.startsWith("https://"))
                        {
                    
                            d.style.backgroundImage="url('"+meta.materialIcon+"')";
                            d.style.height="50px";
                            d.style.backgroundSize="cover";
                        }
                        else{
                            d.appendChild(i);
                        }
                        let pageLeftToolbar = window.document.querySelector("#pageLeftToolbar");
                        let terminalButton = window.document.querySelector("#terminalButton");
                        pageLeftToolbar.insertBefore(d, terminalButton);
                        if (isFunction(menuAction)) {
                            d.addEventListener("click", (e) => menuAction({ event: e }));
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
                        d.dataset.action = button.dataAction;
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
                        if(dialog.type=="timer")
                        {
                            let outer = window.document.createElement("div");   
                            outer.setAttribute("class", "timerOuter");
                            let inner = window.document.createElement("div");   
                            inner.setAttribute("class", "timerInner");
                            inner.setAttribute("id", dialog.id+"Value");
                            outer.appendChild(inner);
                            d.appendChild(outer);
                            document.body.insertBefore(d, document.body.firstChild);
                            dialogPolyfill.registerDialog(d);
                        }
                        else
                        {
                            let form = window.document.createElement("form");
                            form.setAttribute("method", "dialog");
                            form.setAttribute("id", dialog.id+"Form");
                            let menu = window.document.createElement("menu");
                            let b_cancel = window.document.createElement("button");
                            b_cancel.setAttribute("class", "cancelButton");
                            b_cancel.setAttribute("value", "cancel");
                            b_cancel.innerText = "Cancel";
                            let b_ok = window.document.createElement("button");
                            b_ok.setAttribute("id", "confirmButton");
                            b_ok.setAttribute("value", dialog.ok.value);
                            b_ok.innerText = "Ok";
                            menu.appendChild(b_cancel);
                            menu.appendChild(b_ok);
                            if (isArray(dialog.content)) {
                                Array.from(dialog.content).forEach((widget) => {
                                    
                                    if (widget.type.startsWith("input")) {
                                        var type = "text";
                                        if (widget.type.indexOf("/") > 0) type = widget.type.substring(widget.type.indexOf("/") + 1);
                                        let input = window.document.createElement("input");
                                        let p = window.document.createElement("p");
                                        let label = window.document.createElement("label");
                                        label.setAttribute("for", widget.id);
                                        if(widget.label)label.innerText = widget.label;
                                        input.setAttribute("id", widget.id);
                                        input.setAttribute("type", type);
                                        if(type=="file" && widget.accept) input.setAttribute("accept", widget.accept);
                                        if(widget.readonly)input.setAttribute("readonly",widget.readonly);
                                        p.appendChild(label);
                                        p.appendChild(input);
                                        if(type=="hidden")p.style.display="none";
                                        
                                        form.appendChild(p);
                                        if (isFunction(dialogAction)) {
                                            console.log("--------------");
                                            input.addEventListener('change', (e) => {
                                                console.log("--------------");
                                                console.log(e);
                                                var r = { "id": input.id,  "type": "input", "action": "change", "value": input.value, "setInputValue": (id, v) => d.querySelector("#" + id) ? d.querySelector("#" + id).value = v : null, "getInputValue": (id) => d.querySelector("#" + id) ? d.querySelector("#" + id).value : null };
                                                if(input.files!=null && input.files.length>0)r.files=input.files;
                                                dialogAction(r);
                                            });
                                        }
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
                                        if (isFunction(dialogAction)) {
                                            select.addEventListener('change', (e) => {
                                                var r = { "id": select.id, "type": "select", "action": "change", "value": select.value, "setInputValue": (id, v) => d.querySelector("#" + id) ? d.querySelector("#" + id).value = v : null, "getInputValue": (id) => d.querySelector("#" + id) ? d.querySelector("#" + id).value : null };
                                                dialogAction(r);
                                            });
                                        }
                                    }
                                });
                            }
                            form.appendChild(menu);
                            d.appendChild(form);
                            if (isFunction(dialogAction)) {
                                d.addEventListener('close', (e) => {
                                    var r = { "id": d.id, "type": "dialog", "action": "close", "value": d.returnValue, "setInputValue": (id, v) => d.querySelector("#" + id) ? d.querySelector("#" + id).value = v : null, "getInputValue": (id) => d.querySelector("#" + id) ? d.querySelector("#" + id).value : null };
                                    dialogAction(r);
                                });
                            }
                            document.body.insertBefore(d, document.body.firstChild);
                            dialogPolyfill.registerDialog(d);
                        }


                    });
                }

                if (isFunction(afterLoad)) {
                    try {
                        afterLoad();
                    }
                    catch (e) {
                        console.error(e);
                    }
                }
            }
            else {
                console.log("Error: " + f.uri + " does not exist.");
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
export function setFeature(fileType) {

    let r=false;
    for(let i=0;!r && i<fileChangedListeners.length;i++)
    {
        r=fileChangedListeners[i](fileType);
    }

}

