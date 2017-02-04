<ChoroplethLegend \/>
=====================
`import ChoroplethLegend from 'ihme-ui/ui/choropleth-legend'`


Property | Required | Type(s) | Defaults | Description
        --- | :---: | :---: | :---: | ---
`axisTickFormat` |  | func | numberFormat | [format of axis ticks](https://github.com/d3/d3-axis#axis_tickFormat)
`axisTranslate` |  | object | {<br />  x: 0,<br />  y: 20<br />} | shift axis in the x or y directions; use to put padding between the color gradient rect and the axis
`colorScale` | true | func |  | color scale for density plot; should accept `datum[valueField]` and return color string
`colorSteps` | true | array |  | array of color steps, e.g. ['#fff', '#ccc', '\#000', ...]
`data` | true | array |  | array of datum objects
`domain` | true | array |  | [min, max] for xScale; xScale positions density plot and provides axis
`height` |  | number |  | height of outermost svg
`keyField` |  | string, func |  | uniquely identifying property of datum or function that accepts datum and returns unique value;<br />if not provided, density plot symbols are keyed as `${xValue}:${yValue}:${index}`
`margins` |  | object | {<br />  top: 50,<br />  right: 100,<br />  bottom: 50,<br />  left: 100<br />} | margins to subtract from width and height
`onClick` |  | func |  | onClick callback for density plot circles;<br />signature: function(event, data, instance) {...}
`onMouseLeave` |  | func |  | onMouseLeave callback for density plot circles;<br />signature: function(event, data, instance) {...}
`onMouseMove` |  | func |  | onMouseMove callback for density plot circles;<br />signature: function(event, data, instance) {...}
`onMouseOver` |  | func |  | onMouseOver callback for density plot circles;<br />signature: function(event, data, instance) {...}
`onSliderMove` |  | func |  | callback function to attach to slider handles;<br />passed [min, max] (Array), the range extent as a percentage
`rangeExtent` | true | array |  | array of [min, max] for slider in data space; `domain` is a good initial value
`selectedLocations` |  | array of object |  | array of selected datum objects
`sliderHandleFormat` |  | func | numberFormat | format of slider handle labels
`unit` |  | string |  | unit of data; axis label
`valueField` | true | string, func |  | property of data objects used to position and fill density plot circles;<br />if a function, signature: function(datum) {...}
`width` |  | number |  | width of outermost svg, in pixels
`x1` |  | number | 0 | x-axis coord (as percentage) of the start of the gradient (e.g., 0)
`x2` |  | number | 100 | x-axis coord (as percentage) of the end of the gradient (e.g., 100)
`xScale` |  | func | scaleLinear() | scale for positioning density plot along its x-axis; must expose `domain` and `range` methods
`zoom` |  | number | 1 | float value used for implementing "zooming";<br />any element that needs to become larger in "presentation mode" should respond to this scale factor.<br />Guide<br />zoom: 0 -> smallest possible<br />zoom: 0.5 -> half of normal size<br />zoom: 1 -> normal size ()<br />zoom: 2 -> twice normal size

