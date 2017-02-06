'use strict';

var webpack = require('webpack');
var _ = require('lodash');

var config = require('./webpack.base.config');

function customizer(objValue, srcValue) {
  if (_.isArray(objValue)) {
    return objValue.concat(srcValue);
  }
};

var buildConfig = _.mergeWith({}, config, {
  devtool: 'cheap-module-source-map',
  output: {
    library: 'ihmeUI',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.(jsx?)|(css)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
    ],

  },
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
  },
}, customizer);


module.exports = buildConfig;
