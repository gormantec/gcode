/* Feature Name: UI Menu */
import { getImage, createHtml, getImportLibFileList } from '/modules/htmlUtils.mjs';
import { cyrb53 } from '/modules/cyrb53.mjs';
import { load, preload } from '/modules/gcodeStorage.mjs';
import { getScript } from '/modules/getScript.mjs';
import { Div } from '/modules/pwa.mjs'
const getAcorn = getScript('https://cdnjs.cloudflare.com/ajax/libs/acorn/8.7.1/acorn.min.js', ["acorn"]);
let acornParser = null;
getAcorn.then(({ acorn }) => {
    acornParser = acorn;
});


export const menuMetadata = { "id": "uiMenu", "class": "pageLeftToolbarButton", "materialIcon": "wysiwyg" };

let focusPage = "";
const paramOptions = ["navigateBackPage", "innerHTML",
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
    "onpointerdown",
    "onpointerup",
    "onpointerenter",
    "onpointerleave",
    "width",
    "height",
    "backgroundColor",
    "backgroundPosition",
    "backgroundRepeat",
    "backgroundImage",
    "backgroundSize"];


function updateCodeFromStructure(sCode) {
    let sCode2 = sCode;
    let offset = 0;
    for (let ii = 0; ii < structure.length; ii++) {
        let block = structure[ii];
        if (block.type == "ClassDeclaration" && block.superClass.name == "Page") {
            console.log("-----------");
            console.log(block);
            console.log("-----------");

            let props = block.body.body[0].value.body.body[0].expression.arguments[0].properties;
            let newClassName = block.id.newName;
            let className = block.id.name;
            let nameStart = block.id.start;
            let nameEnd = block.id.end;

            if (block.sourceFile == "XXXXX") {
                //var sCode3=load(block.sourceFile)
                console.log("---sCode3");
                /*console.log(sCode3);
                for(let i=0;sCode3!=null && i<props.length;i++)
                {
                    if(props[i].value.type=="Literal")
                    {
                        let start=props[i].value.start;
                        let end=props[i].value.end;
                        let replacement=props[i].value.rawReplacement;
                        let rawValue=props[i].value.raw;
                        if(replacement && rawValue)
                        {
                            sCode3=sCode3.substring(0,start+offset)+replacement+sCode3.substring(end+offset);
                            offset=offset+(replacement.length-rawValue.length);
                        }
                    }
                }*/
            }
            else {
                if (newClassName && className) {
                    sCode2 = sCode2.substring(0, nameStart + offset) + newClassName + sCode2.substring(nameEnd + offset);
                    offset = offset + (newClassName.length - className.length);
                }
                for (let i = 0; i < props.length; i++) {
                    if (props[i].value.type == "Literal") {
                        let start = props[i].value.start;
                        let end = props[i].value.end;
                        let replacement = props[i].value.rawReplacement;
                        let rawValue = props[i].value.raw;
                        if (replacement && rawValue) {
                            sCode2 = sCode2.substring(0, start + offset) + replacement + sCode2.substring(end + offset);
                            offset = offset + (replacement.length - rawValue.length);
                        }
                    }
                }
            }
        }
    }
    return sCode2;
}

function parseStructure(sCode) {
    structure = acornParser.parse(sCode, { ecmaVersion: 2022, sourceType: "module" }).body;
    structure.forEach((sObject) => {
        if (sObject.type == "ImportDeclaration" && sObject.source && sObject.source.value.startsWith("./lib/") && sObject.source.value.endsWith(".lib.mjs")) {
            let subcode = load(sObject.source.value.substring(6));
            let substructure = acornParser.parse(subcode, { ecmaVersion: 2022, sourceType: "module" }).body;
            for (let ii = 0; ii < substructure.length; ii++) {
                let subblock = substructure[ii];
                if (subblock.declaration) {
                    if (subblock.type == "ExportNamedDeclaration" && subblock.declaration.type == "ClassDeclaration" && subblock.declaration.superClass.name == "Page") {
                        subblock.declaration.sourceFile = sObject.source.value;
                        structure.push(JSON.parse(JSON.stringify(subblock.declaration)));
                    }
                }
            }

        }
    });
}

async function refreshScreen() {

    let mockFrameIframe = document.getElementById("pageMiddle").querySelector("#pageMiddle-" + menuMetadata.id + "iframe");

    let block = null;

    for (let ii = 0; block == null && ii < structure.length; ii++) {
        let b = structure[ii];
        if (b.type == "ClassDeclaration" && (b.id.name == focusPage.substring(21) || b.id.newName == focusPage.substring(21))) {
            block = b;
        }
    }


    if (!block) return;

    let params = getSuperClassProperties(block);

    for (let param in params) {
        let bname = block.id.name;
        if (block.id.newName) bname = block.id.newName;
        let e = document.querySelector("div#pageMiddle-pageProps-" + bname).querySelector("#input-param-" + param);
        params[param] = e.value.trim();
    }
    //document.getElementById("pageMiddle").querySelector(".CodeMirror").style.display = "";
    //pageDiv.remove();
    let sCode = window.editor.getValue();
    sCode = updateCodeFromStructure(sCode);
    //let sCode = structureToCode();
    window.editor.setValue(sCode);
    parseStructure(sCode);

    let thisURL = window.location.href;
    sCode = sCode.replaceAll("https:\/\/gcode\.com\.au\/", thisURL);

    let regex3 = new RegExp("\.setPage\(.*?a.*?\).*?;\naPWA.show...", "g");
    var aNewPage = "a" + block.id.name;
    if (sCode.indexOf("a" + block.id.name) < 0) {
        aNewPage = "new " + block.id.name + "()";
    }
    sCode = sCode.replaceAll(regex3, ".setPage(" + aNewPage + ");\naPWA.show();//changed");

    let importFiles = getImportLibFileList(sCode);
    await preload(importFiles);


    for (let i = 0; i < importFiles.length; i++) {
        let slib = load(importFiles[i].dir + importFiles[i].name);
        if (slib && typeof slib == "string" && slib.length > 0) {
            let importFilesSLib = getImportLibFileList(slib, true);
            for (let j = 0; j < importFilesSLib.length; j++) {
                //for(let k=0;k<importFiles.length;k++)
                //{
                //    if(importFiles[k].name==importFilesSLib[j].name)
                //    {
                //        slib=slib.replace(new RegExp("import.*?\\sfrom\\s['\\\"]\\.\\/"+importFilesSLib[j].name+"['\\\"]","gi"),"/* "+importFilesSLib[j].name+" already loaded*/");
                //    }
                //}
                let slib2 = load(importFilesSLib[j].dir + importFilesSLib[j].name);
                slib = slib.replace("./" + importFilesSLib[j].name, "data:text/javascript;base64," + window.btoa(slib2));

            }
            sCode = sCode.replace("./lib/" + importFiles[i].name, "data:text/javascript;base64," + window.btoa(slib));
        }
    }




    let result = createHtml(sCode, { noInstallCode: true, noServiceWorker: true });
    let splashBackgroundColor = result.splashBackgroundColor;
    let splash = result.splash;
    let mockFrame = result.mockFrame;
    let rootHTML = result.rootHTML;
    let _module = window.document.createElement("script");
    _module.id = cyrb53("mainSourceCode");
    let exists = rootHTML.querySelector("head script[id='" + _module.id + "']");
    if (exists) exists.remove();
    _module.setAttribute("type", "module");
    _module.text = "\n" + sCode + "\n";
    rootHTML.querySelector("head").appendChild(_module);

    _module = window.document.createElement("script");
    _module.id = cyrb53("window.PWA.globals.pwaInstances[0].addPageChangeListener()");
    exists = rootHTML.querySelector("head script[id='" + _module.id + "']");
    if (!exists) {
        _module.setAttribute("type", "module");
        _module.text = "\n" + "window.PWA.globals.pwaInstances[0].addPageChangeListener((pageId)=>{window.top.postMessage('{\"event\":\"pageChange\",\"data\":{\"pageId\":\"'+pageId+'\"}}', '*');});" + "\n";
        rootHTML.querySelector("head").appendChild(_module);
    }
    let izoom = mockFrameIframe.getAttribute("data-zoom");
    rootHTML.querySelector("body").style.zoom = izoom;
    _module = window.document.createElement("script");
    _module.id = cyrb53("window.onmessage = function(e) {if (JSON.parse(e.data).event == 'pageChange') {}");
    exists = document.getElementById(_module.id);
    if (!exists) {
        _module.setAttribute("type", "module");
        _module.text = "\n" +
            "window.onmessage = function(e) {let data=null;\ntry{data=JSON.parse(e.data);}catch(e){}\nif (data && data.event == 'pageChange') {\n" +
            "console.log(JSON.parse(e.data).data.pageId);\n" +
            "let pageSelect=document.querySelector(\"#pageMiddle-" + menuMetadata.id + "-pageselect\");\n" +
            "pageSelect.value=JSON.parse(e.data).data.pageId;\n" +
            "pageSelect.dispatchEvent(new Event(\"change\"))\n;" +
            "}};" + "\n";
        document.querySelector("head").appendChild(_module);
    }

    let doc = mockFrameIframe.contentDocument || mockFrameIframe.contentWindow.document;
    rootHTML.getElementsByTagName("body")[0].innerHTML = "";
    doc.open();
    let theHtml = rootHTML.outerHTML;
    try {
        doc.writeln(theHtml);
    }
    catch (e) {
        comsole.log(e);
    }
    doc.close();
}

function structureToCode() {

    let resp = "";


    structure.forEach((block) => {
        if (block.comment) {
            resp = resp + block.comment + "\n";
        }
        else if (block.code) {
            resp = resp + block.code + "\n";
        }
        else if (block.widget && block.widget.class == "PWA") {
            let params = block.widget.params;
            let rx = /^(.*?)(\S*?)(\s*?=\s*?new[\s]*?)(\S*?)(\s*?\()([\s\S]*?)\)/g

            let paramString = block.widget.code.trim().replace(/(\".*?)(\))(.*?\")/g, "$1##CLBK##$3");
            paramString = paramString.replaceAll(rx, "$1$2$3$4$5" + JSON.stringify(params, null, 4) + ")");
            paramString = paramString.replaceAll("##CLBK##", ")");
            let regex27 = /\"widget\(([\s\S]+?)\)\"([,]?$)/gm;
            paramString = paramString.replaceAll(regex27, "$1$2");
            let regex22 = /(:\s*?)\"(function\s*?\(.*?\)\s*?\{.*\})\"/g;
            paramString = paramString.replaceAll(regex22, "$1$2");
            let regex23 = /(:\s*?)\"(this\.\S*?)\"/g;
            paramString = paramString.replaceAll(regex23, "$1$2");
            resp = resp + paramString + "\n";
        }
        else if (block.widget) {
            resp = resp + block.widget.code + "\n";
        }
        else if (block.class) {
            let params = block.class.constructor.super;
            for (let param in params) {
                params[param] = params[param].trim();
                params[param] = params[param].replaceAll("\"", "#####QUOTE#####")
            }
            let regex = /(class .*?extends .*?[ \{][\s\S]*?constructor[\s\S]*?super\()([\s\S]*?\}[\n\r\s]*?)\)[\s\r\n]*?;[\s\S]*?\}([\s\S]*$)/g;
            let paramString = block.class.code.replaceAll(regex,
                'class ' + block.id.name + ' extends ' + block.superClass.name + ' {\n    constructor() {\n        super(' +
                JSON.stringify(params, null, 4).replaceAll("%22", "\"").replaceAll("\n    ", "\n            ").slice(0, -1) +
                '        });\n    }$3');
            let regex27 = /\"widget\(([\s\S]+?)\)\"([,]?$)/gm;
            paramString = paramString.replaceAll(regex27, "$1$2");
            let regex22 = /(:\s*?)\"(function\s*?\(.*?\)\s*?\{.*\})\"/g;
            paramString = paramString.replaceAll(regex22, "$1$2");
            let regex23 = /(:\s*?)\"(this\.\S*?)\"/g;
            paramString = paramString.replaceAll(regex23, "$1$2");
            resp = resp + paramString + "\n";
            resp = resp.replaceAll("#####QUOTE#####", "\"");
        }
    });

    return resp;

}

function cleanParams(paramString) {
    paramString = paramString.trim();

    /*
        let inside=paramString.slice(1,-1);
        if(inside && inside.trim()!=null)
        {
            let rxNewWidget = /\(\s*?\{[\s\S]*?\}\s*?\)/g
            let arrNewWidgets = rxNewWidget.exec(inside);
            for(let i=0;arrNewWidgets!=null && i<arrNewWidgets.length;i++)
            {
                paramString=paramString.replace(arrNewWidgets[i],arrNewWidgets[i].replaceAll("\"","%22"));
            }
        }
    */





    let rgxOnCLick = /\"?onclick\"?\s*?:\s*?\(\s*?\)\s*?=>\s*?{?(.*)}?([\n|,])/g;
    paramString = paramString.replaceAll(rgxOnCLick, '\"onclick\":\"function(){ $1 }\"$2');

    const regex6 = /(:\s*?)(function\s*?\(.*?\)\s*?\{.*\})(\s*?[,}])/g;
    paramString = paramString.replaceAll(regex6, '$1\"$2\"$3');

    let allMatches = paramString.match(/\"?onclick\"?\s*?:\s*?\"(.*)"/g);
    for (let i = 0; i < allMatches.length; i++) {
        paramString.replaceAll("", "");
    }


    paramString = paramString.replace(/(new.*?\".*?)(\))(.*?\")/g, "$1##CLBK##$3");
    let rxNewClass = /:\s*?new\s*?([A-Za-z0-9\_\-]*?)\((.*?)\)[,|\n| ]/g;
    paramString = paramString.replaceAll(rxNewClass, ':{\"type\":\"new\",\"class\":\"$1\",\"params\":$2},');
    paramString = paramString.replaceAll("##CLBK##", ")");



    paramString = paramString.replace(/(new.*?\".*?)(\))(.*?\")/g, "$1##CLBK##$3");
    let rxFirstChildNewClass = /([\s\S*]\"children\"\s*?:\s*?\[\s\S*?\s*?)new\s*?([A-Za-z0-9\_\-]*?)\((((?!xx)[\s\S])*?)\)[,|\n| ]/;
    paramString = paramString.replace(rxNewClass, '$1:{\"type\":\"new\",\"class\":\"$2\",\"params\":$3},');
    paramString = paramString.replaceAll("##CLBK##", ")");



    const regex61 = /(:\s*?)(this\.\S*?\s*?)([,}])/g;
    paramString = paramString.replaceAll(regex61, '$1\"$2\"$3');
    const regex = /(\s*?)\"?([\S]*?)\"?(\s*?:[\s\"])/ig;
    paramString = paramString.replaceAll(regex, '$1\"$2\"$3');
    /*
        let wStrings = paramString.match(regex9);
    for(let i=0;wStrings && i<wStrings.length;i++)
    {
        console.log(wStrings[i]);
        paramString = paramString.replace(wStrings[i], "\"widget("+wStrings[i].replaceAll("\"","\\\"").replaceAll("\t"," ").replaceAll("\n"," ").replaceAll("    "," ").replaceAll("    "," ").replaceAll("   "," ").replaceAll("  "," ").trim()+")\"");
    }
    */
    const regex7 = /(^(?!import).*?:\s?)((?!.*\").*?)(\s*?[\,]?\s*?$)/gm;
    paramString = paramString.replaceAll(regex7, '$1\"widget($2)\"$3');
    const regex8 = /,[\s\n\r]*?\}[\s\n\r]*?$/ig;
    paramString = paramString.replaceAll(regex8, '}');
    return paramString;
}



function pushCode(data) {
    if (data.code.trim().startsWith("class")) {

        let rx = /class (.*?) .*\n/g;
        let arr = rx.exec(data.code);
        let classname = arr[1];
        rx = /class .*?extends (.*?)[ \{][\s\S]*$/g
        arr = rx.exec(data.code);
        let extendsname = arr[1];
        rx = /class .*?extends .*?[ \{][\s\S]*?constructor[\s\S]*?super\(([\s\S]*?\}\s*?)\)\s*?;[\s\S]*$/g;

        arr = rx.exec(data.code);
        if (arr != null) {
            let paramString = arr[1];
            paramString = cleanParams(paramString);
            let supername = JSON.parse(paramString.trim());
            let classCode = data.code;
            let count = 1;
            for (let i = data.code.indexOf("{") + 1; i < data.code.length && i > 0 && count > 0; i++) {
                let c = data.code.charAt(i);
                //if(c=="/" && data.code.charAt(i+1)=="/")i=data.code.indexOf("\n")+1;  
                //else if(c=="/" && data.code.charAt(i+1)=="*")i=data.code.indexOf("*/")+2;  
                if (c == "{") count++;
                else if (c == "}") count--;
                classCode = data.code.substring(0, i + 1);
            }
            let aClass = { class: { name: classname, extends: extendsname, constructor: { super: supername }, code: classCode } };

            structure.push(aClass);
            if (data.code.trim().length > classCode.trim().length) {
                pushCode({ code: data.code.substring(classCode.length).trim() });
            }
        }
        else {
            structure.push({ code: data.code });
        }

    }
    else {
        let codeLines = data.code.split(";");
        codeLines.forEach((line, i) => {



            if (line.trim() != "") {

                let line2 = line.replace(/(\".*?)(\))(.*?\")/g, "$1##CLBK##$3");
                let rx = /^(.*?)(\S*?)(\s*?=\s*?new[\s]*?)(\S*?)(\s*?\()([\s\S]*?)(\))$/g
                let arr = rx.exec(line2.trim());
                if (arr) {

                    let someParams = arr[6];
                    someParams = someParams.replaceAll("##CLBK##", ")");
                    someParams = cleanParams(someParams);
                    try { someParams = JSON.parse(someParams); } catch (e) { someParams = "{}"; }
                    line = line + ((i + 1) == codeLines.length ? "" : ";");
                    let aWidget = { widget: { name: arr[2], class: arr[4], params: someParams, code: line.trim() } };
                    structure.push(aWidget);
                }
                else {
                    line = line + ((i + 1) == codeLines.length ? "" : ";");
                    structure.push({ code: line.trim() });
                }

            }
        });

    }

};

function splitComments(_source) {
    _source = _source.trim();
    let firstBreak = _source.indexOf("/*");
    if (firstBreak >= 0) {
        if (_source.substring(0, firstBreak).trim().length > 0) pushCode({ code: _source.substring(0, firstBreak).trim() });
        let secondBreak = _source.indexOf("*/", firstBreak + 2);
        if (secondBreak >= 0) {
            if (_source.substring(firstBreak, secondBreak + 2).trim().replaceAll("*", '') == "//") {
                let secondLineBreak = _source.indexOf("\n", secondBreak + 2);
                structure.push({ comment: _source.substring(firstBreak, secondLineBreak + 1).trim() });
                splitComments(_source.substring(secondLineBreak + 1));
            }
            else {
                structure.push({ comment: _source.substring(firstBreak, secondBreak + 2).trim() });
                splitComments(_source.substring(secondBreak + 2));
            }
        }
        else {
            structure.push({ comment: _source.substring(firstBreak.trim()) });
        }
    }
    else {
        if (_source.trim().length > 0) pushCode({ code: _source.trim() });
    }
}

function dropDownInput(input, name) {
    //center
    let input2 = document.createElement("select");
    input2.id = input.id;
    let items = {
        backgroundRepeat: ["", "repeat", "repeat-x", "repeat-y", "no-repeat", "initial", "inherit"],
        backgroundPosition: ["", "center", "top", "left", "bottom", "right", "left top", "left center", "left bottom", "right top", "right center", "right bottom", "center top", "center center", "center bottom"],
        textAlign: ["", "left", "right", "center", "justify", "initial", "inherit"]
    };
    items[name].forEach((item) => {
        let option2 = document.createElement("option");
        option2.value = item;
        option2.innerHTML = item;
        if (item == input.value) option2.selected = "true"
        input2.append(option2);
    });

    input2.style.width = "220px";
    input2.style.paddingTop = "2px";
    input2.style.paddingBottom = "2px";
    input2.style.paddingRight = "0px";
    return input2;
}

function colorInput(input) {
    input.type = "color";
    let input2 = document.createElement("input");
    input2.style.border = "none";
    input2.size = 10;
    input2.value = input.value;
    let pageDivC1 = document.createElement("div");
    pageDivC1.style.display = "inline-block";
    pageDivC1.style.backgroundColor = "white";
    pageDivC1.style.borderRadius = "2px";
    pageDivC1.style.width = "220px";
    pageDivC1.style.margin = "1px";
    let pageDivC11 = document.createElement("div");
    pageDivC11.style.display = "inline-block";
    pageDivC11.style.marginTop = "3px";
    pageDivC11.style.marginLeft = "3px";
    pageDivC11.style.backgroundColor = "white";
    pageDivC11.append(input2);

    let pageDivC2 = document.createElement("div");
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

function createInput(param, value, eventListener) {
    let input = document.createElement("input");
    input.id = "input-param-" + param;
    input.type = "text";
    input.size = 30;
    input.value = value.replaceAll("%22", "\"");
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

let structure = [];



function getSuperClassProperties(block) {
    let props = block.body.body[0].value.body.body[0].expression.arguments[0].properties;
    let props2 = {};

    for (let i = 0; i < props.length; i++) {
        if (props[i].value.type == "Literal") {
            props2[props[i].key.value] = props[i].value.value;
        }
        else if (props[i].value.type == "NewExpression") {
            props2[props[i].key.value] = "widget(new " + props[i].value.callee.name + "(...))";
        }
    }
    return props2;
}
function setSuperClassPropertieValue(_blockIndex, name, value) {
    for (let i = 0; i < structure[_blockIndex].body.body[0].value.body.body[0].expression.arguments[0].properties.length; i++) {
        if (structure[_blockIndex].body.body[0].value.body.body[0].expression.arguments[0].properties[i].value.type == "Literal" && structure[_blockIndex].body.body[0].value.body.body[0].expression.arguments[0].properties[i].key.value == name) {
            structure[_blockIndex].body.body[0].value.body.body[0].expression.arguments[0].properties[i].value.rawReplacement = value;
        }
    }
}


function showUiEditor() {
    let source = window.editor.getValue();
    //while(structure.length>0)structure.pop();
    //  try {
    //splitComments(source);
    //structure=acornParser.parse(window.editor.getValue(), {ecmaVersion: 2022,sourceType: "module"}).body;
    parseStructure(source);
    document.getElementById("pageMiddle").querySelector(".CodeMirror").style.display = "none";
    let rootMiddlePage = document.getElementById("pageMiddle-" + menuMetadata.id);
    if (rootMiddlePage) rootMiddlePage.remove();
    rootMiddlePage = createPageDiv();
    rootMiddlePage.append(createMockFrameDiv());
    let { pwaPanel, pwaBody } = createPWAMenu(getWidgetByClass("PWA"));
    rootMiddlePage.append(pwaPanel);
    let { pagesPanel, pagesBody } = createPagesMenu();
    pagesBody.append(createPageSelect());
    rootMiddlePage.append(pagesPanel);
    document.getElementById("pageMiddle").append(rootMiddlePage);
    /*for (let ii = 0; ii < structure.length; ii++) {
         let block = structure[ii];
         if (block.class && block.class.extends == "Page") {
             let pagePropsDiv = createPagePropsDiv(block);
             appendClassParams( pagePropsDiv, block.class.constructor.super);
             appendBlankParams( pagePropsDiv, block.class.constructor.super);
             pagesBody.append(pagePropsDiv);
             //refreshScreen();
 
         }
     }*/
    for (let ii = 0; ii < structure.length; ii++) {
        let block = structure[ii];
        if (block.type == "ClassDeclaration" && block.superClass.name == "Page") {
            let blockIndex = ii;
            let pagePropsDiv = createPagePropsDiv(block, blockIndex);
            let props = getSuperClassProperties(block);
            appendClassParams(pagePropsDiv, props, block, blockIndex);
            appendBlankParams(pagePropsDiv, props);
            pagesBody.append(pagePropsDiv);
            //refreshScreen();

        }
    }

    refreshScreen();
    // }
    // catch (e) { console.log(e); }
}

function getWidgetByName(name) {
    let widget = null;
    for (let i = 0; i < structure.length && widget == null; i++) {
        if (structure[i].widget && structure[i].widget.name == name) {
            widget = structure[i].widget;
        }
    }
    return widget;
}
function getWidgetByClass(name) {
    let widget = null;
    for (let i = 0; i < structure.length && widget == null; i++) {
        if (structure[i].widget && structure[i].widget.class == name) {
            widget = structure[i].widget;
        }
    }
    return widget;
}

function createPagesMenu() {
    let pagesPanel = document.createElement("div");
    let pagesHeader = document.createElement("div");
    let pagesBody = document.createElement("div");

    let moreDiv = new Div({
        width:"200px",
        children: [
            new Div({
                id:"expandMorePages",
                tagName: "i",
                class: "material-icons",
                classNameOverride: true,
                innerText: "expand_more",
                display:"inline-block",
                onclick: ()=>{
                    document.getElementById("expandMorePages").style.display="none";
                    document.getElementById("expandLessPages").style.display="inline-block";
                    pagesBody.style.display="none";
                }
            }),new Div({
                tagName: "i",
                id:"expandLessPages",
                class: "material-icons",
                classNameOverride: true,
                innerText: "expand_less",
                display:"none",
                onclick: ()=>{
                    document.getElementById("expandLessPages").style.display="none";
                    document.getElementById("expandMorePages").style.display="inline-block";
                    pagesBody.style.display="inline-block";
                }
            }),
            new Div({
                display: "inline-block",
                innerText: "Pages",
                float: "right"
            })
        ]
    });
    pagesHeader.appendChild(moreDiv.element);
    pagesHeader.style.borderColor = "#AAAAAA";
    pagesHeader.style.borderWidth = "1px";
    pagesHeader.style.borderStyle = "solid";
    pagesHeader.style.padding = "5px";
    pagesBody.style.borderColor = "#AAAAAA";
    pagesBody.style.borderWidth = "1px";
    pagesBody.style.borderStyle = "solid";
    pagesBody.style.borderTopWidth = "0px";
    pagesBody.style.padding = "5px";
    pagesPanel.style.width = "420px";
    pagesPanel.append(pagesHeader);
    pagesPanel.append(pagesBody);
    return { pagesPanel, pagesBody };
}
function createPWAMenu(pwaWidget) {
    let pwaPanel = document.createElement("div");
    let pwaHeader = document.createElement("div");
    let pwaBody = document.createElement("div");

    let moreDiv = new Div({
        width:"200px",
        children: [
            new Div({
                id:"expandMorePWA",
                width:"20px",
                tagName: "i",
                class: "material-icons",
                classNameOverride: true,
                innerText: "expand_more",
                display:"inline-block",
                onclick: ()=>{
                    document.getElementById("expandMorePWA").style.display="none";
                    document.getElementById("expandLessPWA").style.display="inline-block";
                    pwaBody.style.display="none";
                }
            }),new Div({
                tagName: "i",
                id:"expandLessPWA",
                width:"20px",
                class: "material-icons",
                classNameOverride: true,
                innerText: "expand_less",
                display:"none",
                onclick: ()=>{
                    document.getElementById("expandLessPWA").style.display="none";
                    document.getElementById("expandMorePWA").style.display="inline-block";
                    pwaBody.style.display="inline-block";
                }
            }),
            new Div({
                display: "inline-block",
                innerText: "PWA",
                float: "right"
            })
        ]
    });

    pwaHeader.appendChild(moreDiv.element);


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
    appendPWAParams(pwaBody, pwaWidget)
    pwaPanel.append(pwaHeader);
    pwaPanel.append(pwaBody);
    return { pwaPanel, pwaBody };
}

function appendPWAParams(pwaBody, pwaWidget) {
    if (pwaWidget && pwaBody) {
        for (let param in pwaWidget.params) {
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
            let _pwaWidget = pwaWidget;
            let _param = param;
            pageDivC2.append(createInput(param, pwaWidget.params[param], (v) => {
                _pwaWidget.params[_param] = v;
                refreshScreen();
            }));
            pwaBody.append(pageDivRow);
        }
    }
}

function createPageSelect() {
    let pageDivRow = document.createElement("div");
    pageDivRow.style.width = "420px";
    let selectDiv = document.createElement("select");
    selectDiv.id = "pageMiddle-" + menuMetadata.id + "-pageselect";
    selectDiv.addEventListener('change', function (evt) {
        let pageDiv = document.getElementById("pageMiddle-" + menuMetadata.id);
        pageDiv.querySelector("div#" + focusPage).style.display = "none";
        pageDiv.querySelector("div#pageMiddle-pageProps-" + this.value).style.display = "";
        focusPage = "pageMiddle-pageProps-" + this.value;
        refreshScreen();
    });
    pageDivRow.append(selectDiv);
    return pageDivRow;
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

function createMockFrameDiv() {
    let mockFrameDiv = document.createElement("div");
    let mockFrameIframe = document.createElement("iframe");
    mockFrameIframe.setAttribute("id", "pageMiddle-" + menuMetadata.id + "iframe");
    mockFrameIframe.setAttribute("frameBorder", "0");
    let izoom = 1.0;
    if ((window.innerHeight - 200) <= 896) {
        izoom = (window.innerHeight - 200) / 896;
    }
    if ((window.innerWidth / 4) <= 414 * izoom && (window.innerWidth / 4) < 414) {
        izoom = (window.innerWidth / 4) / 414;
    }
    if (izoom < 0.3) izoom = 0.3;
    let iWidth = 414 * izoom;
    let iHeight = 896 * izoom;
    mockFrameIframe.setAttribute("width", iWidth + "px");
    mockFrameIframe.setAttribute("height", iHeight + "px");
    mockFrameIframe.setAttribute("data-zoom", izoom);
    mockFrameDiv.append(mockFrameIframe);
    mockFrameDiv.style.position = "absolute";
    mockFrameDiv.style.top = Math.round(2 + (20 * izoom)) + "px";
    mockFrameDiv.style.right = "25px";
    mockFrameDiv.style.width = (iWidth + 8) + "px";
    mockFrameDiv.style.height = "900px";
    mockFrameDiv.style.margin = "0px";
    mockFrameDiv.style.padding = "0px";
    mockFrameDiv.style.borderStyle = "none";
    mockFrameDiv.style.outline = "none";
    mockFrameDiv.id = "pageMiddle-mockFrame-" + menuMetadata.id;
    return mockFrameDiv;
}

function createPagePropsDiv(block, blockIndex) {
    let selectDiv = document.querySelector("#pageMiddle-" + menuMetadata.id + "-pageselect");
    let pagePropsDiv = document.createElement("div");
    pagePropsDiv.id = "pageMiddle-pageProps-" + block.id.name;
    if (selectDiv.querySelectorAll("option").length > 0) pagePropsDiv.style.display = "none";
    else focusPage = "pageMiddle-pageProps-" + block.id.name;
    let option = document.createElement("option");
    option.value = block.id.name;
    option.innerHTML = block.id.name;
    selectDiv.append(option);
    let pageDivRow = document.createElement("div");
    pageDivRow.style.width = "420px";
    let pageDivC1 = document.createElement("div");
    pageDivC1.style.display = "inline-block";
    pageDivC1.style.width = "180px";
    pageDivC1.innerHTML = "pageName";
    let pageDivC2 = document.createElement("div");
    pageDivC2.style.display = "inline-block";
    pageDivC2.style.width = "220px";
    let _blockIndex = blockIndex;
    pageDivC2.append(createInput("pageName", block.id.name, (v) => {
        let pageDiv = document.getElementById("pageMiddle-" + menuMetadata.id);
        pageDiv.querySelector("div#" + focusPage).id = "pageMiddle-pageProps-" + v;
        focusPage = "pageMiddle-pageProps-" + v;
        /* structure.forEach((block2) => {
             if (block2.comment) {
                 block2.comment = block2.comment.replaceAll("\s*?" + block.id.name + "(", " " + v + "(");
             }
             else if (block2.code) {
                 let regex2 = new RegExp("\\s*?" + block.id.name + "\\(", "g");
                 block2.code = block2.code.replaceAll(regex2, " " + v + "(");
             }
             else if (block2.class) {
                 block2.class.code = block2.class.code.replaceAll("\s*?" + block.id.name + "(", " " + v + "(");
             }
         });*/
        structure[_blockIndex].id.newName = v;
        option.value = v;
        option.innerHTML = v;

        refreshScreen();
    }));
    pageDivRow.append(pageDivC1);
    pageDivRow.append(pageDivC2);
    pagePropsDiv.append(pageDivRow);
    return pagePropsDiv;
}
function appendClassParams(pagePropsDiv, params, block, blockIndex) {
    for (let param in params) {
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
        let _param = param;
        let _blockIndex = blockIndex;
        pageDivC2.append(createInput(param, params[param], (v) => {
            params[_param] = v;
            setSuperClassPropertieValue(_blockIndex, _param, "\"" + v + "\"");
            refreshScreen();
        }));
        pagePropsDiv.append(pageDivRow);
    }
}
function appendBlankParams(pagePropsDiv, params) {
    for (let paramIndex in paramOptions) {
        if (!params[paramOptions[paramIndex]]) {
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
            pageDivC1.innerHTML = paramOptions[paramIndex];
            let paramName = paramOptions[paramIndex];
            pageDivC2.append(createInput(paramName, "", (v) => {
                params[paramName] = v;
                refreshScreen();
            }));
            pagePropsDiv.append(pageDivRow);
        }
    }
}



function hideUiEditor() {
    let pageDiv = document.getElementById("pageMiddle-" + menuMetadata.id);
    if (pageDiv) pageDiv.remove();
    document.getElementById("pageMiddle").querySelector(".CodeMirror").style.display = "";
    if (window.editor) window.editor.refresh();
}


let uiEditorVisible = false;

export function menuAction() {
    if (!uiEditorVisible && document.getElementById("filename").innerText.endsWith(".mjs") && !document.getElementById("filename").innerText.endsWith(".lib.mjs")) {
        showUiEditor();
        uiEditorVisible = true;
        document.getElementById("pageMiddle").querySelector(".CodeMirror").style.display = "none";
    }
    else {
        hideUiEditor();
        uiEditorVisible = false;
    }
}

export function fileChanged(fileType) {
    console.log("fileChanged");
    if (fileType != "javascript/module") {
        console.log("fileType!=javascript/module");
        hideUiEditor();
        uiEditorVisible = false;
    }
    else if (uiEditorVisible) {
        console.log("uiEditorVisible=true");
        showUiEditor();
        uiEditorVisible = true;
        return true;
    }
}