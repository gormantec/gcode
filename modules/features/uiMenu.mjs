/* Feature Name: UI Menu */
import { getImage, createHtml } from '/modules/htmlUtils.mjs';

export const menuMetadata = { "id": "uiMenu", "class": "pageLeftToolbarButton", "materialIcon": "wysiwyg" };

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
                'class HomePage extends Page {\n    constructor() {\n        super(' +
                JSON.stringify(params, null, 4).replaceAll("\n    ", "\n            ").slice(0, -1) +
                '        });\n    }$3');
            resp = resp + paramString + "\n";
        }
    });
    return resp;

}

export function menuAction() {

    


    var source = window.editor.getValue();
    console.log(source.split("\n").length);
    var structure = [];

    var pushCode = (data) => {
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
            var supername = JSON.parse(paramString.trim());
            structure.push({ class: { name: classname, extends: extendsname, constructor: { super: supername }, code: data.code } });
        }
        else {
            structure.push({ code: data.code });
        }

    };

    var splitComments = (_source) => {
        _source = _source.trim();
        var firstBreak = _source.indexOf("/*");
        if (firstBreak >= 0) {
            if (_source.substring(0, firstBreak).trim().length > 0) pushCode({ code: _source.substring(0, firstBreak).trim() });
            var secondBreak = _source.indexOf("*/", firstBreak + 2);
            if (secondBreak >= 0) {
                if (_source.substring(firstBreak, secondBreak + 2).trim().replaceAll("*", '') == "//") {
                    var secondLineBreak = _source.indexOf("\n", secondBreak + 2);
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
    try {
        splitComments(source);

        structure.forEach((block) => {
            if (block.class && block.class.extends == "Page") {
                console.log(block);
                document.getElementById("pageMiddle").querySelector(".CodeMirror").style.display = "none";
                var pageDiv = document.getElementById("pageMiddle-"+menuMetadata.id);
                if(pageDiv) pageDiv.remove();
                pageDiv = document.createElement("div");
                var mockFrameDiv = document.createElement("div");
                var mockFrameIframe = document.createElement("iframe");
                mockFrameIframe.setAttribute("width","414px");
                mockFrameIframe.setAttribute("height","896px");
                mockFrameDiv.append(mockFrameIframe);
                
                mockFrameDiv.style.position="fixed";
                mockFrameDiv.style.width = "420px";
                mockFrameDiv.style.height = "900px";
                mockFrameDiv.id="pageMiddle-mockFrame-"+menuMetadata.id;
                pageDiv.innerHTML="";
                pageDiv.style.width = "100%";
                pageDiv.style.height = "100%";
                pageDiv.style.borderColor = "black";
                pageDiv.style.padding = "10px";
                pageDiv.style.margin = "0px";
                pageDiv.className = "pageDiv CodeMirror cm-s-material-darker2";
                pageDiv.id="pageMiddle-"+menuMetadata.id;
                for (var param in block.class.constructor.super) {
                    console.log(param + "=" + block.class.constructor.super[param]);
                    var pageDivRow = document.createElement("div");
                    pageDivRow.style.width = "420px";
                    var pageDivC1 = document.createElement("div");
                    pageDivC1.style.display = "inline-block";
                    pageDivC1.style.width = "180px";
                    var pageDivC2 = document.createElement("div");
                    pageDivC2.style.display = "inline-block";
                    pageDivC2.style.width = "220px";
                    pageDivRow.append(pageDivC1);
                    pageDivRow.append(pageDivC2);
                    pageDivC1.innerHTML = param;
                    var input = document.createElement("input");
                    input.id = "input-param-" + param;
                    input.size = 30;
                    input.value = block.class.constructor.super[param];
                    input.addEventListener('input', function (evt) {
                        console.log(this.value);
                        console.log(this.id);
                        block.class.constructor.super[this.id.substring(12)] = this.value;
                    });
                    pageDivC2.append(input);
                    pageDiv.append(pageDivRow);
                }

                var button = document.createElement("button");
                button.style.width = "50px";
                button.style.height = "30px";
                button.innerText = "save";
                button.style.marginTop = "20px";
                button.style.marginLeft = "180px";
                button.addEventListener("click", function () {
                    for (var param in block.class.constructor.super) {
                        var e = document.getElementById("pageMiddle").querySelector("#input-param-" + param);
                        console.log(e.value);
                        block.class.constructor.super[param] = e.value.trim();
                    }
                    //document.getElementById("pageMiddle").querySelector(".CodeMirror").style.display = "";
                    //pageDiv.remove();
                    var sCode=structureToCode(structure);
                    window.editor.setValue(sCode);
                    let thisURL=window.location.href;
                    sCode=sCode.replaceAll("https\:\/\/gcode\.com\.au\/",thisURL);
                    var result = createHtml(sCode);
                    var splashBackgroundColor = result.splashBackgroundColor;
                    var splash = result.splash;
                    var mockFrame = result.mockFrame;
                    var rootHTML = result.rootHTML;
                    var _module = window.document.createElement("script");
                    _module.setAttribute("type", "module");
                    _module.text = "\n" + window.editor.getValue() + "\n";
                    rootHTML.querySelector("head").appendChild(_module);
                    var doc = mockFrameIframe.contentDocument || mockFrameIframe.contentWindow.document;
                    rootHTML.getElementsByTagName("body")[0].innerHTML="";
                    console.log(rootHTML.outerHTML);
                    doc.open();
                    doc.writeln(rootHTML.outerHTML);
                    doc.close();



                });
                pageDiv.append(button);
                pageDiv.append(mockFrameDiv);
                document.getElementById("pageMiddle").append(pageDiv);

            }
        })
    }
    catch (e) { }

}