module.exports = {
  "root": true,
  "parser": "babel-eslint",
  "extends": "airbnb",
  "plugins": [
    "react"
  ],
  "rules": {
    "comma-dangle": 0
  },
  "env": {
    "mocha": true
  },
  "ecmaFeatures": {
    "experimentalObjectRestSpread": true
  }
};