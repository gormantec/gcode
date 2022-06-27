import { createWriteStream } from 'fs';
import { pipeline } from 'stream';
import { promisify } from 'util'
import fetch from 'node-fetch';


const streamPipeline = promisify(pipeline);
const response = await fetch('https://pwabuilder-cloudapk.azurewebsites.net/generateAppPackage', {
    method: 'post',
    body: JSON.stringify({
        "appVersion":"1.0.0.0",
        "appVersionCode":1,
        "backgroundColor":"#212121",
        "display":"standalone",
        "enableNotifications":true,
        "enableSiteSettingsShortcut":true,
        "fallbackType":"customtabs",
        "features":{
            "locationDelegation":{"enabled":true},
            "playBilling":{"enabled":false}},
            "host":"gcode.com.au",
            "iconUrl":"https://gcode.com.au/apps/37790665-screen-time/512x512.icon.png",
            "includeSourceCode":false,
            "isChromeOSOnly":false,
            "launcherName":"screen time",
            "maskableIconUrl":"https://gcode.com.au/apps/37790665-screen-time/512x512.icon.png",
            "monochromeIconUrl":"","name":"screen time",
            "navigationColor":"#212121",
            "navigationColorDark":"#212121",
            "navigationDividerColor":"#212121",
            "navigationDividerColorDark":"#212121",
            "orientation":"any",
            "packageId":"au.com.gcode.twa",
            "shortcuts":[],"signing":{
                "file":null,
                "alias":"my-key-alias",
                "fullName":"screen time Admin",
                "organization":"screen time",
                "organizationalUnit":"Engineering",
                "countryCode":"US","keyPassword":"",
                "storePassword":""},
                "signingMode":"new",
                "splashScreenFadeOutDuration":300,
                "startUrl":"/apps/37790665-screen-time/index.html",
                "themeColor":"#212121",
                "webManifestUrl":"https://gcode.com.au/apps/37790665-screen-time/manifest.json",
                "pwaUrl":"https://gcode.com.au/apps/37790665-screen-time/index.html"
            }),
    headers: { 'Content-Type': 'application/json' }
});
if (!response.ok) throw new Error(`unexpected response ${response.statusText}`);
await streamPipeline(response.body, createWriteStream('./pwa.zip'));