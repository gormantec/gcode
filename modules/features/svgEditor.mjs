/* Feature Name: Help Menu */

export const menuMetadata =  {"id":"svgEditor","class":"pageLeftToolbarButton","materialIcon":"image"};


let svgEditorVisible = false;

function createSvgMenu(svgParams) {
    var pwaPanel = document.createElement("div");
    var pwaHeader = document.createElement("div");
    var pwaBody = document.createElement("div");
    pwaHeader.innerHTML = "[+] svg";
    pwaHeader.style.borderColor = "#AAAAAA";
    pwaHeader.style.borderWidth = "1px";
    pwaHeader.style.borderStyle = "solid";
    pwaHeader.style.padding = "5px";
    pwaBody.style.borderColor = "#AAAAAA";
    pwaBody.style.borderWidth = "1px";
    pwaBody.style.borderStyle = "solid";
    pwaBody.style.borderTopWidth = "0px";
    pwaBody.style.padding = "5px";
    pwaPanel.style.width = "420px";
    appendPWAParams(pwaBody, svgParams)
    pwaPanel.append(pwaHeader);
    pwaPanel.append(pwaBody);
    return { pwaPanel, pwaBody };
}

function createInput(param, value, eventListener) {
    var input = document.createElement("input");
    input.id = "input-param-" + param;
    input.type = "text";
    input.size = 30;
    input.value = value;
    input.addEventListener('change', function (evt) {
        eventListener(this.value);
    });
    input.addEventListener('input', function (evt) {
        if (evt.which == 13) {
            evt.preventDefault();
            eventListener(this.value);
        }
    });
    if (param == "color" || param == "backgroundColor" || param=="primaryColor") {
        input = colorInput(input);
    }
    else if (param == "backgroundPosition" || param == "backgroundRepeat" || param == "textAlign") {
        input = dropDownInput(input, param);
        input.addEventListener('change', function (evt) {
            eventListener(this.value);
        });
    }
    return input;
}

function appendSvgParams(pwaBody, svgParams) {
    if (pwaWidget && pwaBody) {
        for (var param in svgParams) {
            let pageDivRow = document.createElement("div");
            pageDivRow.style.width = "420px";
            let pageDivC1 = document.createElement("div");
            pageDivC1.style.display = "inline-block";
            pageDivC1.style.width = "180px";
            let pageDivC2 = document.createElement("div");
            pageDivC2.style.display = "inline-block";
            pageDivC2.style.width = "220px";
            pageDivRow.append(pageDivC1);
            pageDivRow.append(pageDivC2);
            pageDivC1.innerHTML = param;
            let _pwaWidget=pwaWidget;
            let _param=param;
            pageDivC2.append(createInput(param, svgParams[param], (v) => {
                _pwaWidget.params[_param] = v;
                refreshScreen();
            }));
            pwaBody.append(pageDivRow);
        }
    }
}

function createPageDiv() {
    let pageDiv = document.createElement("div");
    pageDiv.innerHTML = "";
    pageDiv.style.width = "100%";
    pageDiv.style.height = "100%";
    pageDiv.style.borderColor = "black";
    pageDiv.style.padding = "10px";
    pageDiv.style.margin = "0px";
    pageDiv.className = "pageDiv CodeMirror cm-s-material-darker2";
    pageDiv.id = "pageMiddle-" + menuMetadata.id;
    return pageDiv;
}

function showSvgEditor() {
    var source = window.editor.getValue();
    document.getElementById("pageMiddle").querySelector(".CodeMirror").style.display = "none";
    let rootMiddlePage = document.getElementById("pageMiddle-" + menuMetadata.id);
    if (rootMiddlePage) rootMiddlePage.remove();
    rootMiddlePage = createPageDiv();
    let pageImg = document.createElement("img");
    pageImg.src="data:image/svg+xml;utf8,"+source.replace(/\n/g, " ").replace(/\r/g, " ");;
    rootMiddlePage.append(pageImg);
    let svgMenu = createSvgMenu({"color":"red"},{"backgroundColor":"black"});
    rootMiddlePage.append(svgMenu);
    document.getElementById("pageMiddle").append(rootMiddlePage);
}

function hideSvgEditor() {
    var pageDiv = document.getElementById("pageMiddle-" + menuMetadata.id);
    if (pageDiv) pageDiv.remove();
    document.getElementById("pageMiddle").querySelector(".CodeMirror").style.display = "";
    if (window.editor) window.editor.refresh();
}

export function menuAction() {
    if (!svgEditorVisible) {
        showSvgEditor();
        svgEditorVisible = true;
    }
    else {
        hideSvgEditor();
        svgEditorVisible = false;
    }
}