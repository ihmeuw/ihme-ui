\<Tooltip />
=====================

`import { Tooltip } from 'ihme-ui'`

A wrapper to provide bounded, absolute positioning for arbitrary content.


Property | Required | Type(s) | Defaults | Description
:---    |:---      |:---     |:---      |:---       
`bounds` |  | object |  | Pixel bounds within which to render tooltip.<br />Defaults to [0, window.innerWidth], [0, window.innerHeight].
`className` |  | [CommonPropTypes.className](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) |  | Class name applied to outermost wrapping `<div>`.
`mouseX` |  | number | 0 | Mouse postion (x; e.g., clientX)
`mouseY` |  | number | 0 | Mouse position (y; e.g., clientY)
`offsetX` |  | number | 0 | Shift tooltip offsetX pixels left (if negative) or right (if positive) of mouseX.
`offsetY` |  | number | 0 | Shift tooltip offsetY pixels above (if negative) or below (if positive) of mouseY.
`paddingX` |  | number | 10 | Guard against placing the tooltip outside of its bounds;<br />at minimum, tooltip will be placed paddingX within bounds.x.
`paddingY` |  | number | 10 | Guard against placing the tooltip outside of its bounds;<br />at minimum, tooltip will be placed paddingY within bounds.y.
`show` |  | bool | false | Whether to show or hide tooltip.
`style` |  | [CommonPropTypes.style](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L16) |  | Inline styles to be applied to tooltip wrapper.
