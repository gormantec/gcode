console.log("modules/jquery-3.5.1.slim.min.mjs");

var exports,module;

import 'https://code.jquery.com/jquery-3.5.1.slim.min.js';
console.log($);
console.log("exports:"+exports);
console.log("module:"+module);
if(module) console.log("module.exports:"+module.exports);
console.log("this.JQuery:"+this.JQuery);
console.log("window:"+window);
if(window) console.log("window.JQuery:"+window.JQuery);
if(window) console.log("window.module:"+window.module);
if(window && window.module) console.log("window.module.exports:"+window.module.exports);
var $ = $ || {};
console.log($);
window.$ = $;
export { $ };