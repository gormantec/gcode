import { createWriteStream } from 'fs';
import { pipeline } from 'stream';
import { promisify } from 'util'
import fetch from 'node-fetch';

console.log("https://gcode.com.au/apps/" + process.env.APP_NAME + "/manifest.json");
const _manifest = await fetch("https://gcode.com.au/apps/" + process.env.APP_NAME + "/manifest.json");
const _manifestJSON=await _manifest.json();

const theBody={
    "appVersion":"1.0.0.0",
    "appVersionCode":1,
    "backgroundColor":_manifestJSON.background_color,
    "display":"standalone",
    "enableNotifications":true,
    "enableSiteSettingsShortcut":true,
    "fallbackType":"customtabs",
    "features":{
        "locationDelegation":{"enabled":true},
        "playBilling":{"enabled":false}},
        "host":"gcode.com.au",
        "iconUrl":"https://gcode.com.au/apps/" + process.env.APP_NAME + "/512x512.icon.png",
        "includeSourceCode":false,
        "isChromeOSOnly":false,
        "launcherName":_manifestJSON.name,
        "maskableIconUrl":"https://gcode.com.au/apps/" + process.env.APP_NAME + "/512x512.icon.png",
        "monochromeIconUrl":"",
        "name":_manifestJSON.name,
        "navigationColor":_manifestJSON.background_color,
        "navigationColorDark":_manifestJSON.background_color,
        "navigationDividerColor":_manifestJSON.background_color,
        "navigationDividerColorDark":_manifestJSON.background_color,
        "orientation":_manifestJSON.orientation,
        "packageId":"au.com.gcode.x"+process.env.APP_NAME.replace(/\-/g,""),
        "shortcuts":[],"signing":{
            "file":null,
            "alias":"my-key-alias",
            "fullName":_manifestJSON.name+", a gcode app",
            "organization":"Gorman Technology",
            "organizationalUnit":"Software",
            "countryCode":"AU",
            "keyPassword":"",
            "storePassword":""},
            "signingMode":"new",
            "splashScreenFadeOutDuration":300,
            "startUrl":"/apps/" + process.env.APP_NAME + "/index.html",
            "themeColor":_manifestJSON.theme_color,
            "webManifestUrl":"https://gcode.com.au/apps/" + process.env.APP_NAME + "/manifest.json",
            "pwaUrl":"https://gcode.com.au/apps/" + process.env.APP_NAME + "/index.html"
        };

const streamPipeline = promisify(pipeline);
console.log(theBody);
const response = await fetch('https://pwabuilder-cloudapk.azurewebsites.net/generateAppPackage', {
    method: 'post',
    body: JSON.stringify(theBody),
    headers: { 'Content-Type': 'application/json' }
});

console.log(response.body);
if (!response.ok) throw new Error(`unexpected response ${response.statusText}`);
await streamPipeline(response.body, createWriteStream('./pwa.zip'));