'use strict';

var path = require('path');

module.exports = {
  devtool: 'source-map',
  context: __dirname,
  entry: './app',
  output: {
    path: __dirname,
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: 'node-modules/',
        loader: 'babel'
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  stats: false,
  progress: true
};
