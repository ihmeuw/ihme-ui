module.exports = {
  "root": true,
  "parser": "babel-eslint",
  "extends": "airbnb",
  "plugins": [
    "react", "import", "jsx-a11y"
  ],
  "rules": {
    "comma-dangle": 0,
    "no-underscore-dangle": [2, { "allowAfterThis": true }],
    "arrow-body-style": [2, "always"]
  },
  "env": {
    "mocha": true
  },
  "ecmaFeatures": {
    "experimentalObjectRestSpread": true
  }
};