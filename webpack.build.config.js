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
