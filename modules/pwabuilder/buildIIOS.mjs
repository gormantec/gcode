import {createWriteStream} from 'fs';
import {pipeline} from 'stream';
import {promisify} from 'util'
import fetch from 'node-fetch';
const streamPipeline = promisify(pipeline);
const response = await fetch('https://pwabuilder-ios.azurewebsites.net/packages/create', {
    method: 'post',
    body: JSON.stringify({ "name": "screen time", "bundleId": "au.com.gcode", "url": "https://gcode.com.au/apps/37790665-screen-time/index.html", "imageUrl": "/apps/37790665-screen-time/512x512.icon.png", "splashColor": "#212121", "progressBarColor": "#212121", "statusBarColor": "#212121", "permittedUrls": [], "manifestUrl": "https://gcode.com.au/apps/37790665-screen-time/manifest.json", "manifest": { "name": "screen time", "short_name": "screen time", "theme_color": "#212121", "background_color": "#212121", "display": "standalone", "orientation": "any", "description": "A gcode developed PWA app", "icons": [{ "src": "/apps/37790665-screen-time/180x180.icon.png", "sizes": "180x180", "type": "image/png", "purpose": "any maskable" }, { "src": "/apps/37790665-screen-time/192x192.icon.png", "sizes": "192x192", "type": "image/png", "purpose": "any maskable" }, { "src": "/apps/37790665-screen-time/512x512.icon.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable" }], "start_url": "/apps/37790665-screen-time/index.html", "prefer_related_applications": false } }),
    headers: { 'Content-Type': 'application/json' }
});
if (!response.ok) throw new Error(`unexpected response ${response.statusText}`);
await streamPipeline(response.body, createWriteStream('./pwa.zip'));