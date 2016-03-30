'use strict';

var blockLoader = require('block-loader');

var options = {
  start: "<pre><code>",
  end: "</code></pre>",
  process: function fixPreBlocks(pre) {
    var replaced = pre
      .replace(options.start,'')   // first, remove the start/end delimiters, then:
      .replace(options.end,'')     //
      .replace(/&/g,'&amp;')       // 1. use html entity equivalent,
      .replace(/</g,'&lt;')        // 2. use html entity equivalent,
      .replace(/>/g,'&gt;')        // 3. use html entity equivalent,
      .replace(/([{}])/g,"{'$1'}") // 4. JSX-safify curly braces,
      .replace(/\n/g,"{'\\n'}");   // 5. and preserve line endings, thanks.

    // done! return with the delimiters put back in place
    return options.start + replaced + options.end
  }
};

module.exports = blockLoader(options);
