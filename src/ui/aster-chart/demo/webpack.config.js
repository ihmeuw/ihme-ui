'use strict';

var WebpackNotifierPlugin = require('webpack-notifier');

module.exports = {
  devtool: 'source-map',
  entry: __dirname + '/app.jsx',
  output: {
    path: __dirname,
    filename: 'bundle.js'
  },
  plugins: [
    new WebpackNotifierPlugin({alwaysNotify: true})
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: __dirname + '../node-modules/',
        loaders: ['babel-loader', __dirname + '/html-pre-tag-loader']
      },
      {
        test: /\.css$/,
        loader: 'style!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader'
      },
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },

};
