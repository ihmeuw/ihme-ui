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
