//import 'https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.13.0/beautify.js';
//import 'https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.13.0/beautify-css.js';
//import 'https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.13.0/beautify-html.js';



var the={};


export function beautify(theEditor) {
    if (the.beautify_in_progress || !theEditor) {
      return;
    }

    var language=theEditor.getOption("mode");
  
    the.beautify_in_progress = true;
  
    var source = theEditor.getValue() ,
        output,
        opts = {};

    the.lastInput = source;

    if (language === 'html') {
      var html_beautify = require(["https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.13.0/beautify-html.js"],({html_beautify})=>{
        output=html_beautify(source, opts);
          theEditor.setValue(output);
          the.lastOutput = output;
          the.lastOpts = selectedOptions;
          the.beautify_in_progress = false;
        });
      output = html_beautify(source, opts);
    } else if (language === 'css') {

      var css_beautify = require(["https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.13.0/beautify-css.js"],({css_beautify})=>{
        output=css_beautify(source, opts);
        theEditor.setValue(output);
        the.lastOutput = output;
        the.lastOpts = selectedOptions;
        the.beautify_in_progress = false;
      });
    } else {
      var js_beautify = require(["https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.13.0/beautify.js"],({js_beautify})=>{
        output=js_beautify(source, opts);
        theEditor.setValue(output);
        the.lastOutput = output;
        the.lastOpts = selectedOptions;
        the.beautify_in_progress = false;
      });
    }
  }