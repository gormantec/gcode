import {js_beautify} from 'https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.13.0/beautify.js';
import {css_beautify} from 'https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.13.0/beautify-css.js';
import {html_beautify} from 'https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.13.0/beautify-html.js';



console.log("js_beautify");
console.log(js_beautify);
console.log("css_beautify");
console.log(css_beautify);


export function beautify() {
    if (the.beautify_in_progress) {
      return;
    }
  
    store_settings_to_cookie();
  
    the.beautify_in_progress = true;
  
    var source = the.editor ? the.editor.getValue() : $('#source').val(),
      output,
      opts = {};
    the.lastInput = source;
  
    var additional_options = $('#additional-options').val();
  
    var language = $('#language').val();
    the.language = $('#language option:selected').text();
  
    opts.indent_size = $('#tabsize').val();
    opts.indent_char = parseInt(opts.indent_size, 10) === 1 ? '\t' : ' ';
    opts.max_preserve_newlines = $('#max-preserve-newlines').val();
    opts.preserve_newlines = opts.max_preserve_newlines !== "-1";
    opts.keep_array_indentation = $('#keep-array-indentation').prop('checked');
    opts.break_chained_methods = $('#break-chained-methods').prop('checked');
    opts.indent_scripts = $('#indent-scripts').val();
    opts.brace_style = $('#brace-style').val() + ($('#brace-preserve-inline').prop('checked') ? ",preserve-inline" : "");
    opts.space_before_conditional = $('#space-before-conditional').prop('checked');
    opts.unescape_strings = $('#unescape-strings').prop('checked');
    opts.jslint_happy = $('#jslint-happy').prop('checked');
    opts.end_with_newline = $('#end-with-newline').prop('checked');
    opts.wrap_line_length = $('#wrap-line-length').val();
    opts.indent_inner_html = $('#indent-inner-html').prop('checked');
    opts.comma_first = $('#comma-first').prop('checked');
    opts.e4x = $('#e4x').prop('checked');
    opts.indent_empty_lines = $('#indent-empty-lines').prop('checked');
  
    $('#additional-options-error').hide();
    $('#open-issue').hide();
  
    if (additional_options && additional_options !== '{}') {
      try {
        additional_options = JSON.parse(additional_options);
        opts = mergeObjects(opts, additional_options);
      } catch (e) {
        $('#additional-options-error').show();
      }
    }
  
    var selectedOptions = JSON.stringify(opts, null, 2);
    $('#options-selected').val(selectedOptions);
  
    if (language === 'html') {
      output = the.beautifier.html(source, opts);
    } else if (language === 'css') {
      output = the.beautifier.css(source, opts);
    } else {
      if ($('#detect-packers').prop('checked')) {
        source = unpacker_filter(source);
      }
      output = the.beautifier.js(source, opts);
    }
  
    if (the.editor) {
      the.editor.setValue(output);
    } else {
      $('#source').val(output);
    }
  
    the.lastOutput = output;
    the.lastOpts = selectedOptions;
  
    $('#open-issue').show();
    set_editor_mode();
  
    the.beautify_in_progress = false;
  }