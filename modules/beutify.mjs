//import 'https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.13.0/beautify.js';
//import 'https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.13.0/beautify-css.js';
//import 'https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.13.0/beautify-html.js';

import { getScript } from '/modules/getScript.mjs';
const getBeautify = getScript('https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.13.0/beautify.js', ["js_beautify"]);
const getCssBeautify = getScript('https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.13.0/beautify-css.js', ["css_beautify"]);
const getHtmlBeautify = getScript('https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.13.0/beautify-html.js', ["html_beautify"]);



var the={};


export function beautify(theEditor,options) {
    if (the.beautify_in_progress || !theEditor) {
      return;
    }

    var language=theEditor.getOption("mode");
    console.log(language);
  
    the.beautify_in_progress = true;
  
    var source = theEditor.getValue() ,
        output,
        opts = options || {};

    the.lastInput = source;


    if (language === 'html') {
      getHtmlBeautify.then(({html_beautify})=>{
        output=html_beautify(source, opts);
          theEditor.setValue(output);
          the.lastOutput = output;
          the.lastOpts = opts;
          the.beautify_in_progress = false;
        });
      output = html_beautify(source, opts);
    } else if (language === 'css') {

      getCssBeautify.then(({css_beautify})=>{
        output=css_beautify(source, opts);
        theEditor.setValue(output);
        the.lastOutput = output;
        the.lastOpts = opts;
        the.beautify_in_progress = false;
      });
    } else {
      getBeautify.then(({js_beautify})=>{
        output=js_beautify(source, opts);
        theEditor.setValue(output);
        the.lastOutput = output;
        the.lastOpts = opts;
        the.beautify_in_progress = false;
      });
    }

  }