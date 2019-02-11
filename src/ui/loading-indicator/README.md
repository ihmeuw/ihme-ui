\<LoadingIndicator />
=====================

`import { LoadingIndicator } from 'ihme-ui'`

Yet another loading indicator.

Property | Required | Type(s) | Defaults | Description
:---    |:---      |:---     |:---      |:---
`className` |  | [CommonPropTypes.className](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) |  | Class name applied to outermost wrapping `<div>`.
`inline` |  | bool |  | Display inline with other elements (e.g., in a button).
`style` |  | object |  | Inline styles applied to outermost wrapping `<div>`.
`shapeFill` |  | string | 'black' | Fill color of loading shape.
`shapeStyle` |  | [CommonPropTypes.style](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L16) |  | Inline styles applied to loading shape.
`shapeType` |  | string | 'circle' | Type of loading shape to render.<br />One of: 'circle', 'cross', 'diamond', 'square', 'star', 'triangle', 'wye'
