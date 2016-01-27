'use strict';

var path = require('path');

module.exports = {
  context: path.join(__dirname, 'demo'),
  entry: './app',
  output: {
    path: path.join(__dirname, 'demo'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'demo')
        ],
        loader: 'babel-loader'
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  stats: false,
  progress: true
};
