
import * as githubtree from '/modules/githubtree.mjs';

import { getImage, createHtml,getImageAsync } from '/modules/htmlUtils.mjs';


import { load, preload} from '/modules/gcodeStorage.mjs';

var win;

export const menuMetadata = { "id": "publishPWA", "class": "pageLeftToolbarButton", "materialIcon": "publish" };

export const runButtonFileSufix=".mjs";

export function runButtonAction(e)
{
    let token=githubtree.getToken();
    if (token) {
        githubtree.waitForOctokit(() => {
            githubtree.getAuthenticated().then((resp) => {
                window.myLogin = resp.data.login;
                publishToGit(window.editor.getValue(),resp.data.id,token);
            });
        });
    }
    else{
        publishToGit(window.editor.getValue());
    }
}


export function menuAction() {

    document.getElementById("publishPwaDialog").showModal();
}


export const dialogMetadata = [
    {
        "id": "publishPwaDialog",
        "content": [
            {
                "id": "publishPwaDialogSelect", "type": "select", "label": "Action:", "options": [
                    { "value": "publish", "text": "Publish to GIT", "selected": true },
                    { "value": "sms", "text": "Send via SMS", "selected": false }
                ]
            },
        ],
        "ok": { "value": "publish" }//default value
    },
    {
        "id": "publishPwaDialogTimer",
        "type": "timer"
    }
];

export function dialogAction(event) {

    if (event.type == "dialog" && event.id == "publishPwaDialog") {
        console.log("publishPwaDialog");
        if (event.value == "publish") {
            let token=githubtree.getToken();
            if (token) {
                githubtree.waitForOctokit(() => {
                    githubtree.getAuthenticated().then((resp) => {
                        window.myLogin = resp.data.login;
                        publishToGit(window.editor.getValue(),resp.data.id,token);
                    });
                });
            }
            else{
                confirm("Please login to GIT");
            }
        }
        else 
        if (event.value == "sms") {

        }
    }
    else if (event.type == "select" && event.id == "publishPwaDialogSelect") {
        event.setInputValue("confirmButton", event.value);
    }
}

export function afterLoad() {



}

function publishToGit(code, user,token)
{
    console.log(user);
    var filename = document.getElementById("filename").innerText;
    var appName = code.replace(/\/\*.*?appName:.*?([A-Za-z0-9 ]*)[\n].*?\*\/.*/s, '$1');
    if (!appName || appName == code) appName = "gcode App";
    appName = appName.trim();


    if (filename.endsWith(".mjs") && !filename.endsWith(".lib.mjs")) {
        window.debug.log(window.myLogin + "$ launch webApp " + filename + "\n");
        var errorline=0;
        try {
            var code = window.editor.getValue(); errorline=328;


            var importsList=code.match(/import.*?\sfrom\s['"]\.\/lib\/[a-zA-Z0-9_-]*\.lib\.mjs['"]/g);
  
            var importFiles=[];
            if(importsList && importsList.length>0)
            {
                for(var i=0;i<importsList.length;i++)
                {
                    var fileNameLib=importsList[i].replace(/(import.*?\sfrom\s['"]\.\/lib\/)([a-zA-Z0-9_-]*\.lib\.mjs)(['"])/g,"$2");
                    let dir="";
                    if(filename.lastIndexOf("/")>0)dir=filename.substring(0,filename.lastIndexOf("/")+1);
                    importFiles.push({name:fileNameLib,dir:dir});
                }
            }
            preload(importFiles).then(()=>{
                var filesArray=[];
                for(var i=0;i<importFiles.length;i++)
                {
                    let slib=load(importFiles[i].dir+importFiles[i].name);
                    if(slib && typeof slib=="string" && slib.length>0)
                    {
                        filesArray.push({ name: "/lib/"+importFiles[i].name, data: window.btoa(slib), type: "base64" });
                        console.log("/lib/"+importFiles[i].name);
                    }       
                }
                var result = createHtml(code);
                var splashBackgroundColor = result.splashBackgroundColor;
                var splash = result.splash;
                var mockFrame = result.mockFrame;
                var rootHTML = result.rootHTML; errorline=333;
    
                var _module = window.document.createElement("script");
                _module.setAttribute("type", "module");
                _module.text = "\n" + window.editor.getValue() + "\n";
                rootHTML.querySelector("head").appendChild(_module);
                var wpos = "top=50,left=50";errorline=339;
                var w = 375;
                var h = 896 * 375 / 414; //iphoneX=896/414
                var mockPadding = 40;
                if (screen.height <= 768) {
                    w = Math.floor(w * 0.75);
                    h = Math.floor(h * 0.75);
                    mockPadding = Math.floor(mockPadding * 0.75);
                    wpos = "top=0,left=0";
                }
                var wh = "width=" + parseInt(w) + ",height=" + parseInt(h); errorline=349;
                var frame = "";
                if (mockFrame) {
                    wh = "width=" + (w + mockPadding) + ",height=" + (h + mockPadding);
                    frame = "?mockFrame=" + mockFrame;errorline=353;
                }
                if (!win || win.closed) {
                    win = window.open("", "_blank", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no," + wh + "," + wpos);
                    if (splashBackgroundColor) win.document.body.style.backgroundColor = splashBackgroundColor;
                    else win.document.body.style.backgroundColor = "black";errorline=358;
                }
                var uploadConfig={ html: "<!DOCTYPE html>\n" + rootHTML.outerHTML, icon: splash  };
                if(user && token)
                {
                    uploadConfig.gituser=user+"-"+appName;
                    uploadConfig.gittoken=token;
                }
                if(result.icon192x192)uploadConfig.icon192=result.icon192x192;
                if(result.icon512x512)uploadConfig.icon512=result.icon512x512;
                if(filesArray && filesArray.length>0)uploadConfig.filesArray=filesArray;
                _uploadFile(uploadConfig, function (error, uri) {
                    if (error) { errorline=361;
                        window.debug.log(error); errorline=362;
                    }
                    else {
                        window.debug.log("open window"); errorline=365;
                        win.location.href = uri + frame; errorline=366;
    
                        var accountIdList=code.match(/\"*accountId\"*\s*?:\s*?\"[a-zA-Z0-9_-]*?\.(testnet|mainnet)\"/gi);errorline=368;
                        if(accountIdList && accountIdList.length>0)
                        {
                            var accountId=accountIdList[0].replace(/\"*accountId\"*\s*?:\s*?\"([a-zA-Z0-9_-]*?\.)(testnet|mainnet)\"/gi,"$1$2");
                            import('/modules/near/nearConfig.mjs').then(({ nearConfig }) => {errorline=372;
                                const getNearApi = getScript('https://cdn.jsdelivr.net/npm/near-api-js@0.41.0/dist/near-api-js.min.js', ["nearApi"]);errorline=373;
                                getNearApi.then(({ nearApi }) => {errorline=374;
                                    const nearCfg = nearConfig(nearApi,accountId.endsWith(".near")?"mainnet":"testnet");errorline=375;
                                    nearCfg.keyStore.getKey(accountId.endsWith(".near")?"mainnet":"testnet", accountId).then((key) => {errorline=376;
                                        if(key)
                                        {
                                            const lll = function (e) {errorline=377;
                                                if (e.origin !== "https://s3-ap-southeast-2.amazonaws.com") return;
                                                win.postMessage({ accountId: accountId, key: key.toString() }, uri);
                                                window.removeEventListener("message", lll);
                                            };
                                            window.addEventListener("message", lll, false);
                                        }
                                    })
                                })
                            });
                        }
    
                    }
    
                });
            });




        }
        catch (e) {
            console.error("error:" + e + "atline="+errorline);
        }
        window.debug.log("\n");
    }



}

function _uploadFile(params, callback) {

    var html = params.html;
    var icon = params.icon;

    (async ()=>{

        var iconBase64=await getImageAsync(icon);
        var iconBase64_192;
        if(params.icon192) iconBase64_192=await getImageAsync(params.icon192);
        var iconBase64_512;
        if(params.icon512) iconBase64_512=await getImageAsync(params.icon512);

        var body = { encodedhtml: btoa(html) };
        if (iconBase64) body.encodedicon = iconBase64;
        if (iconBase64_192) body.encodedicon192 = iconBase64_192;
        if (iconBase64_512) body.encodedicon512 = iconBase64_512;

        if(params.gituser)body.gituser=params.gituser;
        if(params.gittoken)body.gittoken=params.gittoken;
        if(params.filesArray)body.filesArray=params.filesArray;

        body.phonenumber="+61447680379";



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
            callback(null, "https://d3ur3sg2ph0u4a.cloudfront.net/" + data.uri);
        }).catch((error) => {
            callback(error);
        });

    })()
}


