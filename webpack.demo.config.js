'use strict';

var path = require('path');
var _ = require('lodash');
var autoprefixer = require('autoprefixer');

var baseConfig = require('./webpack.base.config');

function customizer(objValue, srcValue) {
  if (_.isArray(objValue)) {
    return objValue.concat(srcValue);
  }
};

module.exports = function(directory) {
  const demoConfig = {
    devtool: 'source-map',
    entry: path.resolve(directory, 'app.jsx'),
    output: {
      path: directory,
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
