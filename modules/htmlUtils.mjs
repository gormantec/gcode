
import { load, preload} from '/modules/gcodeStorage.mjs';

export function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}

 /**
  * converts an svg string to base64 png using the domUrl
  * @param {string} svgText the svgtext
  * @param {number} [margin=0] the width of the border - the image size will be height+margin by width+margin
  * @param {string} [fill] optionally backgrund canvas fill
  * @return {Promise} a promise to the bas64 png image
  */
  async function svgToPng(svgText, margin,fill) {
    // convert an svg text to png using the browser
    return new Promise(function(resolve, reject) {
      try {
        // can use the domUrl function from the browser
        var domUrl = window.URL || window.webkitURL || window;
        if (!domUrl) {
          throw new Error("(browser doesnt support this)")
        }
        
        // figure out the height and width from svg text
        var match = svgText.match(/height=\"(\d+)/m);
        var height = match && match[1] ? parseInt(match[1],10) : 200;
        var match = svgText.match(/width=\"(\d+)/m);
        var width = match && match[1] ? parseInt(match[1],10) : 200;
        margin = margin || 0;
        
        // it needs a namespace
        if (!svgText.match(/xmlns=\"/mi)){
          svgText = svgText.replace ('<svg ','<svg xmlns="http://www.w3.org/2000/svg" ') ;  
        }
        
        // create a canvas element to pass through
        var canvas = document.createElement("canvas");
        canvas.width = height+margin*2;
        canvas.height = width+margin*2;
        var ctx = canvas.getContext("2d");

        
        
        // make a blob from the svg
        var svg = new Blob([svgText], {
          type: "image/svg+xml;charset=utf-8"
        });
        
        // create a dom object for that image
        var url = domUrl.createObjectURL(svg);
        
        // create a new image to hold it the converted type
        var img = new Image;
        
        // when the image is loaded we can get it as base64 url
        img.onload = function() {
          // draw it to the canvas
          ctx.drawImage(this, margin, margin);
          
          // if it needs some styling, we need a new canvas
          if (fill) {
            var styled = document.createElement("canvas");
            styled.width = canvas.width;
            styled.height = canvas.height;
            var styledCtx = styled.getContext("2d");
            styledCtx.save();
            styledCtx.fillStyle = fill;   
            styledCtx.fillRect(0,0,canvas.width,canvas.height);
            styledCtx.strokeRect(0,0,canvas.width,canvas.height);
            styledCtx.restore();
            styledCtx.drawImage (canvas, 0,0);
            canvas = styled;
          }
          // we don't need the original any more
          domUrl.revokeObjectURL(url);
          // now we can resolve the promise, passing the base64 url
          resolve(canvas.toDataURL());
        };
        
        // load the image
        img.src = url;
        
      } catch (err) {

        reject('failed to convert svg to png ' + err);
      }
    });
  };

export function addSubImportLibFile(importFiles) {
  
    let newimportFiles = [];
    preload(newimportFiles);
    for(let j=0;j<importFiles.length;j++)
    {
        let code=load(importsList[j]);
        let importsList = code.match(/import.*?\sfrom\s['"]\.\/[a-zA-Z0-9_-]*\.lib\.mjs['"]/g);
        if (importsList && importsList.length > 0) {
            for (var i = 0; i < importsList.length; i++) {
                var fileNameLib = importsList[i].replace(/(import.*?\sfrom\s['"]\.\/)([a-zA-Z0-9_-]*\.lib\.mjs)(['"])/g, "$2");
                let dir = "";
                if (importsList[j].lastIndexOf("/") > 0) dir = importsList[j].substring(0, importsList[j].lastIndexOf("/") + 1);
                newimportFiles.push({ name: fileNameLib, dir: dir });
            }
        }
    }
    return newimportFiles;
}

export function getImportLibFileList(code,isInLibdir) {
    var filename = document.getElementById("filename").innerText;
    var importFiles = [];
    if(isInLibdir==true)
    {
        var importsList = code.match(/import.*?\sfrom\s['"]\.\/[a-zA-Z0-9_-]*\.lib\.mjs['"]/g);
        if (importsList && importsList.length > 0) {
            for (var i = 0; i < importsList.length; i++) {
                var fileNameLib = importsList[i].replace(/(import.*?\sfrom\s['"]\.\/)([a-zA-Z0-9_-]*\.lib\.mjs)(['"])/g, "$2");
                let dir = "";
                if (filename.lastIndexOf("/") > 0) dir = filename.substring(0, filename.lastIndexOf("/") + 1);
                importFiles.push({ name: fileNameLib, dir: dir });
            }
        }
    }
    else{
        var importsList = code.match(/import.*?\sfrom\s['"]\.\/lib\/[a-zA-Z0-9_-]*\.lib\.mjs['"]/g);
        if (importsList && importsList.length > 0) {
            for (var i = 0; i < importsList.length; i++) {
                var fileNameLib = importsList[i].replace(/(import.*?\sfrom\s['"]\.\/lib\/)([a-zA-Z0-9_-]*\.lib\.mjs)(['"])/g, "$2");
                let dir = "";
                if (filename.lastIndexOf("/") > 0) dir = filename.substring(0, filename.lastIndexOf("/") + 1);
                importFiles.push({ name: fileNameLib, dir: dir });
            }
        }
    }
    

    return importFiles;
}


export function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export function getTextColor(backColor) {

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

export function getImage(url, callback) {
    if (!url || url.substring(url.length - 4) != ".png") {
        callback({ error: "not a png file" });
    }
    else {
        var arrayBufferToBase64 = function (buffer) {
            var binary = '';
            var bytes = [].slice.call(new Uint8Array(buffer));
            bytes.forEach((b) => binary += String.fromCharCode(b));
            return window.btoa(binary);
        };
        fetch(url, { mode: 'cors' }).then((response) => {
            response.arrayBuffer().then((buffer) => {
                var imageStr = arrayBufferToBase64(buffer);
                callback(null, imageStr);
            });
        });
    }

}
export async function getImageAsync(url,x,y) {


    if (!url || (url.substring(url.length - 4) != ".png" && url.substring(url.length - 4) != ".svg")) {
        console.log("error");
        return null;
    }
    else if (url.substring(url.length - 4) == ".svg") {
        
        var arrayBufferToBase64 = function (buffer) {
            var binary = '';
            var bytes = [].slice.call(new Uint8Array(buffer));
            bytes.forEach((b) => binary += String.fromCharCode(b));
            return window.btoa(binary);
        };
        var rText=null;
        if(url.startsWith("git")){
            await preload([url]);
            rText=load(url);
        }
        else if(url.startsWith("http")){
            var response = await fetch(url, { mode: 'cors' });
            rText = await response.text();
        }
        else{
            console.log("CASHE IMAGE");
            rText=load(url);
        }

        if(x!=null && y!=null)
        {
            rText=rText.replace(/(<svg.*?"*?width"*? *?=)(.*?)([ >])/g,"$1\""+x+"\"$3");
            rText=rText.replace(/(<svg.*?"*?height"*? *?=)(.*?)([ >])/g,"$1\""+y+"\"$3");
        }
        var dataUrl=await svgToPng(rText,0);
        return dataUrl.replace(/^.*?;base64,/, "");
    }
    else {
        var arrayBufferToBase64 = function (buffer) {
            var binary = '';
            var bytes = [].slice.call(new Uint8Array(buffer));
            bytes.forEach((b) => binary += String.fromCharCode(b));
            return window.btoa(binary);
        };
        var response = await fetch(url, { mode: 'cors' });
        var buffer = await response.arrayBuffer();
        var imageStr = arrayBufferToBase64(buffer);
        return imageStr;
    }

}

function getHeaderValue(code,header,defaultValue)
{
    var permittedUrls = defaultValue;
    var findStart=code.indexOf("/*");
    var findEnd=code.indexOf("*/");
    if(findStart>=0 && findEnd>=0 && code.substring(findStart,findEnd).toLowerCase().indexOf(header.toLowerCase())>=0)
    {
        var regexPURLS=new RegExp(".*?\\/\\*(\\n|\\r|.)*?"+header+"\\s*:\\s*(?<permittedUrls>(\\n|\\r|.)*?)\\s*?([a-zA-Z0-9]*?\\s*:|\\*\\/)","i");
        console.log(regexPURLS);
        var foundPURLS=code.substring(findStart,findEnd).match(regexPURLS);
        if(foundPURLS && foundPURLS.groups && foundPURLS.groups.permittedUrls) permittedUrls=foundPURLS.groups.permittedUrls;
        permittedUrls=permittedUrls.trim();
        permittedUrls=permittedUrls.replaceAll("\n"," ").replaceAll("\t"," ").replace(/\t/g," ").replaceAll("  "," ").replaceAll("  "," ").replaceAll("  "," ");    
        
    }
    return permittedUrls;
}


export function createHtml(code, options) {

    console.log("HtmlUtils::createHtml:START");

    if (!options) options = {};
    var splashBackgroundColor = null;
    var splash = null;
    var mockFrame = null;
    var splashSize = null;
    var rootHTML = window.document.createElement("html");
    var rootHead = window.document.createElement("head");
    var rootBody = window.document.createElement("body");
    rootHTML.appendChild(rootHead);
    rootHTML.appendChild(rootBody);





    splash = code.replace(/\/\*.*?splash:((?!\n).)*?(((http)|(git)|(\.\/))((?!\n).)*?((png)|(gif)|(svg)))[\n].*?\*\/.*/s, '$2');
    if (splash == code || !(splash.startsWith("http") || splash.startsWith("git") || splash.startsWith("./"))) splash = null;
    splashSize = code.replace(/\/\*.*?splashSize:.*?([A-Za-z0-9#]*)[\n].*?\*\/.*/s, '$1');

    if (splashSize == code) splashSize = "contain";
    var icon = code.replace(/\/\*.*?icon:.*?(((http)|(git)).*?((png)|(gif)|(svg)))[\n].*?\*\/.*/s, '$1');
    if (!icon || icon == code || !(icon.startsWith("http") || icon.startsWith("git"))) icon = splash;
    var icon180x180 = code.replace(/\/\*.*?icon180x180:.*?(((http)|(git)).*?((png)|(gif)|(svg)))[\n].*?\*\/.*/s, '$1');
    if (!icon180x180 || icon180x180 == code || !(icon180x180.startsWith("http") || icon180x180.startsWith("git")))  icon180x180 = icon;
    var icon192x192 = code.replace(/\/\*.*?icon192x192:.*?(((http)|(git)).*?((png)|(gif)|(svg)))[\n].*?\*\/.*/s, '$1');
    if (!icon192x192 || icon192x192 == code || !(icon192x192.startsWith("http") || icon192x192.startsWith("git")))  icon192x192 = icon;
    var icon512x512 = code.replace(/\/\*.*?icon512x512:.*?(((http)|(git)).*?((png)|(gif)|(svg)))[\n].*?\*\/.*/s, '$1');
    if (!icon512x512 || icon512x512 == code || !(icon512x512.startsWith("http") || icon512x512.startsWith("git")))  icon512x512 = icon;
    var splashColor = code.replace(/\/\*.*?splashColor:.*?([A-Za-z0-9#]*)[\n].*?\*\/.*/s, '$1');
    if (splashColor == code) splashColor = null;
    mockFrame = code.replace(/\/\*.*?mockFrame:.*?([A-Za-z0-9#]*)[\n].*?\*\/.*/s, '$1');
    if (mockFrame == code) mockFrame = null;
    splashBackgroundColor = code.replace(/\/\*.*?splashBackgroundColor:.*?([A-Za-z0-9#]*)[\n].*?\*\/.*/s, '$1');
    if (splashBackgroundColor == code) splashBackgroundColor = "black";
    if (!splashColor && splashBackgroundColor) splashColor = getTextColor(splashBackgroundColor);
    var splashDuration = code.replace(/\/\*.*?splashDuration:.*?([0-9]*)[\n].*?\*\/.*/s, '$1');
    if (splashDuration == code) splashDuration = null;
    var spinnerSize = code.replace(/\/\*.*?spinnerSize:.*?([A-Za-z0-9]*?).*?[\n].*?\*\/.*/s, '$1');
    if (spinnerSize == code) spinnerSize = "50px";
    var orientation = code.replace(/\/\*.*?orientation:.*?([A-Za-z0-9]*?).*?[\n].*?\*\/.*/s, '$1');
    if (!orientation || orientation == code) orientation = "any";
    console.log("HtmlUtils::appName::START");
    var appName = code.replace(/\/\*.*?appName:.*?([A-Za-z0-9 ]*)[\n].*?\*\/.*/s, '$1');
    if (!appName || appName == code) appName = "gcode App";
    appName = appName.trim();
    console.log("HtmlUtils::appName="+appName);
    console.log("HtmlUtils::permittedUrls::START");
    //var permittedUrls = code.replace(/[\s\S]*?permittedUrls:([\s\S]*?)((\n.*?[a-zA-Z0-9\[\]\:\/\"\.\-,_]*?\s*?:)|(\*\/))[\s\S]*/gm, '$1');
    var permittedUrls = "[]";
    var permittedUrls=getHeaderValue(code,"permittedUrls","[]");
    console.log("HtmlUtils::permittedUrls="+permittedUrls);
    console.log("HtmlUtils::description::START");
    var description=getHeaderValue(code,"description","A gcode developed PWA app");  
    console.log("HtmlUtils::description="+description);
    console.log("HtmlUtils::manifest::START");
    var manifest = code.replace(/\/\*.*?manifest:.*?(.*\.json)[\n].*?\*\/.*/s, '$1');
    if (!manifest || manifest == "" || manifest == code) manifest = "xxxxx_manifest.json";
    console.log("HtmlUtils::manifest="+manifest);
    var longName = appName;
    var shortName = appName;
    var display = "standalone";
    var _link = window.document.createElement("link");
    _link.setAttribute("rel", "manifest");
    _link.setAttribute("href", manifest);
    rootHead.appendChild(_link);
    _link = window.document.createElement("meta");
    _link.setAttribute("name", "mobile-web-app-capable");
    _link.setAttribute("content", "yes");
    rootHead.appendChild(_link);
    _link = window.document.createElement("meta");
    _link.setAttribute("name", "description");
    _link.setAttribute("content", description);
    rootHead.appendChild(_link);
    _link = window.document.createElement("meta");
    _link.setAttribute("name", "apple-touch-fullscreen");
    _link.setAttribute("content", "yes");
    rootHead.appendChild(_link);
    _link = window.document.createElement("meta");
    _link.setAttribute("name", "apple-mobile-web-app-capable");
    _link.setAttribute("content", "yes");
    rootHead.appendChild(_link);
    _link = window.document.createElement("meta");
    _link.setAttribute("name", "apple-mobile-web-app-status-bar-style");
    _link.setAttribute("content", "black-translucent");
    rootHead.appendChild(_link);
    _link = window.document.createElement("meta");
    _link.setAttribute("property", "fpwa:template");
    _link.setAttribute("content", "pwa=true,name=" + longName + ",short_name=" + shortName + ",theme_color=" + splashBackgroundColor + ",background_color=" + splashBackgroundColor + ",display=" + display + ",orientation=" + orientation);
    rootHead.appendChild(_link);

    _link = window.document.createElement("link");
    _link.setAttribute("rel", "apple-touch-icon");
    _link.setAttribute("href", "###ICONURI###");
    rootHead.appendChild(_link);
    _link = window.document.createElement("link");
    _link.setAttribute("rel", "apple-touch-icon-precomposed");
    _link.setAttribute("href", "###ICONURI###");
    rootHead.appendChild(_link);
    _link = window.document.createElement("link");
    _link.setAttribute("rel", "icon");
    _link.setAttribute("href", "###ICONURI###");
    rootHead.appendChild(_link);
    if (splash  && (splash.substring(splash.length - 3) == "png" || splash.substring(splash.length - 3) == "svg")) {
        var _style = window.document.createElement("style");
        var spinnerCss = ".loader{font-size:" + spinnerSize + ";text-indent:-9999em;overflow:hidden;width:1em;height:1em;border-radius:50%;margin:72px auto;position:absolute;bottom:20px;left:20px;right:20px;bottom:0;-webkit-transform:translateZ(0);-ms-transform:translateZ(0);transform:translateZ(0);-webkit-animation:load6 1.7s infinite ease,round 1.7s infinite ease;animation:load6 1.7s infinite ease,round 1.7s infinite ease}@-webkit-keyframes load6{0%{box-shadow:0 -.83em 0 -.4em,0 -.83em 0 -.42em,0 -.83em 0 -.44em,0 -.83em 0 -.46em,0 -.83em 0 -.477em}5%,95%{box-shadow:0 -.83em 0 -.4em,0 -.83em 0 -.42em,0 -.83em 0 -.44em,0 -.83em 0 -.46em,0 -.83em 0 -.477em}10%,59%{box-shadow:0 -.83em 0 -.4em,-.087em -.825em 0 -.42em,-.173em -.812em 0 -.44em,-.256em -.789em 0 -.46em,-.297em -.775em 0 -.477em}20%{box-shadow:0 -.83em 0 -.4em,-.338em -.758em 0 -.42em,-.555em -.617em 0 -.44em,-.671em -.488em 0 -.46em,-.749em -.34em 0 -.477em}38%{box-shadow:0 -.83em 0 -.4em,-.377em -.74em 0 -.42em,-.645em -.522em 0 -.44em,-.775em -.297em 0 -.46em,-.82em -.09em 0 -.477em}100%{box-shadow:0 -.83em 0 -.4em,0 -.83em 0 -.42em,0 -.83em 0 -.44em,0 -.83em 0 -.46em,0 -.83em 0 -.477em}}@keyframes load6{0%{box-shadow:0 -.83em 0 -.4em,0 -.83em 0 -.42em,0 -.83em 0 -.44em,0 -.83em 0 -.46em,0 -.83em 0 -.477em}5%,95%{box-shadow:0 -.83em 0 -.4em,0 -.83em 0 -.42em,0 -.83em 0 -.44em,0 -.83em 0 -.46em,0 -.83em 0 -.477em}10%,59%{box-shadow:0 -.83em 0 -.4em,-.087em -.825em 0 -.42em,-.173em -.812em 0 -.44em,-.256em -.789em 0 -.46em,-.297em -.775em 0 -.477em}20%{box-shadow:0 -.83em 0 -.4em,-.338em -.758em 0 -.42em,-.555em -.617em 0 -.44em,-.671em -.488em 0 -.46em,-.749em -.34em 0 -.477em}38%{box-shadow:0 -.83em 0 -.4em,-.377em -.74em 0 -.42em,-.645em -.522em 0 -.44em,-.775em -.297em 0 -.46em,-.82em -.09em 0 -.477em}100%{box-shadow:0 -.83em 0 -.4em,0 -.83em 0 -.42em,0 -.83em 0 -.44em,0 -.83em 0 -.46em,0 -.83em 0 -.477em}}@-webkit-keyframes round{0%{-webkit-transform:rotate(0);transform:rotate(0)}100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}@keyframes round{0%{-webkit-transform:rotate(0);transform:rotate(0)}100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}";
        _style.textContent = "\n.splash{position:absolute;background-size:" + splashSize.trim() + ";background-image:url('splash.icon.png');background-position:center;background-repeat:no-repeat;top:0px;bottom:0px;left:0px;right:0px;" + (splashColor ? "color:" + splashColor : "") + ";" + (splashBackgroundColor ? "background-color:" + splashBackgroundColor : "") + ";}\n" + spinnerCss + "\n";
        rootHead.appendChild(_style);
    }
    else{

        console.log("********************************* NO? "+splash);
    }

    var _splash = window.document.createElement("div");
    _splash.className = "splash";
    rootBody.appendChild(_splash);
    var _loader = window.document.createElement("div");
    _loader.className = "loader";
    _loader.innerText = "Loading...";
    rootBody.appendChild(_loader);




    var _script = window.document.createElement("script");
    _script.text = "\n  window.PWA={globals:{}};\n";
    if (appName) _script.text += "  window.PWA.globals.appName=\"" + appName + "\";\n";
    if (orientation) _script.text += "  window.PWA.globals.orientation=\"" + orientation + "\";\n";
    if (icon) _script.text += "  window.PWA.globals.icon=\"icon.png\";\n";
    if (icon180x180) _script.text += "  window.PWA.globals.icon180x180=\"180x180.icon.png\";\n";
    if (icon192x192) _script.text += "  window.PWA.globals.icon192x192=\"192x192.icon.png\";\n";
    if (icon512x512) _script.text += "  window.PWA.globals.icon512x512=\"512x512.icon.png\";\n";
    if (splash) _script.text += "  window.PWA.globals.splash=\"splash.png\";\n";
    if (splashColor) _script.text += "  window.PWA.globals.splashColor=\"" + splashColor + "\";\n";
    if (mockFrame) _script.text += "  window.PWA.globals.mockFrame=\"" + mockFrame + "\";\n";
    if (splashBackgroundColor) _script.text += "  window.PWA.globals.splashBackgroundColor=\"" + splashBackgroundColor + "\";\n";
    if (splashDuration) _script.text += "  window.PWA.globals.splashDuration=" + parseInt(splashDuration) + ";\n";

    if (!options.noServiceWorker) {
        _script.text += "\nlet deferredPrompt;\n" +
            "if('serviceWorker' in navigator) {\n" +
            "    navigator.serviceWorker.register('sw.js');\n" +
            "};\n\n";
    }
    if (!options.noInstallCode) {
        _script.text += "function addToHomeScreen() {\n" +
            "   let a2hsBtn = document.querySelector(\".ad2hs-prompt\");\n" +
            "   a2hsBtn.style.display = 'none'; \n" +
            "   deferredPrompt.prompt();\n" +
            "   deferredPrompt.userChoice.then(function(choiceResult){\n" +
            "   if (choiceResult.outcome === 'accepted') console.log('User accepted the A2HS prompt');\n" +
            "   else console.log('User dismissed the A2HS prompt');\n" +
            "   deferredPrompt = null;\n" +
            " });}\n" +
            "function showAddToHomeScreen() {\n" +
            "   let a2hsBtn = document.querySelector(\".ad2hs-prompt\");\n" +
            "   a2hsBtn.style.display =\"block\";\n" +
            "   a2hsBtn.addEventListener(\"click\", addToHomeScreen);\n" +
            " }\n" +
            " window.addEventListener('beforeinstallprompt', function (e) {\n" +
            "   e.preventDefault();\n" +
            "   deferredPrompt = e;\n" +
            "   showAddToHomeScreen();\n" +
            "   setTimeout(()=>{document.querySelector(\".ad2hs-prompt\").style.display =\"none\";},10000);\n" +
            " });\n" +
            "function showIosInstall() {\n" +
            "  let iosPrompt = document.querySelector(\".ios-prompt\");\n" +
            "  if(iosPrompt)iosPrompt.style.display = \"block\";\n" +
            "  if(iosPrompt)iosPrompt.addEventListener(\"click\", () => {\n" +
            "  if(iosPrompt)iosPrompt.style.display = \"none\";\n" +
            "  });\n" +
            "}\n\n" +
            "const isIos = () => {\n" +
            "  const userAgent = window.navigator.userAgent.toLowerCase();\n" +
            "  return /iphone|ipad|ipod/.test( userAgent );\n" +
            "}\n" +
            "const isInStandaloneMode = () => ('standalone' in window.navigator) && (window.navigator.standalone);\n" +
            "document.addEventListener(\"DOMContentLoaded\", ()=>{\n" +
            "   console.log(\"DOMContentLoaded\");\n" +
            "   if (isIos() && !isInStandaloneMode()) {\n" +
            "  showIosInstall();\n" +
            "   console.log(\"showIosInstall\");\n" +
            "  }\n" +
            "});\n\n";
    }

    rootHead.appendChild(_script);
    if (!options.noWindowMessages) {
        var jApp = 'import { addkey } from "https://gcode.com.au/modules/near/index.mjs";\n\n' +
            'if (window.opener && window.opener !== window) {\n' +
            '    window.addEventListener("message",function(e){if(e.origin=="https://gcode.com.au")addkey(e.data);},false);\n' +
            '    window.addEventListener("load", (event) => {window.opener.postMessage("loaded","https://gcode.com.au");});\n' +
            '}\n';
        var _module = window.document.createElement("script");
        _module.setAttribute("type", "module");
        _module.text = "\n" + jApp + "\n";
        rootHead.appendChild(_module);
    }
    console.log("HtmlUtils::createHtml:START");
    return { "rootHTML": rootHTML, "splashBackgroundColor": splashBackgroundColor, "splash": splash, "mockFrame": mockFrame, description:description,permittedUrls:permittedUrls,icon180x180: icon180x180, icon192x192: icon192x192, icon512x512: icon512x512 };

}

export function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}

export function uint8ArrayToHex(aUint8Array) {
    return aUint8Array.map(b => b.toString(16).padStart(2, "0")).join("");
}

export function hexToUint8Array(hex) {
    var intArray = [];
    for (var i = 0; i < hex.length; i = i + 2)intArray.push(parseInt(hex.substr(i, 2), 16));
    return Uint8Array.from(intArray);
}

export function sms(params, callback) {

    var html = params.html;
    var icon = params.icon;

    var xxx = localStorage.getItem("phonenumber");
    if (xxx == null) xxx = "+61440000XXX";
    var phonenumber = prompt("Please enter your number", xxx);
    while (phonenumber != null && (!phonenumber.startsWith("+") || !$.isNumeric(phonenumber.substring(1)))) {
        phonenumber = prompt("Please use format +61440000000", xxx);
    }
    if (phonenumber != null) {

        localStorage.setItem("phonenumber", phonenumber);

        getImage(icon, function (e, iconBase64) {

            var body = { encodedhtml: btoa(html) };
            if (iconBase64) body.encodedicon = iconBase64;

            fetch('https://8mzu0pqfyf.execute-api.ap-southeast-2.amazonaws.com/fpwaupload', {
                method: 'post',
                mode: "cors",
                credentials: 'omit',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body),
            }).then(response => response.json()).then(data => {
                callback(null, "https://s3-ap-southeast-2.amazonaws.com/fpwa.web.gormantec.com/" + data.uri);
            }).catch((error) => {
                callback(error);
            });
        });
    }
    else {
        alert("no sms sent");
    }
}


function md5cycle(x, k) {
    var a = x[0], b = x[1], c = x[2], d = x[3];

    a = ff(a, b, c, d, k[0], 7, -680876936);
    d = ff(d, a, b, c, k[1], 12, -389564586);
    c = ff(c, d, a, b, k[2], 17, 606105819);
    b = ff(b, c, d, a, k[3], 22, -1044525330);
    a = ff(a, b, c, d, k[4], 7, -176418897);
    d = ff(d, a, b, c, k[5], 12, 1200080426);
    c = ff(c, d, a, b, k[6], 17, -1473231341);
    b = ff(b, c, d, a, k[7], 22, -45705983);
    a = ff(a, b, c, d, k[8], 7, 1770035416);
    d = ff(d, a, b, c, k[9], 12, -1958414417);
    c = ff(c, d, a, b, k[10], 17, -42063);
    b = ff(b, c, d, a, k[11], 22, -1990404162);
    a = ff(a, b, c, d, k[12], 7, 1804603682);
    d = ff(d, a, b, c, k[13], 12, -40341101);
    c = ff(c, d, a, b, k[14], 17, -1502002290);
    b = ff(b, c, d, a, k[15], 22, 1236535329);

    a = gg(a, b, c, d, k[1], 5, -165796510);
    d = gg(d, a, b, c, k[6], 9, -1069501632);
    c = gg(c, d, a, b, k[11], 14, 643717713);
    b = gg(b, c, d, a, k[0], 20, -373897302);
    a = gg(a, b, c, d, k[5], 5, -701558691);
    d = gg(d, a, b, c, k[10], 9, 38016083);
    c = gg(c, d, a, b, k[15], 14, -660478335);
    b = gg(b, c, d, a, k[4], 20, -405537848);
    a = gg(a, b, c, d, k[9], 5, 568446438);
    d = gg(d, a, b, c, k[14], 9, -1019803690);
    c = gg(c, d, a, b, k[3], 14, -187363961);
    b = gg(b, c, d, a, k[8], 20, 1163531501);
    a = gg(a, b, c, d, k[13], 5, -1444681467);
    d = gg(d, a, b, c, k[2], 9, -51403784);
    c = gg(c, d, a, b, k[7], 14, 1735328473);
    b = gg(b, c, d, a, k[12], 20, -1926607734);

    a = hh(a, b, c, d, k[5], 4, -378558);
    d = hh(d, a, b, c, k[8], 11, -2022574463);
    c = hh(c, d, a, b, k[11], 16, 1839030562);
    b = hh(b, c, d, a, k[14], 23, -35309556);
    a = hh(a, b, c, d, k[1], 4, -1530992060);
    d = hh(d, a, b, c, k[4], 11, 1272893353);
    c = hh(c, d, a, b, k[7], 16, -155497632);
    b = hh(b, c, d, a, k[10], 23, -1094730640);
    a = hh(a, b, c, d, k[13], 4, 681279174);
    d = hh(d, a, b, c, k[0], 11, -358537222);
    c = hh(c, d, a, b, k[3], 16, -722521979);
    b = hh(b, c, d, a, k[6], 23, 76029189);
    a = hh(a, b, c, d, k[9], 4, -640364487);
    d = hh(d, a, b, c, k[12], 11, -421815835);
    c = hh(c, d, a, b, k[15], 16, 530742520);
    b = hh(b, c, d, a, k[2], 23, -995338651);

    a = ii(a, b, c, d, k[0], 6, -198630844);
    d = ii(d, a, b, c, k[7], 10, 1126891415);
    c = ii(c, d, a, b, k[14], 15, -1416354905);
    b = ii(b, c, d, a, k[5], 21, -57434055);
    a = ii(a, b, c, d, k[12], 6, 1700485571);
    d = ii(d, a, b, c, k[3], 10, -1894986606);
    c = ii(c, d, a, b, k[10], 15, -1051523);
    b = ii(b, c, d, a, k[1], 21, -2054922799);
    a = ii(a, b, c, d, k[8], 6, 1873313359);
    d = ii(d, a, b, c, k[15], 10, -30611744);
    c = ii(c, d, a, b, k[6], 15, -1560198380);
    b = ii(b, c, d, a, k[13], 21, 1309151649);
    a = ii(a, b, c, d, k[4], 6, -145523070);
    d = ii(d, a, b, c, k[11], 10, -1120210379);
    c = ii(c, d, a, b, k[2], 15, 718787259);
    b = ii(b, c, d, a, k[9], 21, -343485551);

    x[0] = add32(a, x[0]);
    x[1] = add32(b, x[1]);
    x[2] = add32(c, x[2]);
    x[3] = add32(d, x[3]);

}

function cmn(q, a, b, x, s, t) {
    a = add32(add32(a, q), add32(x, t));
    return add32((a << s) | (a >>> (32 - s)), b);
}

function ff(a, b, c, d, x, s, t) {
    return cmn((b & c) | ((~b) & d), a, b, x, s, t);
}

function gg(a, b, c, d, x, s, t) {
    return cmn((b & d) | (c & (~d)), a, b, x, s, t);
}

function hh(a, b, c, d, x, s, t) {
    return cmn(b ^ c ^ d, a, b, x, s, t);
}

function ii(a, b, c, d, x, s, t) {
    return cmn(c ^ (b | (~d)), a, b, x, s, t);
}

function md51(s) {
    var txt = '';
    var n = s.length,
        state = [1732584193, -271733879, -1732584194, 271733878], i;
    for (i = 64; i <= s.length; i += 64) {
        md5cycle(state, md5blk(s.substring(i - 64, i)));
    }
    s = s.substring(i - 64);
    var tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (i = 0; i < s.length; i++)
        tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
    tail[i >> 2] |= 0x80 << ((i % 4) << 3);
    if (i > 55) {
        md5cycle(state, tail);
        for (i = 0; i < 16; i++) tail[i] = 0;
    }
    tail[14] = n * 8;
    md5cycle(state, tail);
    return state;
}

/* there needs to be support for Unicode here,
 * unless we pretend that we can redefine the MD-5
 * algorithm for multi-byte characters (perhaps
 * by adding every four 16-bit characters and
 * shortening the sum to 32 bits). Otherwise
 * I suggest performing MD-5 as if every character
 * was two bytes--e.g., 0040 0025 = @%--but then
 * how will an ordinary MD-5 sum be matched?
 * There is no way to standardize text to something
 * like UTF-8 before transformation; speed cost is
 * utterly prohibitive. The JavaScript standard
 * itself needs to look at this: it should start
 * providing access to strings as preformed UTF-8
 * 8-bit unsigned value arrays.
 */
function md5blk(s) { /* I figured global was faster.   */
    var md5blks = [], i; /* Andy King said do it this way. */
    for (i = 0; i < 64; i += 4) {
        md5blks[i >> 2] = s.charCodeAt(i)
            + (s.charCodeAt(i + 1) << 8)
            + (s.charCodeAt(i + 2) << 16)
            + (s.charCodeAt(i + 3) << 24);
    }
    return md5blks;
}

var hex_chr = '0123456789abcdef'.split('');

function rhex(n) {
    var s = '', j = 0;
    for (; j < 4; j++)
        s += hex_chr[(n >> (j * 8 + 4)) & 0x0F]
            + hex_chr[(n >> (j * 8)) & 0x0F];
    return s;
}

function hex(x) {
    for (var i = 0; i < x.length; i++)
        x[i] = rhex(x[i]);
    return x.join('');
}

export function md5(s) {
    return hex(md51(s));
}

/* this function is much faster,
so if possible we use it. Some IEs
are the only ones I know of that
need the idiotic second function,
generated by an if clause.  */

function add32(a, b) {
    return (a + b) & 0xFFFFFFFF;
}

if (md5('hello') != '5d41402abc4b2a76b9719d911017c592') {
    function add32(x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF),
            msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    }
}