'use strict';

const path = require('path');
const _ = require('lodash');
const autoprefixer = require('autoprefixer');

const baseConfig = require('./webpack.base.config');

module.exports = function(directory) {
  const demoConfig = {
    devtool: 'source-map',
    entry: path.resolve(directory, 'app.jsx'),
    output: {
      path: path.resolve(directory),
      filename: 'bundle.js',
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: [
            { loader: 'babel-loader' },
            { loader: path.resolve(__dirname, './scripts/html-pre-tag-loader') }
          ]
        },
        {
          test: /\.css$/,
          use: [
            { loader: 'style-loader' },
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                localIdentName: '[name]__[local]___[hash:base64:5]',
                modules: true,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: [autoprefixer],
              },
            },
          ]
        }
      ]
    }
  };

  return _.mergeWith({}, baseConfig, demoConfig);
};
