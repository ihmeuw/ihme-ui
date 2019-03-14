[![Build Status](https://travis-ci.org/ihmeuw/ihme-ui.svg?branch=master)](https://travis-ci.org/ihmeuw/ihme-ui) [![codecov.io](https://codecov.io/github/ihmeuw/ihme-ui/coverage.svg?branch=master)](https://codecov.io/github/ihmeuw/ihme-ui?branch=master)

# [IHME-UI](https://github.com/ihmeuw/ihme-ui)

ihme-ui is a collection of JavaScript utilities and React-based user interface elements and visualization components developed by the [Institute of Health Metrics and Evaluation](http://healthdata.org).
This collection is used in IHME's [visualizations of global health metrics](http://www.healthdata.org/results/data-visualizations).

###### WORK IN PROGRESS: Not stable until v1.0.0

---

## Installation

```sh
npm install -S ihme-ui
```

## Getting started

In it's most simple form, this library can be included in a `<script />` tag and accessed off of `window` as `ihmeUI`.
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
