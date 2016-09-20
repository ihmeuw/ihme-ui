const blockLoader = require('block-loader');

const startPre = '<pre><code>';
const endPre = '</code></pre>';

const options = {
  start: `{/* ${startPre}`,
  end: `${endPre} */}`,
  process: function fixBlocks(block) {
    const replaced = block
      .replace(options.start, '')   // first, remove the start/end delimiters, then:
      .replace(options.end, '')     //
      .replace(/&/g, '&amp;')       // 1. use html entity equivalent,
      .replace(/</g, '&lt;')        // 2. use html entity equivalent,
      .replace(/>/g, '&gt;')        // 3. use html entity equivalent,
      .replace(/([{}])/g, "{'$1'}") // 4. JSX-safify curly braces,
      .replace(/\n/g, "{'\\n'}");   // 5. and preserve line endings, thanks.

    // done! return with the delimiters put back in place
    return `${startPre}${replaced}${endPre}`;
  },
};

module.exports = blockLoader(options);
