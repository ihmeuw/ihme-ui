\<Axis />
=====================
`import { Axis } from 'ihme-ui'`


Property | Required | Type(s) | Defaults | Description
:---    |:---      |:---     |:---      |:---       
`className` |  | [CommonPropTypes.className](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) |  | className applied to outermost group element
`height` |  | atLeastOneOfProp(HEIGHT_PROP_TYPES) | 0 | height of charting area, minus padding<br />required if translate is not provided
`label` |  | string |  | the axis label
`labelClassName` |  | [CommonPropTypes.className](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) |  | className applied to text element surrounding axis label
`labelStyle` |  | object |  | inline styles applied to text element surrounding axis label
`orientation` | true | one of: Object.keys(AXIS_TYPES) |  | where to position axis line; will position ticks accordingly<br />one of: "top", "right", "bottom", "left"
`padding` |  | object | {<br />  top: 40,<br />  bottom: 40,<br />  left: 50,<br />  right: 50,<br />} | used to position label<br />keys: 'top', 'bottom', 'left', 'right'
`scale` |  | atLeastOneOfProp(AXIS_SCALE_PROP_TYPES) | scaleLinear() | appropriate scale for axis
`style` |  | object |  | inline styles to apply to outermost group element
`ticks` |  | number |  | [number of axis ticks use](https://github.com/d3/d3-axis#axis_ticks)
`tickArguments` |  | array |  | [alternative to tickValues and/or tickFormat](https://github.com/d3/d3-axis#axis_tickArguments)
`tickFormat` |  | func |  | [format of axis ticks](https://github.com/d3/d3-axis#axis_tickFormat)
`tickPadding` |  | number |  | [padding of axis ticks](https://github.com/d3/d3-axis#axis_tickPadding)
`tickSize` |  | number |  | [size of both inner and outer tick lines](https://github.com/d3/d3-axis#axis_tickSize)
`tickSizeInner` |  | number |  | [size of inner tick lines](https://github.com/d3/d3-axis#axis_tickSizeInner)
`tickSizeOuter` |  | number |  | [size of outer tick lines](https://github.com/d3/d3-axis#axis_tickSizeOuter)
`tickValues` |  | array |  | [user-specified tick values](https://github.com/d3/d3-axis#axis_tickValues)
`translate` |  | object |  | push axis in x or y direction<br />keys: 'x' (required), 'y' (required)<br />required if width and height are not provided
`width` |  | atLeastOneOfProp(WIDTH_PROP_TYPES) | 0 | width of charting area, minus padding<br />required if translate is not specified

--- 

#### \<XAxis />
`import { XAxis } from 'ihme-ui'`

Chart x-axis that extends \<Axis /> and provides some useful defaults.

All props documented on \<Axis /> are available on \<XAxis />.


Property | Required | Type(s) | Defaults | Description
:---    |:---      |:---     |:---      |:---       
`orientation` |  | one of: 'top', 'bottom' | 'bottom' | where to position axis line<br />one of: 'top', 'bottom'
`scale` |  | atLeastOneOfProp(X_AXIS_SCALE_PROP_TYPES) |  | alternative to providing scales object with key 'x' and scale function as value
`scales` |  | atLeastOneOfProp(X_AXIS_SCALE_PROP_TYPES) | { x: scaleLinear() } | scales are provided by axis-chart, only x scale is used by XAxis
`width` |  |  | 0 | 
`height` |  |  | 0 | 
`padding` |  |  | {<br />  top: 40,<br />  bottom: 40,<br />} | 

---

#### \<YAxis />
`import { YAxis } from 'ihme-ui'`

Chart y-axis that extends \<Axis /> and provides some useful defaults.

All props documented on \<Axis /> are available on \<YAxis />.


Property | Required | Type(s) | Defaults | Description
:---    |:---      |:---     |:---      |:---       
`orientation` |  | one of: 'left', 'right' | 'left' | where to position axis line<br />one of: 'left', 'right'
`scale` |  | atLeastOneOfProp(Y_AXIS_SCALE_PROP_TYPES) |  | alternative to providing scales object with key 'y' and scale function as value
`scales` |  | atLeastOneOfProp(Y_AXIS_SCALE_PROP_TYPES) | { y: scaleLinear() } | scales are provided by axis-chart, only y scale is used by YAxis
`width` |  |  | 0 | 
`height` |  |  | 0 | 
`padding` |  |  | {<br />  left: 50,<br />  right: 50,<br />} | 
