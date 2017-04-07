\<ChoroplethLegend />
=====================
`import { ChoroplethLegend } from 'ihme-ui'`


Property | Required | Type(s) | Defaults | Description
:---    |:---      |:---     |:---      |:---       
`axisTickFormat` |  | func | numberFormat | [format of axis ticks](https://github.com/d3/d3-axis#axis_tickFormat)
`axisTranslate` |  | object | {<br />  x: 0,<br />  y: 20<br />} | shift axis in the x or y directions; use to put padding between the color gradient rect and the axis
`colorScale` | true | func |  | color scale for density plot; should accept `datum[valueField]` and return color string
`colorSteps` | true | array |  | color steps, e.g. ['#fff', '#ccc', '\#000', ...]
`data` | true | array |  | array of datum objects
`domain` | true | array |  | [min, max] for xScale; xScale positions density plot and provides axis
`focus` |  | object |  | The datum object corresponding to the `<Shape />` currently focused.
`focusedClassName` |  | [CommonPropTypes.className](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) |  | className applied if `<Shape />` has focus.
`focusedStyle` |  | [CommonPropTypes.style](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L16) |  | Inline styles applied to focused `<Shape />`.<br />If an object, spread into inline styles.<br />If a function, passed underlying datum corresponding to its `<Shape />`,<br />and return value is spread into inline styles;<br />signature: (datum) => obj
`height` |  | number |  | height of outermost svg
`keyField` |  | string, func |  | uniquely identifying property of datum or function that accepts datum and returns unique value;<br />if not provided, density plot shapes are keyed as `${xValue}:${yValue}:${index}`
`margins` |  | object | {<br />  top: 50,<br />  right: 100,<br />  bottom: 50,<br />  left: 100<br />} | margins to subtract from width and height
`onClick` |  | func |  | onClick callback for density plot circles;<br />signature: (SyntheticEvent, data, instance) => {...}
`onMouseLeave` |  | func |  | onMouseLeave callback for density plot circles;<br />signature: (SyntheticEvent, data, instance) => {...}
`onMouseMove` |  | func |  | onMouseMove callback for density plot circles;<br />signature: (SyntheticEvent, data, instance) => {...}
`onMouseOver` |  | func |  | onMouseOver callback for density plot circles;<br />signature: (SyntheticEvent, data, instance) => {...}
`onSliderMove` |  | func |  | Callback to attach to slider handles;<br />passed the range extent as a decimal representing percent of the range, e.g, [0.2, 0.5].<br />signature: ([min, max]) => {...}
`rangeExtent` | true | array |  | [min, max] for slider in data space;<br />if `isEqual(rangeExtent, domain)`, slider handles will be positioned at start and end of legend,<br />which makes `props.domain` a good initial value
`selectedLocations` |  | array of object |  | array of selected datum objects
`sliderHandleFormat` |  | func | numberFormat | formatter for handle labels
`unit` |  | string |  | unit of data; axis label
`valueField` | true | string, func |  | property of data objects used to position and fill density plot circles;<br />if a function, signature: (datum) => {...}
`width` |  | number |  | width of outermost svg, in pixels
`x1` |  | number | 0 | x-axis coord (as percentage) of the start of the gradient (e.g., 0)
`x2` |  | number | 100 | x-axis coord (as percentage) of the end of the gradient (e.g., 100)
`xScale` |  | func | scaleLinear() | scale for positioning density plot along its x-axis; must expose `domain` and `range` methods
`zoom` |  | number | 1 | float value used for implementing "zooming";<br />any element that needs to become larger in "presentation mode" should respond to this scale factor.<br />Guide<br />zoom: 0 -> smallest possible<br />zoom: 0.5 -> half of normal size<br />zoom: 1 -> normal size ()<br />zoom: 2 -> twice normal size

