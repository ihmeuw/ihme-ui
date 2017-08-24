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
    "arrow-body-style": [1, "as-needed"],
    "max-len": [2, 100, 2, { "ignoreUrls": true, "ignoreComments": true }],
    "array-callback-return": 1,
  },
  "env": {
    "browser": true,
    "mocha": true
  },
  "ecmaFeatures": {
    "experimentalObjectRestSpread": true
  }
};
