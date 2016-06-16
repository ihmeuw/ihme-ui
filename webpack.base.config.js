'use strict';

var path = require('path');
var autoprefixer = require('autoprefixer');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var _ = require('lodash');

module.exports = {
  module: {
    loaders: [
      {
        test: /\.css$/,
        loaders: [
          ExtractTextPlugin.extract('style-loader'),
          'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]--[hash:base64:5]',
          'postcss-loader'
        ],
      },
    ],
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new ExtractTextPlugin('style/' + path.parse(process.argv[2]).name + '.css'),
  ],
  postcss: [autoprefixer({ browsers: ['last 2 versions'] })],
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  stats: false,
  progress: true,
};
