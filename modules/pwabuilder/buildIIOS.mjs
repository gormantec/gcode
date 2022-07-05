import { createWriteStream } from 'fs';
import { pipeline } from 'stream';
import { promisify } from 'util'
import fetch from 'node-fetch';

console.log("https://gcode.com.au/apps/" + process.env.APP_NAME + "/manifest.json");
const _manifest = await fetch("https://gcode.com.au/apps/" + process.env.APP_NAME + "/manifest.json");
const _manifestJSON=await _manifest.json();
const streamPipeline = promisify(pipeline);
const pwabuilderData={
    "name": _manifestJSON.name,
    "bundleId": "au.com.gcode.*",
    "url": "https://gcode.com.au"+_manifestJSON.start_url,
    "imageUrl": "/apps/" + process.env.APP_NAME + "/512x512.icon.png",
    "splashColor": _manifestJSON.background_color,
    "progressBarColor": _manifestJSON.theme_color,
    "statusBarColor": _manifestJSON.background_color,
    "permittedUrls":_manifestJSON.permitted_urls,
    "manifestUrl": "https://gcode.com.au/apps/" + process.env.APP_NAME + "/manifest.json",
    "manifest": _manifestJSON
}
const response = await fetch('https://pwabuilder-ios.azurewebsites.net/packages/create', {
    method: 'post',
    body: JSON.stringify(pwabuilderData),
    headers: { 'Content-Type': 'application/json' }
});
console.log(JSON.stringify(pwabuilderData));
if (!response.ok) throw new Error(`unexpected response ${response.statusText}`);
await streamPipeline(response.body, createWriteStream('./pwa.zip'));

