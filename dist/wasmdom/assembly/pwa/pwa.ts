import { Date, Document, URLSearchParams } from "../dom/document";
import { Window, setTimeout, fetch,  } from "../dom/window";
import { Element, EventCallback, Callback } from "../dom/element";
import { Style } from "../dom/style";
import { addMockFrame } from "../dom/mockFrameModule";
import { Debug, Promise, Response } from "wasmdom-globals";



var _thisPWA: PWA | null = null;
var _thisDiv: Div | null = null;
var _thisMSEC: i32 = 0;
var _rootWindow:Element;

class PWAParams {
    title: string = "GCode";
    primaryColor: string = "#005040";
    headerHeight: i32 = 80;
    footerHeight: i32 = 40;
    footerPadding: i32 = 15;
    headerFontSize: i32 = 24;
    footer: string = "<a href=\"https://gcode.com.au\">gcode()</a> by gormantec";
}


class PWA {
    title: string = "GCode";
    primaryColor: string = "#005040";
    headerHeight: i32 = 80;
    footerHeight: i32 = 40;
    footerPadding: i32 = 15;
    headerFontSize: i32 = 24;
    primaryColorText: string = "#000000";
    footer: string = "<a href=\"https://gcode.com.au\">gcode()</a> by gormantec";
    innerHTML: string = "";
    pwaRoot: Div;
    pwaOverlay: Div;
    navigateBackPage: Page | null = null;
    navigateBackButton: Div | null = null;
    pwaHeader: Div | null = null;
    pwaBody: Div | null = null;
    pwaFooter: Div | null = null;
    floatingActionButton: Div | null = null;
    icon180x180: string | null = null;
    splashDuration: i32 = 1000;

    constructor(params: PWAParams) {

        _rootWindow=new Element("temp");

        if (params.title) this.title = params.title;
        if (params.primaryColor) this.primaryColor = params.primaryColor;
        if (params.footer) this.footer = params.footer;
        this.headerHeight = params.headerHeight;
        this.footerHeight = params.footerHeight;
        this.footerPadding = params.footerPadding;
        this.headerFontSize = params.headerFontSize;
        this.primaryColorText = PWA.getTextColor(this.primaryColor);
        this.pwaRoot = new Div(<DivParams>{ id: "pwaroot" });

        this.pwaOverlay = new Div(<DivParams>{ id: "pwaoverlay" });
        this.setHeader();
        this.setBody();
        this.setFooter();
        this.setFloatingActionButton();
        this.pwaRoot.element.style.setProperty('--primaryColor', this.primaryColor);
        this.pwaRoot.element.style.setProperty('--primaryColorText', this.primaryColorText);

    }

    _navigateBackButtonClicked(): void {
        if (this.navigateBackPage) {
            if ((<Page>this.navigateBackPage).navigateBackPage) this.setNavigateBackPage(<Page>(<Page>this.navigateBackPage).navigateBackPage);
            else this.hideNavigateBackButton();
            this.setPage((<Page>this.navigateBackPage));
        }
    }




    setNavigateBackPage(navigateBackPage: Page): void {
        this.navigateBackPage = navigateBackPage;
        this.showNavigateBackButton();
    }
    showNavigateBackButton(): void {
        if (this.navigateBackButton) (<Div>this.navigateBackButton).style.display = "";
    }
    hideNavigateBackButton(): void {
        if (this.navigateBackButton) (<Div>this.navigateBackButton).style.display = "none";
    }

    public static getTextColor(backColor: string): string {

        var _backColor = backColor.substring(1);      // strip #
        var rgb: i32 = <i32>parseInt(_backColor, 16);   // convert rrggbb to decimal
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

    setHeader(): void {
        Debug.log("[setHeader]");
        if (this.pwaHeader) this.pwaRoot.removeChild(<Div>this.pwaHeader);
        this.navigateBackButton = new Div(<DivParams>{ id: "pwaheaderback", child: new Div(<DivParams>{ tagName: "i", "class": "material-icons", classNameOverride: true, innerText: "keyboard_arrow_left" }) });
        (<Div>this.navigateBackButton).onclick(() => {
            Debug.log("click");
            if (_thisPWA) (<PWA>_thisPWA)._navigateBackButtonClicked();
        });
        this.pwaHeader = new Div(<DivParams>{
            id: "pwaheader", tagName: "header", children: [
                (<Div>this.navigateBackButton),
                new Div(<DivParams>{ id: "pwaheadertitle", innerHTML: this.title })
            ]
        });
        (<Div>this.pwaHeader).style.backgroundColor = this.primaryColor;
        (<Div>this.pwaHeader).style.color = this.primaryColorText;
        if (this.headerHeight) (<Div>this.pwaHeader).style.height = this.headerHeight.toString();
        if (this.headerFontSize) (<Div>this.pwaHeader).style.fontSize = this.headerFontSize.toString();
        if (this.pwaBody) this.pwaRoot.insertBefore(<Div>this.pwaHeader, <Div>this.pwaBody);
        else this.pwaRoot.appendChild(<Div>this.pwaHeader);
        if (!this.navigateBackPage) (<Div>this.navigateBackButton).style.display = "none";
    }


    setBody(): void {
        Debug.log("[setBody]");
        if (this.pwaBody) this.pwaRoot.removeChild(<Div>this.pwaBody);
        this.pwaBody = new Div(<DivParams>{ id: "pwabody" });
        if (this.pwaFooter) this.pwaRoot.insertBefore(<Div>this.pwaBody, <Div>this.pwaFooter);
        else this.pwaRoot.appendChild(<Div>this.pwaBody);
    }

    setPage(aPage: Page): void {
        Debug.log("[setPage] " + aPage.element.toString());
        if (aPage.navigateBackPage) {
            Debug.log("[setPage] navigateBackPage=" + (<Div>(aPage.navigateBackPage)).element.toString());
            this.setNavigateBackPage(<Page>aPage.navigateBackPage);
        }
        Debug.log("[setPage]");
        if (this.pwaBody) {
            Debug.log("[setPage] pwaBody " + (<Div>this.pwaBody).toString());
            Debug.log("[setPage] pwaBody " + (<Div>this.pwaBody).element.toString());
        }

        if (this.pwaBody) (<Div>this.pwaBody).setChild(aPage);

    }

    setFloatingActionButton(): void {
        Debug.log("[setFloatingActionButton:start]");
        if (this.floatingActionButton) this.pwaOverlay.removeChild(<Div>this.floatingActionButton);
        this.floatingActionButton = new Div(<DivParams>{
            "class": "floatingActionButton",
            child: new Div(<DivParams>{
                tagName: "i",
                "class": "material-icons",
                classNameOverride: true,
                innerText: "add"
            })
        });
        (<Div>this.floatingActionButton).style.backgroundColor = this.primaryColor;
        (<Div>this.floatingActionButton).style.color = this.primaryColorText;
        this.pwaOverlay.appendChild(<Div>this.floatingActionButton);
        Debug.log("[setFloatingActionButton:end]");
    }
    setFooter(): void {
        Debug.log("[setFooter]");
        if (this.pwaFooter) this.pwaRoot.removeChild(<Div>this.pwaFooter);
        this.pwaFooter = new Div(<DivParams>{ id: "pwafooter", tagName: "footer", innerHTML: this.footer });
        (<Div>this.pwaFooter).style.backgroundColor = this.primaryColor;
        (<Div>this.pwaFooter).style.color = this.primaryColorText;
        this.pwaRoot.appendChild(<Div>this.pwaFooter);
    }

    addMeta(targetDocument: Document, name: string, content: string): void {
        Debug.log("[addMeta]");
        var _meta = targetDocument.createElement("meta");
        _meta.setAttribute("name", name);
        _meta.setAttribute("content", content);
        if (!targetDocument.querySelector('meta[name="' + name + '"]')) {
            var linkStyleOrScript = targetDocument.querySelector("head link");
            if (linkStyleOrScript) linkStyleOrScript = targetDocument.querySelector("head style");
            if (linkStyleOrScript) linkStyleOrScript = targetDocument.querySelector("head script");
            targetDocument.head.insertBefore(_meta, linkStyleOrScript);
        }
    }
    addLink(targetDocument: Document, rel: string, href: string): void {
        Debug.log("[addLink]");
        var _meta = targetDocument.createElement("link");
        _meta.setAttribute("rel", rel);
        _meta.setAttribute("href", href);
        var styleOrScript = targetDocument.querySelector("head style");
        if (styleOrScript) styleOrScript = targetDocument.querySelector("head script");
        targetDocument.head.insertBefore(_meta, styleOrScript);
    }
    addStyle(targetDocument: Document, href: string, callback: () => void): void {
        Debug.log("[addStyle]");
        var _style = targetDocument.createElement("link");
        _style.setAttribute("rel", "stylesheet");
        _style.setAttribute("href", href);
        if (callback) { _style.addEventListener(new EventCallback("load", callback)); }
        targetDocument.head.insertBefore(_style, targetDocument.querySelector("head script"));
    }

    addModule(targetDocument: Document, href: string): void {
        var _script = targetDocument.createElement("script");
        _script.setAttribute("type", "module");
        _script.setAttribute("src", href);
        targetDocument.head.appendChild(_script);
    }



    addStyleTag(targetDocument: Document, id: string, text: string): void {
        Debug.log("[addStyleTag]");
        var _style = targetDocument.createElement("style");
        _style.setAttribute("id", id);
        _style.innerText = text;
        targetDocument.head.insertBefore(_style, targetDocument.querySelector("head script"));
    }

    fadeIn(element: Element, duration: i32): void {
        this.addStyleTag(Window.window.document, "fadeIn", "@keyframes fadeIn { 0% { opacity:0; } 100% { opacity:1; } }");
        element.style.animationName = "fadeIn";
        element.style.animationDuration = duration.toString() + "ms";
        element.style.animationTimingFunction = "ease";
    };


    show(win: Window): void {
        Debug.log("[show]");
        Window.window = win;
        _rootWindow = win.document.body;
        _thisMSEC = <i32>Date.now();
        const urlParams = new URLSearchParams(win.location.search);
        Debug.log("urlParams.mockFrame="+urlParams.get("mockFrame"));
        if(win.location.search) Debug.log("win.location.search="+<String>win.location.search);
        var mockFrame = urlParams.get("mockFrame");
        var aPWA = this;
        if (mockFrame && mockFrame.length>0) {
            _rootWindow=addMockFrame(win, aPWA, mockFrame);
        }
        var _title: Element = win.document.createElement("title");
        _title.innerText = this.title;
        var a: Element | null = win.document.head.firstChild;
        win.document.head.insertBefore(_title, a);
        if (!win.PWA.globals.splashColor) win.document.body.style.backgroundColor = this.primaryColor;
        if (!win.PWA.globals.splashColor) win.document.body.style.color = this.primaryColorText;
        if (win.PWA.globals.icon180x180 && !this.icon180x180) this.icon180x180 = win.PWA.globals.icon180x180;
        _rootWindow.style.color = this.primaryColorText;
        this.addMeta(win.document, "mobile-web-app-capable", "yes");
        this.addMeta(win.document, "apple-touch-fullscreen", "yes");
        this.addMeta(win.document, "apple-mobile-web-app-title", this.title);
        this.addMeta(win.document, "apple-mobile-web-app-capable", "yes");
        this.addMeta(win.document, "apple-mobile-web-app-status-bar-style", "black-translucent");
        this.addMeta(win.document, "viewport", "viewport-fit=cover, user-scalable=no, width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0");
        this.addMeta(win.document, "msapplication-TileColor", this.primaryColor);
        this.addMeta(win.document, "theme-color", this.primaryColor);
        _thisPWA = this;
        this.addStyle(win.document, "https://fonts.googleapis.com/icon?family=Material+Icons|Material+Icons+Outlined|Material+Icons+Two+Tone|Material+Icons+Round|Material+Icons+Sharp", function () {

            Debug.log("[show:8]");

            (<PWA>_thisPWA).addStyle(Window.window.document, "https://gcode.com.au/css/pwa.css", function () {

                Debug.log("[show:9]");

                if (Window.window.PWA.globals.splashDuration) Debug.log("splashDuration:" + <string>Window.window.PWA.globals.splashDuration);
                if (Window.window.PWA.globals.splashDuration) (<PWA>_thisPWA).splashDuration = <i32>parseInt(<string>Window.window.PWA.globals.splashDuration);
                else if (!(<PWA>_thisPWA).splashDuration) (<PWA>_thisPWA).splashDuration = 2000;
                var timeoutMs: i32 = (<PWA>_thisPWA).splashDuration - <i32>(Date.now() - _thisMSEC);
                Debug.log("timeoutMs:" + timeoutMs.toString());

                if (timeoutMs < 0) timeoutMs = 10;
                Debug.log("SHOW in " + timeoutMs.toString());
                setTimeout(function () {
                    Debug.log("[show:10]");
                    while (_rootWindow.firstChild) _rootWindow.removeChild(_rootWindow.lastChild);
                    //Window.window.document.body.style.backgroundColor = (<PWA>_thisPWA).primaryColor;
                    //Window.window.document.body.style.color = (<PWA>_thisPWA).primaryColorText;
                    Debug.log("SHOW");
                    _rootWindow.appendChild((<PWA>_thisPWA).pwaRoot.element);
                    _rootWindow.appendChild((<PWA>_thisPWA).pwaOverlay.element);
                    (<PWA>_thisPWA).fadeIn((<PWA>_thisPWA).pwaRoot.element, 500);

                }, timeoutMs);

            });


        });



    }
    showFloatingActionButton(): void {
        if (this.floatingActionButton) (<Div>this.floatingActionButton).style.display = "";
    }
    hideFloatingActionButton(): void {
        if (this.floatingActionButton) (<Div>this.floatingActionButton).style.display = "none";
    }


    showFooter(): void {
        if (this.pwaFooter) {
            (<Div>this.pwaFooter).style.display = "";
            (<Div>this.pwaFooter).style.padding = this.footerPadding.toString() + "px";
            (<Div>this.pwaFooter).style.footerHeight = (this.footerHeight - (2 * this.footerPadding)).toString() + "px";
            if (this.pwaBody) (<Div>this.pwaBody).style.bottom = "30px";
        }
    }

    showHeader(): void {
        if (this.pwaHeader) (<Div>this.pwaHeader).style.display = "";
        if (this.pwaBody) (<Div>this.pwaBody).style.top = this.headerHeight.toString() + "px";
    }
    hideFooter(): void {
        if (this.pwaFooter) (<Div>this.pwaFooter).style.display = "none";
        if (this.pwaBody) (<Div>this.pwaBody).style.bottom = (this.footerPadding * 2 + this.footerHeight).toString() + "px"
    }

    hideHeader(): void {
        if (this.pwaHeader) (<Div>this.pwaHeader).style.display = "none";
        if (this.pwaBody) (<Div>this.pwaBody).style.top = "0px"
    }

    dynamicallyLoadScript(url: string): void {
        if (!Window.window) return;
        var script = Window.window.document.createElement("script");  // create a script DOM node
        script.src = url;  // set its src to the provided URL
        Window.window.document.head.appendChild(script);  // add it to the end of the head section of the page (could change 'head' to 'body' to add it to the end of the body section instead)


    }
}

class OnClick { listener: () => void };

class DivParams {
    id: string | null = null;
    tagName: string | null = null;
    class: string | null = null;
    classNameOverride: bool = false;
    innerText: string | null = null;
    child: Div | null = null;
    children: Div[] | null = null;
    innerHTML: string | null = null;
    color: string | null = null;
    width: string | null = null;
    height: string | null = null;
    top: string | null = null;
    bottom: string | null = null;
    left: string | null = null;
    right: string | null = null;
    borderRadius: string | null = null;
    fontSize: string | null = null;
    padding: string | null = null;
    textAlign: string | null = null;
    onclick: OnClick | null = null;
    backgroundColor: string | null = null;
    backgroundPosition: string | null = null;
    backgroundRepeat: string | null = null;
    backgroundImage: string | null = null;
    backgroundSize: string | null = null;
}

class Div {
    element: Element;
    constructor(params: DivParams) {

        var tagName: string = "div";
        if (!Window.window) throw new Error("Window must be initialised.");

        var document: Document = Window.window.document;

        if (params && params.tagName) tagName = <string>params.tagName;
        this.element = document.createElement(tagName);
        if (params && !params.classNameOverride) this.element.className = "pwadiv";
        if (params instanceof Div) this.element.appendChild(params.element);
        else if (params && params.innerText) {
            Debug.log("innerText:" + <string>params.innerText);
            this.element.innerText = <string>params.innerText;
        }
        else if (params && params.innerHTML && (<string>params.innerHTML).substring(0, 4).toLowerCase() == "url(") {
            var _uri = (<string>params.innerHTML).trim().substring(4, (<string>params.innerHTML).length - 1);

            var prom: Promise = fetch(_uri,"GET","","");
            _thisDiv = this;
            prom.then((r: Response) => {
                return r.text();
            },null).thenString((text: string) => {
                (<Div>_thisDiv).element.innerHTML = text;
                _thisDiv = null;
                return null;
            });

        }
        else if (params && params.innerHTML) this.element.innerHTML = (<string>params.innerHTML);
        else if (params && params.child && params.child instanceof Div) {
            this.appendChild(<Div>params.child);
        }
        else if (params && params.children && (<Div[]>params.children).length > 0) {

            var arr: Div[] = (<Div[]>params.children);
            for (var i = 0; i < arr.length; i++) {
                this.appendChild(arr[i]);
            }

        }
        else if (params && params.child && (<Div>params.child).element instanceof Element) this.element.appendChild((<Div>params.child).element);


        if (params && params.id) this.element.id = <string>params.id;
        if (params && params.class) this.element.className = (this.element.className + " " + <string>params.class).trim();
        if (params && params.color) this.element.style.color = params.color;
        if (params && params.top) this.element.style.top = params.top;
        if (params && params.bottom) this.element.style.bottom = params.bottom;
        if (params && params.left) this.element.style.left = params.left;
        if (params && params.right) this.element.style.right = params.right;
        if (params && params.borderRadius) this.element.style.borderRadius = params.borderRadius;
        if (params && params.fontSize) this.element.style.fontSize = params.fontSize;
        if (params && params.padding) this.element.style.padding = params.padding
        if (params && params.textAlign) this.element.style.textAlign = params.textAlign;
        if (params && params.onclick) {
            this.onclick((<OnClick>params.onclick).listener);
            this.element.style.cursor = "pointer";
        }
        if (params && params.width) {
            this.element.style.width = params.width;
            if (!params.right) this.element.style.right = "unset";
            if (!params.left) this.element.style.left = "unset";
        }
        if (params && params.height) {
            this.element.style.height = params.height;
            if (!params.top) this.element.style.top = "unset";
            if (!params.bottom) this.element.style.bottom = "unset";
        }
        if (params && params.backgroundColor) this.element.style.backgroundColor = params.backgroundColor;
        if (params && params.backgroundPosition) this.element.style.backgroundPosition = params.backgroundPosition;
        if (params && params.backgroundRepeat) this.element.style.backgroundRepeat = params.backgroundRepeat;
        if (params && params.backgroundImage) this.element.style.backgroundImage = params.backgroundImage;
        if (params && params.backgroundSize) this.element.style.backgroundSize = params.backgroundSize;



        //if (params.style) this.element.setAttribute("style",params.style);
    }

    toString(): string {
        var st: Style = this.element.style;
        var image2: string = "";
        if (st.backgroundImage) image2 = <string>st.backgroundImage;
        return '[Div{"element":"' + this.element.toString() + '","backgroundImage":"' + image2 + '"}]';
    }

    onclick(afunc: () => void): void {
        //if (afunc && {}.toString.call(afunc) === '[object Function]') {
        this.element.onclick = afunc;
        //}

    }

    htmlToElement(html: string): Element | null {
        if (!Window.window) return null;
        var template = Window.window.document.createElement('template');
        html = html.trim(); // Never return a text node of whitespace as the result
        template.innerHTML = html;
        return template.content.firstChild;
    }

    setChild(child: Div): void {
        Debug.log("setChild this = " + this.element.nodeName + " " + this.element.toString());
        Debug.log("setChild child = " + child.element.nodeName + " " + child.element.toString());
        //if (!params && !params.child) return;
        this.element.innerHTML = "";
        this.appendChild(child);
    }

    appendChild(child: Div): void {
        Debug.log("appendChild");
        this.element.appendChild(child.element);
    }

    insertBefore(n1: Div, n2: Div): void {
        this.element.insertBefore(n1.element, n2.element);
    }
    removeChild(n1: Div): void {
        this.element.removeChild(n1.element);
    }

    get firstChild(): Element | null {
        return this.element.firstChild;
    }

    get style(): Style {
        return this.element.style;
    }
}


class PageParams extends DivParams {
    navigateBackPage: Page | null
}

class Page extends Div {
    navigateBackPage: Page | null = null;
    constructor(params: PageParams) {
        super(<DivParams>params);
        this.element.className = (this.element.className + " pwapage").trim();
        if (params.navigateBackPage instanceof Page) {
            this.navigateBackPage = params.navigateBackPage;
        }
    }
}


export { PWA, PWAParams, Page, PageParams, Div, DivParams };