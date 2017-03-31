'use strict';

module.exports = {
  devtool: 'source-map',
  // context: __dirname,
  entry: './app.jsx',
  output: {
    path: __dirname,
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: __dirname + '/node-modules/',
        loaders: ['babel-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  }
};
