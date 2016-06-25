'use strict';

var path = require('path');
var autoprefixer = require('autoprefixer');
var WebpackNotifierPlugin = require('webpack-notifier');

module.exports = {
  devtool: 'source-map',
  context: __dirname,
  entry: './app.jsx',
  output: {
    path: __dirname,
    filename: 'bundle.js',
    publicPath: '/assets/'
  },
  plugins: [
    new WebpackNotifierPlugin({alwaysNotify: true})
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: 'node-modules/',
        loaders: ['babel', __dirname + '/html-pre-tag-loader']
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
  progress: true
};
