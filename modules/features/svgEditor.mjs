/* Feature Name: Help Menu */

export const menuMetadata = { "id": "svgEditor", "class": "pageLeftToolbarButton", "materialIcon": "image" };


let svgEditorVisible = false;
let pageImg = null;

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

    console.log(param + "=" + value);
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
    if (param == "color" || param == "backgroundColor" || param == "primaryColor") {
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

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? "rgb(" + parseInt(result[1], 16) + "," + parseInt(result[2], 16) + "," + parseInt(result[3], 16) + ")" : hex;
}

function rgbToHex(rgb) {
    var a = rgb.split("(")[1].split(")")[0];
    a = a.split(",");
    var b = a.map(function (x) {             //For each array element
        x = parseInt(x).toString(16);      //Convert to a base16 string
        return (x.length == 1) ? "0" + x : x;  //Add zero if we get only one character
    });
    b = "0x" + b.join("");
}

function appendSvgParams(svgBody, svgParams) {
    if (svgParams && svgBody) {
        console.log(svgParams);
        for (var param in svgParams) {

            console.log(param);
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
            let _svgParams = svgParams;
            let _param = param;
            pageDivC2.append(createInput(param, svgParams[param], (v) => {
                var source = window.editor.getValue();
                if (_param == "height") {
                    source = source.replace(/(\<svg xmlns=".*?" enable-background=".*?" height=").*?(" viewBox=".*?" width=".*?">)/g, "$1" + v + "$2");
                    window.editor.setValue(source);
                }
                else if (_param == "width") {
                    source = source.replace(/(\<svg xmlns=".*?" enable-background=".*?" height=".*?" viewBox=".*?" width=").*?(">)/g, "$1" + v + "$2");
                    window.editor.setValue(source);
                }
                else if (_param == "color") {
                    if (v.startsWith("#")) v = hexToRgb(v);
                    source = source.replace(/\<path [.\s\S]*transform/g, "<path fill=\"" + v + "\" transform");
                    window.editor.setValue(source);
                }
                else if (_param == "iconName") {
                    source = source.replace(/(\<path [.\s\S]*?transform=".*?")[.\s\S]*?(d=)/g, "$1 name=\"" + v + "\" $2");
                    window.editor.setValue(source);
                }
                else if (_param == "backgroundColor") {
                    if (v.startsWith("#")) v = hexToRgb(v);
                    source = source.replace(/(\<rect fill=").*?(" height=".*?" width=".*?")/g, "$1" + v + "$2");
                    window.editor.setValue(source);
                }
                else if (_param == "borderRadius") {
                    source = source.replace(/(\<rect [.\s\S]*?rx=").*?("[.\s\S]*?>)/g, "$1" + v + "$2");
                    window.editor.setValue(source);
                }
                pageImg.src = "data:image/svg+xml;utf8," + source.replace(/\n/g, " ").replace(/\r/g, " ");;
                //text=text.replace(/\<svg xmlns=".*?" enable-background=".*?" height=".*?" viewBox=".*?" width=".*?">/g,"<svg xmlns=\"http://www.w3.org/2000/svg\" enable-background=\"new 0 0 30 30\" height=\"192\" viewBox=\"0 0 30 30\" width=\"192\">");
                //text=text.replace(/\<path /g,"<path transform=\"translate(3 3)\" ");
                //text=text.replace(/\<rect fill="none" height=".*?" width=".*?"/g,"<rect fill=\"%23323232\" rx=\"3\" height=\"30\" width=\"30\"");
            }));
            svgBody.append(pageDivRow);
        }
    }
}
function colorInput(input) {
    let _value = input.value;
    if (_value.startsWith("%23")) _value = "#" + c.substring(3);
    if (_value.startsWith("rbg")) _value = rgbToHex(_value);
    input.value=_value;

    input.type = "color";
    var input2 = document.createElement("input");
    input2.style.border = "none";
    input2.size = 20;
    input2.value = hexToRgb(input.value);
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
        input2.value = hexToRgb(this.value);
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
    pageImg = document.createElement("img");
    pageImg.src = "data:image/svg+xml;utf8," + source.replace(/\n/g, " ").replace(/\r/g, " ");;

    let c = source.match(/\<path[.\s\S]*?fill=".*?"[.\s\S]*?\>/g)[0];
    if (!c) c = hexToRgb("#AAAAAA");
    else c = c.replace(/(\<path[.\s\S]*?fill=")(.*?)("[.\s\S]*?\>)/g, "$2");
    if (c.startsWith("%23")) c = hexToRgb("#" + c.substring(3));
    else if (c.startsWith("#")) c = hexToRgb(c);

    let name = source.match(/\<path[.\s\S]*?name=".*?"[.\s\S]*?\>/g);
    if (name && name[0]) name = name[0].replace(/(\<path[.\s\S]*?name=")(.*?)("[.\s\S]*?\>)/g, "$2");
    else name = "";

    let bc = source.match(/\<rect[.\s\S]*?fill=".*?"[.\s\S]*?\>/g)[0];
    if (!bc) bc = hexToRgb("#222222");
    else bc = bc.replace(/(\<rect[.\s\S]*?fill=")(.*?)("[.\s\S]*?\>)/g, "$2");
    if (bc.startsWith("%23")) bc = hexToRgb("#" + bc.substring(3));
    else if (bc.startsWith("#")) bc = hexToRgb(bc);

    let h = source.match(/\<[.\s\S]*?height=".*?"[.\s\S]*?\>/g)[0];
    if (!h) h = "192";
    else h = h.replace(/(\<[.\s\S]*?height=")(.*?)("[.\s\S]*?\>)/g, "$2");

    let w = source.match(/\<[.\s\S]*?width=".*?"[.\s\S]*?\>/g)[0];
    if (!w) w = "192";
    else w = w.replace(/(\<[.\s\S]*?width=")(.*?)("[.\s\S]*?\>)/g, "$2");

    let br = source.match(/\<rect[.\s\S]*?rx=".*?"[.\s\S]*?\>/g)[0];
    if (!br) br = "3";
    else br = br.replace(/(\<rect[.\s\S]*?rx=")(.*?)("[.\s\S]*?\>)/g, "$2");

    let { svgPanel, svgBody } = createSvgMenu({ "color": c, "backgroundColor": bc, "height": "" + h, "width": "" + w, "borderRadius": "" + br, "iconName": "" + name });
    rootMiddlePage.append(svgPanel);
    rootMiddlePage.append(pageImg);
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