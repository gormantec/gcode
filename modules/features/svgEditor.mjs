/* Feature Name: Help Menu */

export const menuMetadata =  {"id":"svgEditor","class":"pageLeftToolbarButton","materialIcon":"image"};


let svgEditorVisible = false;

function createSvgMenu(svgParams) {
    var svgPanel = document.createElement("div");
    var svgHeader = document.createElement("div");
    var svgBody = document.createElement("div");
    svgHeader.innerHTML = "[+] svg";
    svgHeader.style.borderColor = "#AAAAAA";
    svgHeader.style.borderWidth = "1px";
    svgHeader.style.borderStyle = "solid";
    svgHeader.style.padding = "5px";
    svgBody.style.borderColor = "#AAAAAA";
    svgBody.style.borderWidth = "1px";
    svgBody.style.borderStyle = "solid";
    svgBody.style.borderTopWidth = "0px";
    svgBody.style.padding = "5px";
    svgPanel.style.width = "420px";
    appendSvgParams(svgBody, svgParams)
    svgPanel.append(svgHeader);
    svgPanel.append(svgBody);
    return { svgPanel, svgBody };
}

function createInput(param, value, eventListener) {

    console.log(param+"="+value);
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

function appendSvgParams(svgBody, svgParams) {
    if (svgParams && svgBody) {
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
            let _svgParams=svgParams;
            let _param=param;
            pageDivC2.append(createInput(param, svgParams[param], (v) => {
                _svgParams[_param] = v;
                //refreshScreen();
            }));
            svgBody.append(pageDivRow);
        }
    }
}
function colorInput(input) {
    input.type = "color";
    var input2 = document.createElement("input");
    input2.style.border = "none";
    input2.size = 10;
    input2.value = input.value;
    var pageDivC1 = document.createElement("div");
    pageDivC1.style.display = "inline-block";
    pageDivC1.style.backgroundColor = "white";
    pageDivC1.style.borderRadius = "2px";
    pageDivC1.style.width = "220px";
    pageDivC1.style.margin = "1px";
    var pageDivC11 = document.createElement("div");
    pageDivC11.style.display = "inline-block";
    pageDivC11.style.marginTop = "3px";
    pageDivC11.style.marginLeft = "3px";
    pageDivC11.style.backgroundColor = "white";
    pageDivC11.append(input2);

    var pageDivC2 = document.createElement("div");
    pageDivC2.style.display = "inline-block";
    pageDivC2.style.float = "right";
    pageDivC2.style.margin = "-2px";
    pageDivC2.append(input);
    pageDivC1.append(pageDivC11);
    pageDivC1.append(pageDivC2);
    input.addEventListener('change', function (evt) {
        input2.value = this.value;
    });
    input = pageDivC1;
    return input;
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
    let { svgPanel, svgBody } = createSvgMenu({"color":"#FF0000"},{"backgroundColor":"#0000FF"},{"height":"512px"},{"width":"512px"});
    rootMiddlePage.append(svgPanel);
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