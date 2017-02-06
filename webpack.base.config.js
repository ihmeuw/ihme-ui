'use strict';

var webpack = require('webpack');

module.exports = {
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    mainFields: ['module', 'jsnext:main', 'main'],
  },
};
