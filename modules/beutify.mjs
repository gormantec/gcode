import {js_beautify} from 'https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.13.0/beautify.js';
import {css_beautify} from 'https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.13.0/beautify-css.js';
import {html_beautify} from 'https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.13.0/beautify-html.js';



console.log("js_beautify");
console.log(js_beautify);
console.log("css_beautify");
console.log(css_beautify);

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
      output = html_beautify(source, opts);
    } else if (language === 'css') {
      output = css_beautify(source, opts);
    } else {
      output = js_beautify(source, opts);
    }

    theEditor.setValue(output);

  
    the.lastOutput = output;
    the.lastOpts = selectedOptions;
  
    $('#open-issue').show();
    set_editor_mode();
  
    the.beautify_in_progress = false;
  }