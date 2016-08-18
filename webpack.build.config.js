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
        test: /\.(jsx?)|(css)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
  },
}, customizer);

if (process.env.MINIFY) {
  buildConfig.plugins.push(
    new webpack.optimize.UglifyJsPlugin()
  );
}


module.exports = buildConfig;
