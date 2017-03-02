\<ResponsiveContainer />
=====================

`import { ResponsiveContainer } from 'ihme-ui'`


A container which provides its children with props `width` and `height` (in pixels).
Perfect for when using components that require explicit dimensions.
This is a simple wrapper around [react-virtualized's `<AutoSizer />`](https://github.com/bvaughn/react-virtualized/blob/master/docs/AutoSizer.md),
which provides the core functionality.


Property | Required | Type(s) | Defaults | Description
:---    |:---      |:---     |:---      |:---       
`children` |  | array of node, node |  | 
`disableHeight` |  | bool |  | Disable dynamic :height property
`disableWidth` |  | bool |  | Disable dynamic :width property
`onResize` |  | func |  | Callback to be invoked on-resize.<br />Signature: ({ height, width }) => {...}
