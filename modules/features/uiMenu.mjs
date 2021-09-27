/* Feature Name: UI Menu */
import { getImage, createHtml } from '/modules/htmlUtils.mjs';

export const menuMetadata = { "id": "uiMenu", "class": "pageLeftToolbarButton", "materialIcon": "wysiwyg" };

var focusPage = "";

function refreshScreen(mockFrameIframe, structure, block) {

    if (!block) {
        structure.forEach((b) => {
            if (b.class && b.class.name == focusPage.substring(21)) {
                block = b;
            }
        });
    }
    if (!block) return;

    for (var param in block.class.constructor.super) {
        var e = document.querySelector("div#pageMiddle-pageProps-" + block.class.name).querySelector("#input-param-" + param);
        block.class.constructor.super[param] = e.value.trim();
    }
    //document.getElementById("pageMiddle").querySelector(".CodeMirror").style.display = "";
    //pageDiv.remove();
    var sCode = structureToCode(structure);
    window.editor.setValue(sCode);
    let thisURL = window.location.href;
    sCode = sCode.replaceAll("https:\/\/gcode\.com\.au\/", thisURL);

    let regex3 = new RegExp("\.setPage\(.*?a.*?\).*?;\naPWA.show...", "g");

    sCode = sCode.replaceAll(regex3, ".setPage(a" + block.class.name + ");\naPWA.show();//changed");


    var result = createHtml(sCode);
    var splashBackgroundColor = result.splashBackgroundColor;
    var splash = result.splash;
    var mockFrame = result.mockFrame;
    var rootHTML = result.rootHTML;
    var _module = window.document.createElement("script");
    _module.setAttribute("type", "module");
    _module.text = "\n" + sCode + "\n";
    rootHTML.querySelector("head").appendChild(_module);
    _module = window.document.createElement("script");
    _module.setAttribute("type", "module");
    _module.text = "\n" + "window.PWA.globals.pwaInstances[0].addPageChangeListener((pageId)=>{window.top.postMessage('{\"event\":\"pageChange\",\"data\":{\"pageId\":\"'+pageId+'\"}}', '*');});" + "\n";
    rootHTML.querySelector("head").appendChild(_module);
    _module = window.document.createElement("script");
    _module.setAttribute("type", "module");
    _module.text = "\n" +
                    "window.onmessage = function(e) {if (JSON.parse(e.data).event == 'pageChange') {"+
                        "console.log(JSON.parse(e.data).data.pageId);"+
                        "var pageSelect=document.querySelector(\"#pageMiddle-pageselect\");"+
                        "pageSelect.value=JSON.parse(e.data).data.pageId;"+
                        "pageSelect.dispatchEvent(new Event(\"change\"));"+
                    "}};" + "\n";
    document.querySelector("head").appendChild(_module);
    
    var doc = mockFrameIframe.contentDocument || mockFrameIframe.contentWindow.document;
    rootHTML.getElementsByTagName("body")[0].innerHTML = "";
    doc.open();
    doc.writeln(rootHTML.outerHTML);
    doc.close();
}

function structureToCode(structure) {

    let resp = "";

    structure.forEach((block) => {
        if (block.comment) {
            resp = resp + block.comment + "\n";
        }
        else if (block.code) {
            resp = resp + block.code + "\n";
        }
        else if (block.class) {
            var params = block.class.constructor.super;
            var regex = /(class .*?extends .*?[ \{][\s\S]*?constructor[\s\S]*?super\()([\s\S]*?)\);[\s\S]*?\}([\s\S]*$)/g;
            var paramString = block.class.code.replaceAll(regex,
                'class ' + block.class.name + ' extends ' + block.class.extends + ' {\n    constructor() {\n        super(' +
                JSON.stringify(params, null, 4).replaceAll("\n    ", "\n            ").slice(0, -1) +
                '        });\n    }$3');
            var regex22 = /\"widget\((\S+?)\)\"/g;
            paramString = paramString.replaceAll(regex22,"$1");
            resp = resp + paramString + "\n";
        }
    });
    return resp;

}

function pushCode(structure, data) {
    if (data.code.trim().startsWith("class")) {

        var rx = /class (.*?) .*\n/g;
        var arr = rx.exec(data.code);
        var classname = arr[1];
        rx = /class .*?extends (.*?)[ \{][\s\S]*$/g
        arr = rx.exec(data.code);
        var extendsname = arr[1];
        rx = /class .*?extends .*?[ \{][\s\S]*?constructor[\s\S]*?super\(([\s\S]*?)\);[\s\S]*$/g;
        arr = rx.exec(data.code);
        const regex = /(\s*?)\"?([\S]*?)\"?(\s*?:[\s\"])/ig;
        var paramString = arr[1].replaceAll(regex, '$1\"$2\"$3');
        const regex6 = /(:\s*?)([a-z0-9]+?)([\s,])/ig;
        paramString = paramString.replaceAll(regex6, '$1\"widget($2)\"$3');

        var supername = JSON.parse(paramString.trim());
        let classCode = data.code;
        let count = 1;
        for (var i = data.code.indexOf("{") + 1; i < data.code.length && i > 0 && count > 0; i++) {
            let c = data.code.charAt(i);
            //if(c=="/" && data.code.charAt(i+1)=="/")i=data.code.indexOf("\n")+1;  
            //else if(c=="/" && data.code.charAt(i+1)=="*")i=data.code.indexOf("*/")+2;  
            if (c == "{") count++;
            else if (c == "}") count--;
            classCode = data.code.substring(0, i + 1);
        }
        structure.push({ class: { name: classname, extends: extendsname, constructor: { super: supername }, code: classCode } });
        if (data.code.trim().length > classCode.trim().length) {
            pushCode(structure, { code: data.code.substring(classCode.length).trim() });
        }
    }
    else {
        structure.push({ code: data.code });
    }

};

function splitComments(structure, _source) {
    _source = _source.trim();
    var firstBreak = _source.indexOf("/*");
    if (firstBreak >= 0) {
        if (_source.substring(0, firstBreak).trim().length > 0) pushCode(structure, { code: _source.substring(0, firstBreak).trim() });
        var secondBreak = _source.indexOf("*/", firstBreak + 2);
        if (secondBreak >= 0) {
            if (_source.substring(firstBreak, secondBreak + 2).trim().replaceAll("*", '') == "//") {
                var secondLineBreak = _source.indexOf("\n", secondBreak + 2);
                structure.push({ comment: _source.substring(firstBreak, secondLineBreak + 1).trim() });
                splitComments(structure, _source.substring(secondLineBreak + 1));
            }
            else {
                structure.push({ comment: _source.substring(firstBreak, secondBreak + 2).trim() });
                splitComments(structure, _source.substring(secondBreak + 2));
            }
        }
        else {
            structure.push({ comment: _source.substring(firstBreak.trim()) });
        }
    }
    else {
        if (_source.trim().length > 0) pushCode(structure, { code: _source.trim() });
    }
}

function createInput(param, value, eventListener) {
    var input = document.createElement("input");
    input.id = "input-param-" + param;
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
    return input;
}

function showUiEditor() {
    var source = window.editor.getValue();
    var structure = [];
    //  try {
    splitComments(structure, source);
    document.getElementById("pageMiddle").querySelector(".CodeMirror").style.display = "none";
    var pageDiv = document.getElementById("pageMiddle-" + menuMetadata.id);
    if (pageDiv) pageDiv.remove();
    pageDiv = document.createElement("div");
    var mockFrameDiv = document.createElement("div");
    var mockFrameIframe = document.createElement("iframe");
    mockFrameIframe.setAttribute("frameBorder", "0");
    mockFrameIframe.setAttribute("width", "414px");
    mockFrameIframe.setAttribute("height", "896px");
    mockFrameDiv.append(mockFrameIframe);
    mockFrameDiv.style.position = "absolute";
    mockFrameDiv.style.top = "20px";
    mockFrameDiv.style.right = "25px";
    mockFrameDiv.style.width = "420px";
    mockFrameDiv.style.height = "900px";
    mockFrameDiv.style.margin = "0px";
    mockFrameDiv.style.padding = "0px";
    mockFrameDiv.style.borderStyle = "none";
    mockFrameDiv.style.outline = "none";
    mockFrameDiv.id = "pageMiddle-mockFrame-" + menuMetadata.id;
    pageDiv.innerHTML = "";
    pageDiv.style.width = "100%";
    pageDiv.style.height = "100%";
    pageDiv.style.borderColor = "black";
    pageDiv.style.padding = "10px";
    pageDiv.style.margin = "0px";
    pageDiv.className = "pageDiv CodeMirror cm-s-material-darker2";
    pageDiv.id = "pageMiddle-" + menuMetadata.id;
    var pageDivRow = document.createElement("div");
    pageDivRow.style.width = "420px";
    let selectDiv = document.createElement("select");
    selectDiv.id="pageMiddle-pageselect";
    selectDiv.addEventListener('change', function (evt) {
        pageDiv.querySelector("div#" + focusPage).style.display = "none";
        pageDiv.querySelector("div#pageMiddle-pageProps-" + this.value).style.display = "";
        focusPage = "pageMiddle-pageProps-" + this.value;
        refreshScreen(mockFrameIframe, structure);
    });
    //pageDivRow.innerHTML='Page: ';
    pageDivRow.append(selectDiv);
    pageDiv.append(pageDivRow);
    for (let ii = 0; ii < structure.length; ii++) {
        let block = structure[ii];
        if (block.class && block.class.extends == "Page") {
            let pagePropsDiv = document.createElement("div");
            pagePropsDiv.id = "pageMiddle-pageProps-" + block.class.name;
            if (selectDiv.querySelectorAll("option").length > 0) pagePropsDiv.style.display = "none";
            else focusPage = "pageMiddle-pageProps-" + block.class.name;
            let option = document.createElement("option");
            option.value = block.class.name;
            option.innerHTML = block.class.name;
            selectDiv.append(option);
            pageDivRow = document.createElement("div");
            pageDivRow.style.width = "420px";
            var pageDivC1 = document.createElement("div");
            pageDivC1.style.display = "inline-block";
            pageDivC1.style.width = "180px";
            pageDivC1.innerHTML = "pageName";
            var pageDivC2 = document.createElement("div");
            pageDivC2.style.display = "inline-block";
            pageDivC2.style.width = "220px";
            pageDivC2.append(createInput("pageName", block.class.name, (v) => {
                pageDiv.querySelector("div#" + focusPage).id = "pageMiddle-pageProps-" + v;
                focusPage = "pageMiddle-pageProps-" + v;
                structure.forEach((block2) => {
                    if (block2.comment) {
                        block2.comment = block2.comment.replaceAll("\s*?" + block.class.name + "(", " " + v + "(");
                    }
                    else if (block2.code) {
                        let regex2 = new RegExp("\\s*?" + block.class.name + "\\(", "g");
                        block2.code = block2.code.replaceAll(regex2, " " + v + "(");
                    }
                    else if (block2.class) {
                        block2.class.code = block2.class.code.replaceAll("\s*?" + block.class.name + "(", " " + v + "(");
                    }
                });
                block.class.name = v;
                option.value = v;
                option.innerHTML = v;

                refreshScreen(mockFrameIframe, structure, block);
            }));
            pageDivRow.append(pageDivC1);
            pageDivRow.append(pageDivC2);
            pagePropsDiv.append(pageDivRow);

            let paramOptions = ["navigateBackPage", "innerHTML",
                "children",
                "child",
                "color",
                "top",
                "bottom",
                "left",
                "right",
                "borderRadius",
                "fontSize",
                "fontWeight",
                "borderWidth",
                "padding",
                "paddingTop",
                "textAlign",
                "lineHeight",
                "onclick",
                "width",
                "height",
                "backgroundColor",
                "backgroundPosition",
                "backgroundRepeat",
                "backgroundImage",
                "backgroundSize"];

            for (var param in block.class.constructor.super) {
                pageDivRow = document.createElement("div");
                pageDivRow.style.width = "420px";
                pageDivC1 = document.createElement("div");
                pageDivC1.style.display = "inline-block";
                pageDivC1.style.width = "180px";
                pageDivC2 = document.createElement("div");
                pageDivC2.style.display = "inline-block";
                pageDivC2.style.width = "220px";
                pageDivRow.append(pageDivC1);
                pageDivRow.append(pageDivC2);
                pageDivC1.innerHTML = param;
                pageDivC2.append(createInput(param,block.class.constructor.super[param],(v)=>{
                    block.class.constructor.super[param] = v;
                    refreshScreen(mockFrameIframe, structure, block);
                }));
                pagePropsDiv.append(pageDivRow);
            }
            for(var paramIndex in paramOptions)
            {
                if(!block.class.constructor.super[paramOptions[paramIndex]])
                {
                    pageDivRow = document.createElement("div");
                    pageDivRow.style.width = "420px";
                    pageDivC1 = document.createElement("div");
                    pageDivC1.style.display = "inline-block";
                    pageDivC1.style.width = "180px";
                    pageDivC2 = document.createElement("div");
                    pageDivC2.style.display = "inline-block";
                    pageDivC2.style.width = "220px";
                    pageDivRow.append(pageDivC1);
                    pageDivRow.append(pageDivC2);
                    pageDivC1.innerHTML = paramOptions[paramIndex];
                    let paramName=paramOptions[paramIndex];
                    pageDivC2.append(createInput(paramName,"",(v)=>{
                        block.class.constructor.super[paramName] = v;
                        refreshScreen(mockFrameIframe, structure, block);
                    }));
                    pagePropsDiv.append(pageDivRow);
                }
            }

            pageDiv.append(pagePropsDiv);
            pageDiv.append(mockFrameDiv);
            document.getElementById("pageMiddle").append(pageDiv);
            refreshScreen(mockFrameIframe, structure, block);

        }
    }
    refreshScreen(mockFrameIframe, structure);
    // }
    // catch (e) { console.log(e); }



}

function hideUiEditor() {
    var pageDiv = document.getElementById("pageMiddle-" + menuMetadata.id);
    if (pageDiv) pageDiv.remove();
    document.getElementById("pageMiddle").querySelector(".CodeMirror").style.display = "";
    if (window.editor) window.editor.refresh();
}


let uiEditorVisible = false;

export function menuAction() {
    if (!uiEditorVisible) {
        showUiEditor();
        uiEditorVisible = true;
    }
    else {
        hideUiEditor();
        uiEditorVisible = false;
    }
}