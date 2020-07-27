var globals = {}
class PWA {
    constructor(params) {
        if (!params) params = {};
        this.title = params.title || "Code";
        this.primaryColor = params.primaryColor || "#005040";
        this.headerHeight = params.headerHeight || 60;
        this.headerFontSize = params.headerFontSize || 24;
        this.primaryColorText = this.getTextColor(this.primaryColor);
        this.footer = params.footer || "<a href=\"https://git.gormantec.com/gcode/\">gcode()</a> by gormantec";
        this.innerHTML = "";
        this.pwaRoot = new Div({ id: "pwaroot" });
        this.pwaOverlay = new Div({ id: "pwaoverlay" });
        this.setHeader();
        this.setBody();
        this.setFooter();
        this.setFloatingActionButton();
    }

    setNavigateBackPage(navigateBackPage) {
        this.navigateBackPage = navigateBackPage;
        this.showNavigateBackButton();
    }
    showNavigateBackButton() {
        this.navigateBackButton.style.display = "";
    }
    hideNavigateBackButton() {
        this.navigateBackButton.style.display = "none";
    }

    getTextColor(backColor) {

        var backColor = backColor.substring(1);      // strip #
        var rgb = parseInt(backColor, 16);   // convert rrggbb to decimal
        var r = (rgb >> 16) & 0xff;  // extract red
        var g = (rgb >> 8) & 0xff;  // extract green
        var b = (rgb >> 0) & 0xff;  // extract blue
        var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709
        if (luma < 124) {
            // pick a different colour
            return "#F0F0F0";
        }
        else {
            return "#0F0F0F";
        }
    }


    setHeader() {
        if (this.pwaHeader) this.pwaRoot.removeChild(this.pwaHeader);
        this.navigateBackButton = new Div({
            id: "pwaheaderback",
            child: new Div({
                tagName: "i",
                class: "material-icons",
                innerText: "keyboard_arrow_left"
            })
        });
        var _this = this;

        this.navigateBackButton.onclick(function () { 
            alert("click");
            if (_this.navigateBackPage) { 
                if(_this.navigateBackPage.navigateBackPage)_this.setNavigateBackPage(_this.navigateBackPage.navigateBackPage);
                else _this.hideNavigateBackButton();
                _this.setPage(_this.navigateBackPage);
             } 
        });

        this.pwaHeader = new Div({
            id: "pwaheader", tagName: "header", children: [
                this.navigateBackButton,
                new Div({ id: "pwaheadertitle", innerHTML: this.title })
            ]
        });
        this.pwaHeader.style.backgroundColor = this.primaryColor;
        this.pwaHeader.style.color = this.primaryColorText;
        if (this.headerHeight) this.pwaHeader.style.height = this.headerHeight - 25;
        if (this.headerFontSize) this.pwaHeader.style.fontSize = this.headerFontSize;
        this.pwaRoot.insertBefore(this.pwaHeader, this.pwaBody || this.pwaRoot.firstChild);
        if (!this.navigateBackPage) this.navigateBackButton.style.display = "none";
    }

    setBody() {
        if (this.pwaBody) this.pwaRoot.removeChild(this.pwaBody);
        this.pwaBody = new Div({ id: "pwabody" });
        this.pwaRoot.insertBefore(this.pwaBody, this.pwaFooter);
    }
    setPage(aPage) {
        console.log("setpage");
        if(aPage.navigateBackPage){
            console.log("setNavigateBackPage:"+aPage.navigateBackPage);
            this.setNavigateBackPage(aPage.navigateBackPage);
        }
        this.pwaBody.setChild({ child: aPage });

    }

    setFloatingActionButton() {
        if (this.floatingActionButton) this.pwaOverlay.removeChild(this.floatingActionButton);
        this.floatingActionButton = new Div({
            class: "floatingActionButton",
            child: new Div({
                tagName: "i",
                class: "material-icons",
                innerText: "add"
            })
        });
        this.floatingActionButton.style.backgroundColor = this.primaryColor;
        this.floatingActionButton.style.color = this.primaryColorText;
        this.pwaOverlay.appendChild(this.floatingActionButton);
    }
    setFooter() {
        if (this.pwaFooter) this.pwaRoot.removeChild(this.pwaFooter);
        this.pwaFooter = new Div({ id: "pwafooter", tagName: "footer", innerHTML: this.footer });
        this.pwaFooter.style.backgroundColor = this.primaryColor;
        this.pwaFooter.style.color = this.primaryColorText;
        this.pwaRoot.appendChild(this.pwaFooter);
    }

    addMeta(targetDocument, name, content) {
        var _meta = targetDocument.createElement("meta");
        _meta.setAttribute("name", name);
        _meta.setAttribute("content", content);
        targetDocument.head.appendChild(_meta);
    }

    addStyle(targetDocument, href) {
        var _style = targetDocument.createElement("link");
        _style.setAttribute("rel", "stylesheet");
        _style.setAttribute("href", href);
        targetDocument.head.appendChild(_style);
    }

    addModule(targetDocument, href) {
        var _script = targetDocument.createElement("script");
        _script.setAttribute("type", "module");
        _script.setAttribute("src", href);
        targetDocument.head.appendChild(_script);
    }

    show(win) {
        win = win || window;
        var _title = win.document.createElement("title");
        _title.innerText = this.title;
        win.document.head.appendChild(_title);
        win.document.body.style.backgroundColor = this.primaryColor;
        win.document.body.style.color = this.primaryColorText;
        this.addMeta(win.document, "mobile-web-app-capable", "yes");
        this.addMeta(win.document, "apple-touch-fullscreen", "yes");
        this.addMeta(win.document, "apple-mobile-web-app-title", this.title);
        this.addMeta(win.document, "apple-mobile-web-app-capable", "yes");
        this.addMeta(win.document, "apple-mobile-web-app-status-bar-style", "default");
        this.addMeta(win.document, "viewport", "width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0");
        this.addMeta(win.document, "msapplication-TileColor", "#005040");
        this.addMeta(win.document, "theme-color", "#005040");
        this.addStyle(win.document, "https://fonts.googleapis.com/icon?family=Material+Icons|Material+Icons+Outlined|Material+Icons+Two+Tone|Material+Icons+Round|Material+Icons+Sharp");
        this.addStyle(win.document, "https://git.gormantec.com/gcode/css/pwa.css");
        win.document.body.innerHTML = "";
        win.document.body.appendChild(this.pwaRoot.element);
        win.document.body.appendChild(this.pwaOverlay.element);
    }

    showFloatingActionButton() {
        this.floatingActionButton.style.display = "";
    }
    hideFloatingActionButton() {
        this.floatingActionButton.style.display = "none";
    }


    showFooter() {
        this.pwaFooter.style.display = "block";
        this.pwaBody.style.bottom = 30 + "px";
    }

    showHeader() {
        this.pwaHeader.style.display = "block";
        this.pwaBody.style.top = 30 + "px";
    }
    hideFooter() {
        this.pwaFooter.style.display = "none";
        this.pwaBody.style.bottom = "0px"
    }

    hideHeader() {
        this.pwaHeader.style.display = "none";
        this.pwaBody.style.top = "0px"
    }

    dynamicallyLoadScript(url) {
        var script = document.createElement("script");  // create a script DOM node
        script.src = url;  // set its src to the provided URL
        document.head.appendChild(script);  // add it to the end of the head section of the page (could change 'head' to 'body' to add it to the end of the body section instead)
    }
}



class Div {


    constructor(params) {
        var tagName = "div";
        if (params && params.tagName) tagName = params.tagName;
        this.element = document.createElement(tagName);
        if (params instanceof Div) this.element.appendChild(params.element);
        else if (params && params.innerText) this.element.innerText = params.innerText;
        else if (params && params.innerHTML) this.element.innerHTML = params.innerHTML;
        else if (params && params.child && params.child instanceof Div) {
            this.appendChild(params.child);
        }
        else if (params && params.children && params.children.length > 0) {
            var _this = this;
            Array.from(params.children).forEach(function (child) {
                if (child instanceof Div) {
                    _this.appendChild(child);
                }
            });
        }
        else if (params && params.child && params.child.element instanceof HTMLElement) this.element.appendChild(params.child.element);
        else if (params && params.child instanceof HTMLElement) this.element.appendChild(params.child);
        else if (params && params.child instanceof String) this.element.innerHTML = params.child;
        else if (params instanceof HTMLElement) this.element.appendChild(params);
        else if (params instanceof String) this.element.innerHTML = params;
        if (params && params.id) this.element.id = params.id;
        if (params && params.class) this.element.className = params.class;
        if (params && params.backgroundColor) this.element.style.backgroundColor = params.backgroundColor;
        if (params && params.backgroundPosition) this.element.style.backgroundPosition = params.backgroundPosition;
        if (params && params.backgroundRepeat) this.element.style.backgroundRepeat = params.backgroundRepeat;
        if (params && params.backgroundImage) this.element.style.backgroundImage = params.backgroundImage;
        //if (params.style) this.element.setAttribute("style",params.style);
    }
    onclick(afunc) {
        if (afunc && {}.toString.call(afunc) === '[object Function]') {
            this.element.onclick = afunc;
        }

    }

    htmlToElement(html) {
        var template = document.createElement('template');
        html = html.trim(); // Never return a text node of whitespace as the result
        template.innerHTML = html;
        return template.content.firstChild;
    }

    setChild(params) {
        console.log("setChild");
        if (!params && !params.child) return;
        this.element.innerHTML = "";
        this.appendChild(params);
    }

    appendChild(params) {
        console.log("appendChild");
        if (!params) return;
        else if (params instanceof Div && params.element instanceof Node) {
            this.element.appendChild(params.element);
        }
        else if (params && params.child && params.child.element instanceof HTMLElement) {
            console.log("appendChildDiv");
            this.element.appendChild(params.child.element);
        }
        else if (params && params.child instanceof HTMLElement) {
            this.element.appendChild(params.child);
        }
        else if (params && params.child instanceof String) {
            this.element.innerHTML = params.child;
        }
        else if (params instanceof HTMLElement) {
            this.element.appendChild(params);
        }
        else if (typeof params == "string") {
            this.element.appendChild(this.htmlToElement(params));
        }
    }

    insertBefore(n1, n2) {
        if (n1 instanceof Div) n1 = n1.element;
        if (n2 instanceof Div) n2 = n2.element;
        this.element.insertBefore(n1, n2);
    }
    removeChild(n1) {
        if (n1 instanceof Div) n1 = n1.element;
        this.element.removeChild(n1);
    }

    get firstChild() {
        return this.element.firstChild;
    }

    get style() {
        return this.element.style;
    }
}

class Page extends Div {
    constructor(params) {
        super(params);
        this.element.className = (this.element.className + " pwapage").trim();
        if (params.navigateBackPage instanceof Page) {
            this.navigateBackPage=params.navigateBackPage;
        }
    }
}


export { PWA, Page, Div };