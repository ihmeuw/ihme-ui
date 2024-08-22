'use strict';

const _ = require('lodash');

const config = require('./webpack.base.config');

function customizer(objValue, srcValue) {
  if (_.isArray(objValue)) {
    return objValue.concat(srcValue);
  }
}

const buildConfig = _.mergeWith({}, config, {
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
      {
        test: /\.svg$/,
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              icon: true,
            },
          },
          'url-loader',
        ]
      }
    ]
  },
  externals: {
    react: 'React',
  },
}, customizer);

module.exports = buildConfig;
