[![Build Status](https://travis-ci.org/ihmeuw/ihme-ui.svg?branch=main)](https://travis-ci.org/ihmeuw/ihme-ui) [![codecov.io](https://codecov.io/github/ihmeuw/ihme-ui/coverage.svg?branch=main)](https://codecov.io/github/ihmeuw/ihme-ui?branch=main)

# [IHME-UI](https://github.com/ihmeuw/ihme-ui)

ihme-ui is a collection of JavaScript utilities and React-based user interface elements and visualization components developed by the [Institute of Health Metrics and Evaluation](http://healthdata.org).
This collection is used in IHME's [visualizations of global health metrics](http://www.healthdata.org/results/data-visualizations).


---

## Installation

```sh
npm install -S ihme-ui
```

## Getting started

In it's most basic form, this library can be included in a `<script />` tag and accessed off of `window` as `ihmeUI`.
If you've installed the library from the [npm registry](https://www.npmjs.com/package/ihme-ui), you can pull the library out of your `node_modules` folder.
If not, grab it off of the unoffical NPM CDN, [unpkg](https://unpkg.com/#/).

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>IHME-UI Starter</title>
  <link rel="stylesheet" href="node_modules/ihme-ui/dist/ihme-ui.css"/>
  <!-- OR from unkpk CDN
  <link rel="stylesheet" href="//unpkg.com/ihme-ui/dist/ihme-ui.css">
  -->
</head>
<body>
  <main id="app">...</main>
  <script src="node_modules/ihme-ui/dist/ihme-ui.js"></script>
  <!-- OR from unkpk CDN
  <script src="//unpkg.com/ihme-ui/dist/ihme-ui.js"></script>
  -->
  <script>
    var chart = React.createElement(ihmeUI.AxisChart, {
      domain: ihmeUI.linspace([3, 10], 200),
      ...
    });

    ReactDOM.render(chart, document.getElementById('app'));
  </script>
</body>
</html>
```

In most cases, however, you'll be importing ihme-ui into your project, and bundling it with a module bundler like [Webpack](https://webpack.github.io/) or [Rollup](http://rollupjs.org/).
In support of this, `ihme-ui` exposes both a CommonJS (i.e., `var ihmeUI = require('ihme-ui')`) and an ES module (i.e., `import ihmeUI from 'ihme-ui'`) target.
```javascript
// index.js

import { AxisChart, linspace } from 'ihme-ui';
//...
```
## Local development and posting pull requests
1. In Github, click on the Code dropdown/button to clone the repo. You can use either https or ssh. 
2. Open a terminal, navigate to where you have your repos saved, then clone.
`git clone theUrlFromGithubgoes.here`
3. Be sure to [set up a personal token](https://github.blog/2020-12-15-token-authentication-requirements-for-git-operations/); you'll need it to push up your working branch to the remote.
4. Change to the ihme-ui directory and install dependencies. 
```
cd ihme-ui
npm i
```
5. Create a new ticket branch and check it out.
`git checkout -b ticket-branch-name`
6. Make your code changes. 
7. Run the demo for that component (e.g., map demo). You'll need to re-run this script every time you save additional changes to rebuild the demo. 
`npm run demo map`
8. Open a browser window and enter the path to the demo. For example, http://localhost:8888//ihme-ui/src/ui/compositions/map/demo/index.html (Change the port number to whichever port you're using for local development in MAMP.)
9. You'll need to refresh the browser every time you rebuild the demo.
10. Stage changes and commit as necessary.
```
git status // to see changed files`
git add filename.js // or git add . to add all modified files
git commit -m "enter your commit message here" // commit your changes locally
```
11. Push up your working branch in order to create a PR.
`git push -u origin working-branch-name`
12. Go to IHME-UI in Github and click on Compare & Pull Request, then click New Pull Request. 
13. Select your working branch and which branch you're making the request onto (typically main).
14. Add a description of the changes.
15. Add other IHME developers as reviewers
16. Click Create Pull Request.  
---

## API Reference
* Components
  * [\<Axis /\>](src/ui/axis/README.md)
  * [\<AxisChart /\>](src/ui/axis-chart/README.md)
  * [Bar](src/ui/bar/README.md)
    * \<Bar /\>
    * \<Bars /\>
    * \<GroupedBars /\>
    * \<StackedBars /\>
  * [\<Button /\>](src/ui/button/README.md)
  * [\<Choropleth /\>](src/ui/choropleth/README.md)
  * [Compositions](src/ui/compositions/README.md)
    * [\<BarChart /\>](src/ui/compositions/bar-chart/README.md)
    * [\<ChoroplethLegend /\>](src/ui/compositions/choropleth-legend/README.md)
    * [\<Map /\>](src/ui/compositions/map/README.md)
  * [\<ExpansionContainer /\>](src/ui/expansion-container/README.md)
  * [\<Group /\> and \<Option /\>](src/ui/group/README.md)
  * [\<HtmlLabel /\>](src/ui/html-label/README.md)
  * [\<Legend /\>](src/ui/legend/README.md)
  * [\<LoadingIndicator /\>](src/ui/loading-indicator/README.md)
  * [\<ResponsiveContainer /\>](src/ui/responsive-container/README.md)
  * \<Select /\> - docs coming soon!
  * [Shape](src/ui/shape/README.md)
    * \<Area /\>
    * \<Line /\>
    * \<MultiLine /\>
    * \<MultiScatter /\>
    * \<Scatter /\>
    * \<Shape /\>
  * [\<Slider /\>](src/ui/slider/README.md)
  * [\<SvgText /\>](src/ui/svg-text/README.md)
  * [\<Tooltip /\>](src/ui/tooltip/README.md)
* Utilities - docs coming soon!
