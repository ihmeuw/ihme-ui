ihme-ui-starter
=====================

A starter app demonstrating the use and minimum required dependencies of an app that consumes ihme-ui. See `demos/` of individual components for more demonstrations of the use of individual components.

### Absolute minimum required dependencies

Package | Dependency type | Purpose
--- | :---: | ---
`ihme-ui` | core | React components and helpful utility functions
`react` | core | library for building user interface
`react-dom` | core | package for working with the DOM
`webpack` | dev | processing and bundling

### Other dependencies listed in this starter's package.json

Package | Dependency type | Purpose
--- | :---: | ---
`lodash` | core | utility library for demo
`d3-scale` | core | scales for demo
`babel-plugin-transform-object-rest-spread` | dev | rest & spread transpilation, use as needed
`babel-loader` | dev | babel integration for webpack, include only if you use jsx or es2015
`babel-preset-es2015-webpack` | dev | es2015 preset, minus `import`/`export`, include only if you use jsx or es2015
`babel-preset-react` | dev | jsx transpilation, include only if you use jsx

### CSS
ihme-ui relies on external stylesheets built from CSS modules. To include all styles for the library, you can include

```html
    <link rel="stylesheet" href="node_modules/ihme-ui/style/ihme-ui.css">
```

or, from NPMCDN,

```html
<link rel="stylesheet" href="//npmcdn.com/ihme-ui/style/ihme-ui.css">
```

Alternately, you can include only those stylesheets you need. For example, to include only the stylesheet for the `<Button />` component, you can exclusively include

```html
<link rel="stylesheet" href="node_modules/ihme-ui/style/button.css">
```

If you make use of `<SingleSelect />` or `<MultiSelect />`, you will additionally need to include the following stylesheets:
```html
  <link rel="stylesheet" href="https://npmcdn.com/react-virtualized@7.0.1/styles.css">
  <link rel="stylesheet" href="node_modules/ihme-react-select/dist/ihme-react-select.min.css">
```
