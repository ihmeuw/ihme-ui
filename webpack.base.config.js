'use strict';

var webpack = require('webpack');

module.exports = {
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
  ],
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  progress: true,
};
