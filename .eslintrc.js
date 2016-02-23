module.exports = {
  "root": true,
  "parser": "babel-eslint",
  "extends": "airbnb",
  "plugins": [
    "react"
  ],
  "rules": {
    "comma-dangle": 0,
    "arrow-body-style": [2, "always"]
  },
  "env": {
    "mocha": true
  },
  "ecmaFeatures": {
    "experimentalObjectRestSpread": true
  }
};