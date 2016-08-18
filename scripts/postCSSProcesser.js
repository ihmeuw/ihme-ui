const postcss = require('postcss');
const autoprefixer = require('autoprefixer');

module.exports = function postCSSProcessor(data) {
  const plugins = [autoprefixer];
  return postcss(plugins).process(data).css;
};
