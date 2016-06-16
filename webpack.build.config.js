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
  output: {
    library: 'ihme-ui',
    libraryTarget: 'umd',
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
}, customizer);

if (process.env.NODE_ENV === 'production') {
  buildConfig.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        warnings: false
      }
    })
  );
}


module.exports = buildConfig;
