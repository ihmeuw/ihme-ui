'use strict';

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
        loaders: ['babel']
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  stats: false,
  progress: true
};
