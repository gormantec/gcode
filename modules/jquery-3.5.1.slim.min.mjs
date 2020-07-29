import 'https://code.jquery.com/jquery-3.5.1.slim.min.js';
console.log($);
console.log("exports:"+exports);
console.log("module:"+module);
console.log("module.exports:"+module.exports);
var $ = $ || {};
console.log($);
window.$ = $;
export { $ };