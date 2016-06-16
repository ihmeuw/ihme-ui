'use strict';

var config = require('./webpack.base.config');
var _ = require('lodash');

module.exports = _.merge({}, config, {
  output: {
    libraryTarget: 'commonjs2',
    path: __dirname,
  },
});
