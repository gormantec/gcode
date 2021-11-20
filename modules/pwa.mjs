import { addFrame } from '/modules/iphoneX.mjs';

window.PWA = window.PWA || {};
window.PWA.globals = window.PWA.globals || {};

var debug = debug || { log: function (v) { /*console.log(v);*/ } };

const myglobals={PWA:null};

class PWA { 
    constructor(params) {
        console.log("new PWA");
        if (!params) params = [];
        this.pwaAuth= params.pwaAuth || "false";
        this.title = params.title || "Code";
        this.primaryColor = params.primaryColor || "#005040";
        this.headerHeight = params.headerHeight || 80;
        this.footerHeight = params.footerHeight || 40;
        this.footerPadding = params.footerPadding || (this.footerHeight - 10) / 2;
        this.headerFontSize = params.headerFontSize || 24;
        this.primaryColorText = this.getTextColor(this.primaryColor);
        this.footer = params.footer || "<a href=\"https://gcode.com.au\">gcode()</a> by gormantec";
        this.innerHTML = "";
        this.pwaRoot = new Div({ id: "pwaroot" });
        this.pwaOverlay = new Div({ id: "pwaoverlay" });
        this.setHeader();
        this.setBody();
        this.setAlert();
        this.setFooter();
        this.setFloatingActionButton();
        window.PWA.globals.pwaInstances=window.PWA.globals.pwaInstances || [];
        window.PWA.globals.pwaInstances.push(this);
        myglobals.PWA=this;
        window.document.documentElement.style.setProperty('--primaryColor', this.primaryColor);
        window.document.documentElement.style.setProperty('--primaryColorText', this.primaryColorText);
    }
    setAlert(message) {
        this.alertDialog = new Div({ id: "alertDialog",display:"none"});
        this.alertDialogBody = new Div({ id: "alertDialogBody",backgroundColor:this.primaryColorText,borderColor:this.primaryColor,borderWidth:"2px"  });
        this.alertDialogContent = new Div({ id: "alertDialogContent", innerHTML: "",backgroundColor:this.primaryColorText,color:"black" });
        this.alertDialogOK = new Div({ id: "alertDialogOK", innerHTML: "OK",right:"5px","bottom":"5px",width:"30px",height:"20px",color:this.primaryColor,backgroundColor:this.primaryColorText,fontWeight: "bold"});
        this.alertDialogBody.appendChild(this.alertDialogContent);
        this.alertDialogBody.appendChild(this.alertDialogOK);
        this.alertDialog.appendChild(this.alertDialogBody);
        this.pwaOverlay.appendChild(this.alertDialog);
        const _thisAlertDialog = this.alertDialog;

        this.alertDialogOK.onclick(function (event) {
            _thisAlertDialog.close();
        });
        this.alertDialogOK.onPointerUp(function (event) {
            _thisAlertDialog.close();
        });
    }
    alert(message) {
        console.log(message);
        this.alertDialogContent.innerHTML = "<p>" + message + "</p>";
        this.alertDialog.close();
        this.alertDialog.showModal();
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
                classNameOverride: true,
                innerText: "keyboard_arrow_left"
            })
        });
        var _this = this;

        this.navigateBackButton.onclick(function () {
            if (_this.navigateBackPage) {
                if (_this.navigateBackPage.navigateBackPage) _this.setNavigateBackPage(_this.navigateBackPage.navigateBackPage);
                else _this.hideNavigateBackButton();
                if(typeof _this.navigateBackPage=="string")
                {
                    _this.navigateBackPage=Page.getPage(_this.navigateBackPage);
                }
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
        if (this.headerHeight) this.pwaHeader.style.height = this.headerHeight;
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
        //debug.log("setpage");
        if (aPage.navigateBackPage) {
            debug.log("setNavigateBackPage:" + aPage.navigateBackPage);
            this.setNavigateBackPage(aPage.navigateBackPage);
        }
        if(aPage.hideFloatingActionButtonFlag=="true")this.hideFloatingActionButton();
        if(aPage.hideFooterFlag=="true")this.hideFooter();
        
 
        this.pwaBody.setChild({ child: aPage });
        this.alertPageChangeListener(aPage.pageId);

    }
    setCredentials(credentials){
        this.credentials=credentials;
    }
    alertPageChangeListener(pageId)
    {
        for(var listener in this.pageChangeListeners)
        {
            this.pageChangeListeners[listener](pageId);
        }
    }

    addPageChangeListener(listener)
    {
        if(typeof listener=="function")
        {
            this.pageChangeListeners=this.pageChangeListeners || [];
            this.pageChangeListeners.push(listener);
        }
    }

    setFloatingActionButton() {
        if (this.floatingActionButton) this.pwaOverlay.removeChild(this.floatingActionButton);
        this.floatingActionButton = new Div({
            class: "floatingActionButton",
            child: new Div({
                tagName: "i",
                class: "material-icons",
                classNameOverride: true,
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
        if (!targetDocument.querySelector('meta[name="' + name + '"]')) {
            var linkStyleOrScript = targetDocument.querySelector("head link");
            if (linkStyleOrScript) linkStyleOrScript = targetDocument.querySelector("head style");
            if (linkStyleOrScript) linkStyleOrScript = targetDocument.querySelector("head script");
            targetDocument.head.insertBefore(_meta, linkStyleOrScript);
        }
    }
    addLink(targetDocument, rel, href) {
        var _meta = targetDocument.createElement("link");
        _meta.setAttribute("rel", rel);
        _meta.setAttribute("href", href);
        var styleOrScript = targetDocument.querySelector("head style");
        if (styleOrScript) styleOrScript = targetDocument.querySelector("head script");
        targetDocument.head.insertBefore(_meta, styleOrScript);
    }
    addStyle(targetDocument, href, callback) {
        var _style = targetDocument.createElement("link");
        _style.setAttribute("rel", "stylesheet");
        _style.setAttribute("href", href);
        if (callback) _style.onload = function () { callback(); }
        targetDocument.head.insertBefore(_style, targetDocument.querySelector("head script"));
    }

    addModule(targetDocument, href) {
        var _script = targetDocument.createElement("script");
        _script.setAttribute("type", "module");
        _script.setAttribute("src", href);
        targetDocument.head.appendChild(_script);
    }

    fadeIn(element, duration) {
        (function increment(value = 0) {
            element.style.opacity = String(value);
            if (Number(element.style.opacity) < 1) {
                setTimeout(() => {
                    increment(value + 0.05);
                }, duration / 20);
            }
        })();
    }

    inIframe () {
        try {
            return window.self !== window.top;
        } catch (e) {
            return true;
        }
    }

    buildScreen(msec,win,rootWindow)
    {
        var _title = win.document.createElement("title");
        _title.innerText = this.title;
        win.document.head.insertBefore(_title, win.document.head.firstChild);
        if (!window.PWA.globals.splashColor) rootWindow.style.backgroundColor = this.primaryColor;
        if (!window.PWA.globals.splashColor) rootWindow.style.color = this.primaryColorText;
        if (window.PWA.globals.icon180x180 && !this.icon180x180) this.icon180x180 = window.PWA.globals.icon180x180;
        rootWindow.style.color = this.primaryColorText;
        this.addMeta(win.document, "mobile-web-app-capable", "yes");
        this.addMeta(win.document, "apple-touch-fullscreen", "yes");
        this.addMeta(win.document, "apple-mobile-web-app-title", this.title);
        this.addMeta(win.document, "apple-mobile-web-app-capable", "yes");
        this.addMeta(win.document, "apple-mobile-web-app-status-bar-style", "black-translucent");
        this.addMeta(win.document, "viewport", "viewport-fit=cover, user-scalable=no, width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0");
        this.addMeta(win.document, "msapplication-TileColor", this.primaryColor);
        this.addMeta(win.document, "theme-color", this.primaryColor);

        var _this = this;
        this.addStyle(win.document, "https://fonts.googleapis.com/icon?family=Material+Icons|Material+Icons+Outlined|Material+Icons+Two+Tone|Material+Icons+Round|Material+Icons+Sharp", function () {
            _this.addStyle(win.document, "https://gcode.com.au/css/pwa.css", function () {
                if(!_this.inIframe())
                {
                    debug.log("splashDuration:" + window.PWA.globals.splashDuration);
                    if (window.PWA.globals.splashDuration) _this.splashDuration = window.PWA.globals.splashDuration
                    else if (!_this.splashDuration) _this.splashDuration = 2000;
                    var timeoutMs = _this.splashDuration - ((new Date()).getTime() - msec);
                    debug.log("timeoutMs:" + timeoutMs);
                    if (timeoutMs < 0) timeoutMs = 10;
                    setTimeout(function () {
                        while (rootWindow.firstChild) rootWindow.removeChild(rootWindow.lastChild);
                        document.body.style.backgroundColor="rgb(33, 33, 33)";
                        rootWindow.style.backgroundColor = "black";
                        rootWindow.style.color = _this.primaryColorText;
                        _this.pwaRoot.element.style.opacity = 0.0;
                        rootWindow.appendChild(_this.pwaRoot.element);
                        rootWindow.appendChild(_this.pwaOverlay.element);
                        _this.fadeIn(_this.pwaRoot.element, 500);
                    }, timeoutMs);
                }
                else{
                    while (rootWindow.firstChild) rootWindow.removeChild(rootWindow.lastChild);
                    document.body.style.backgroundColor="rgb(33, 33, 33)";
                    rootWindow.style.backgroundColor = "black";
                    rootWindow.style.color = _this.primaryColorText;
                    rootWindow.appendChild(_this.pwaRoot.element);
                    rootWindow.appendChild(_this.pwaOverlay.element);
                }

                if(_this.pwaAuth && _this.pwaAuth.toString().toLowerCase()=="true")
                {
                    console.log("ADD PWAAUTH 2");
                    _this.addModule(win.document,"https://cdn.jsdelivr.net/npm/@pwabuilder/pwaauth@latest/dist/pwa-auth.min.js");
                }

            });
        });
    }

    show(win) {

        var msec = (new Date()).getTime();
        win = win || window;
        console.log(win.location);
        const urlParams = new URLSearchParams(win.location.search);
        var mockFrame = urlParams.get("mockFrame") || this.inIframe()?window.PWA.globals.mockFrame:null;
        var rootWindow = win.document.body;
        var aPWA = this;
        if (mockFrame && !(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))) {
            rootWindow = addFrame(win, aPWA, mockFrame);
            aPWA.buildScreen(msec,win,rootWindow);
        }
        else{
            this.buildScreen(msec,win,rootWindow);
        }
        

    }
    showFloatingActionButton() {
        this.floatingActionButton.style.display = "";
    }
    hideFloatingActionButton() {
        this.floatingActionButton.style.display = "none";
    }


    showFooter() {
        this.pwaFooter.style.display = "";
        this.pwaFooter.style.padding = this.footerPadding + "px";
        this.pwaFooter.style.footerHeight = (this.footerHeight - (2 * this.footerPadding)) + "px";
        //this.pwaBody.style.bottom = 30 + "px";
        this.pwaBody.style.bottom = (this.footerPadding * 2 + this.footerHeight) + "px"
    }

    showHeader() {
        this.pwaHeader.style.display = "";
        this.pwaBody.style.top = headerHeight + "px";
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
        if (params && !params.classNameOverride) this.element.className = "pwadiv";
        if (params instanceof Div) this.element.appendChild(params.element);
        else if (params && params.innerText) {
            debug.log("innerText:" + params.innerText);
            this.element.innerText = params.innerText;
        }
        else if (params && params.innerHTML && params.innerHTML.substring(0, 4).toLowerCase() == "url(") {
            var _uri = params.innerHTML.trim().substring(4, params.innerHTML.length - 1);
            _uri = _uri.replace(/\"/g, "");
            _uri = _uri.replace(/\'/g, "");
            debug.log(_uri);
            var _this = this;
            fetch(_uri)
                .then(
                    response => response.text()
                ).then(
                    html => _this.element.innerHTML = html
                );
        }
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
        if (params && params.class) this.element.className = (this.element.className + " " + params.class).trim();
        if (params && params.color) this.element.style.color = params.color;
        if (params && params.top) this.element.style.top = params.top;
        if (params && params.bottom) this.element.style.bottom = params.bottom;
        if (params && params.left) this.element.style.left = params.left;
        if (params && params.right) this.element.style.right = params.right;
        if (params && params.borderRadius) this.element.style.borderRadius = params.borderRadius;
        if (params && params.fontSize) this.element.style.fontSize = params.fontSize;
        if (params && params.fontStyle) this.element.style.fontStyle = params.fontStyle;
        if (params && params.fontWeight) this.element.style.fontWeight = params.fontWeight;
        if (params && params.borderWidth) this.element.style.borderWidth = params.borderWidth;
        if (params && params.padding) this.element.style.padding = params.padding;
        if (params && params.paddingTop) this.element.style.paddingTop = params.paddingTop;
        if (params && params.margin) this.element.style.margin = params.margin
        if (params && params.marginTop) this.element.style.marginTop = params.marginTop;
        if (params && params.marginBottom) this.element.style.marginBottom = params.marginBottom;
        if (params && params.marginLeft) this.element.style.marginLeft = params.marginLeft;
        if (params && params.marginRight) this.element.style.marginTop = params.marginRight;
        if (params && params.textAlign) this.element.style.textAlign = params.textAlign;
        if (params && params.lineHeight) this.element.style.lineHeight = params.lineHeight;
        if (params && params.position) this.element.style.position = params.position;
        if (params && params.display) this.element.style.display = params.display;
        if (params && params.onclick) {
            this.onclick(params.onclick);
            this.element.style.cursor = "pointer";
        }
        if (params && params.onpointerdown) {
            this.onPointerDown(params.onpointerdown);
            this.element.style.cursor = "pointer";
        }

        if (params && params.onpointerup) {
            this.onPointerUp(params.onpointerup);
            this.element.style.cursor = "pointer";
        }
        if (params && params.onpointerenter) {
            this.onPointerEnter(params.onpointerenter);
            this.element.style.cursor = "pointer";
        }
        if (params && params.onpointerleave) {
            this.onPointerLeave(params.onpointerleave);
            this.element.style.cursor = "pointer";
        }

        if (params && params.pointerout) {
            this.onPointerOut(params.pointerout);
            this.element.style.cursor = "pointer";
        }
        
        if (params && params.width) {
            this.element.style.width = params.width;
            if (!params.right) this.element.style.right="unset";
            if (!params.left) this.element.style.left="unset";
        }
        if (params && params.height) {
            this.element.style.height = params.height;
            if (!params.top) this.element.style.top="unset";
            if (!params.bottom) this.element.style.bottom="unset";
        }
        if (params && params.backgroundColor) this.element.style.backgroundColor = params.backgroundColor;
        if (params && params.backgroundPosition) this.element.style.backgroundPosition = params.backgroundPosition;
        if (params && params.backgroundRepeat) this.element.style.backgroundRepeat = params.backgroundRepeat;
        if (params && params.backgroundImage) this.element.style.backgroundImage = params.backgroundImage;
        if (params && params.backgroundSize) this.element.style.backgroundSize = params.backgroundSize;



        //if (params.style) this.element.setAttribute("style",params.style);
    }
    onclick(afunc) {
        let _this=this.element;
        if (afunc && {}.toString.call(afunc) === '[object Function]') {
            //this.element.onclick = afunc;
            
            this.element.addEventListener("click", (e)=>{e.stopImmediatePropagation();e.preventDefault();e.stopPropagation();afunc(e);});
        }

    }
    onPointerDown(handleDown){
        let _this=this.element;
        
        this.element.addEventListener("pointerdown", (e)=>{_this.isPointerDown=true;e.stopImmediatePropagation();e.preventDefault();e.stopPropagation();e._this=_this;handleDown(e);});
    }
    onPointerUp(handleUp){  
        let _this=this.element;
        this.element.addEventListener("pointerup", (e)=>{if(_this.isPointerDown==true){_this.isPointerDown=false;console.log(e);e.stopImmediatePropagation();e.preventDefault();e.stopPropagation();e._this=_this;handleUp(e);}});
    }
    onPointerEnter(handleEnter){
        let _this=this.element;
        this.element.addEventListener("pointerenter", (e)=>{if(_this.isPointerDown==true){_this.isPointerDown=false;e.stopImmediatePropagation();e.preventDefault();e.stopPropagation();e._this=_this;handleEnter(e);}});
    }
    onPointerLeave(handleLeave){
        let _this=this.element;
        this.element.addEventListener("pointerleave", (e)=>{if(_this.isPointerDown==true){_this.isPointerDown=false;e.stopImmediatePropagation();e.preventDefault();e.stopPropagation();e._this=_this;handleLeave(e);}});
    }
    onPointerOut(handleLeave){
        let _this=this.element;
        this.element.addEventListener("pointerout", (e)=>{if(_this.isPointerDown==true){_this.isPointerDown=false;e.stopImmediatePropagation();e.preventDefault();e.stopPropagation();e._this=_this;handleLeave(e);}});
    }

    addEventListener(eventName,eventHandler)
    {
        console.log("addEventListener("+eventName+")");
        return this.element.addEventListener(eventName,eventHandler);
    }
    
    showModal() {
        if (this.element.tagName.toUpperCase().trim() == "DIALOG") {
            this.element.showModal();
        }
        else{
            this.element.style.display="block";
        }
    }
    close() {
        if (this.element.tagName.toUpperCase().trim() == "DIALOG") {
            this.element.close();
        }
        else{
            this.element.style.display="none";
        }
    }

    htmlToElement(html) {
        var template = document.createElement('template');
        html = html.trim(); // Never return a text node of whitespace as the result
        template.innerHTML = html;
        return template.content.firstChild;
    }

    setChild(params) {
        debug.log("setChild");
        if (!params && !params.child) return;
        this.element.innerHTML = "";
        this.appendChild(params);
    }

    appendChild(params) {
        //debug.log("appendChild");
        if (!params) return;
        else if (params instanceof Div && params.element instanceof Node) {
            this.element.appendChild(params.element);
        }
        else if (params && params.child && params.child.element instanceof HTMLElement) {
            debug.log("appendChildDiv");
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

    get innerHTML() {
        return this.element.innerHTML;
    }

    set innerHTML(htmlString) {
        this.element.innerHTML = htmlString;
    }
}

var pages={};
class Page extends Div {
    constructor(params) {
        super(params);
        this.pages=this.pages || {};
        var id=0;
        this.pageId=this.constructor.name;
        while(pages[this.pageId]){
            id++;
            this.pageId=this.constructor.name+""+id;
        }
        pages[this.pageId]=this;
        this.element.id=this.pageId;
        this.element.className = (this.element.className + " pwapage").trim();
        if (params.navigateBackPage instanceof Page) {
            this.navigateBackPage = params.navigateBackPage;
        }
        else if (typeof params.navigateBackPage=="string" && params.navigateBackPage.trim().substring(0,5)=="page(") {
            
            this.navigateBackPage = params.navigateBackPage;
        }
        else if(!params.navigateBackPage){}
        else{
            console.log("Error:"+params.navigateBackPage);
        }
        if(params && params.hideFloatingActionButton && params.hideFloatingActionButton=="true")this.hideFloatingActionButtonFlag="true";
        if(params && params.hideFooter && params.hideFooter=="true")this.hideFooterFlag="true";
    }

    static getPage(id)
    {
        if(id.trim().substring(0,5)=="page(" && id.trim().slice(-1)==")")
        {
            id=id.trim().slice(5,-1);
        }
        console.log("getPage="+id+" "+pages[id]);
        return pages[id];
    }
    static clearPages()
    {
        pages={};
    }
}
class AuthButtons extends Div {
    /** @param {{facebookkey string, googlekey string,microsoftkey string,applekey string,appearance string,nextPage Div}} params */
    constructor(params) {
        super(params);
        var authButtons = new Div({
            marginLeft: "-100px",
            bottom: "50px",
            height: "auto",
            width: "200px",
            tagName: "pwa-auth"
        });
        if (params && params.facebookkey) authButtons.element.setAttribute("facebookkey", params.facebookkey);
        if (params && params.googlekey) authButtons.element.setAttribute("googlekey", params.googlekey);
        if (params && params.microsoftkey) authButtons.element.setAttribute("microsoftkey", params.microsoftkey);
        if (params && params.applekey) authButtons.element.setAttribute("applekey", params.applekey);
        if (params && params.appearance) authButtons.element.setAttribute("appearance", params.appearance);
        this.element.style.marginLeft = "50%";
        let _nextPage=null;
        if(params && params.nextPage) _nextPage=params.nextPage;
        authButtons.element.addEventListener("signin-completed", ev => {
            const signIn = ev.detail;
            if (signIn.error) {
                console.error("Sign in failed", signIn.error);
            } else {
                console.log("logged in");
                myglobals.PWA.setCredentials(signIn);
                if(_nextPage){
                    console.log(_nextPage);
                    myglobals.PWA.setPage(_nextPage);
                }
            }
        });
        this.appendChild(authButtons);
    }
}







export { PWA, Page, Div,AuthButtons };