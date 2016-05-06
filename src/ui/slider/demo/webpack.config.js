'use strict';

var path = require('path');
var autoprefixer = require('autoprefixer');

module.exports = {
  devtool: 'source-map',
  context: __dirname,
  entry: './app.jsx',
  output: {
    path: __dirname,
    filename: 'bundle.js',
    publicPath: '/assets/'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: 'node-modules/',
        loader: 'babel'
      },
      {
        test: /\.css$/,
        loader: [
          'style-loader',
          'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
          'postcss-loader'
        ].join('!')
      }
    ]
  },
  postcss: [autoprefixer],
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  stats: false,
  progress: true
};
