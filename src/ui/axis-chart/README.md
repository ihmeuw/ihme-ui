<AxisChart \/>
=====================
`import AxisChart from 'ihme-ui/ui/axis-chart'`

Wraps and provides its child charting components with height, width, scales, and padding


Property | Required | Type(s) | Defaults | Description
        --- | :---: | :---: | :---: | ---
`className` |  | [CommonPropTypes.className](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) |  | className applied to outermost svg element
`clipPath` |  | bool |  | apply clipping path to charting area
`height` | true | number |  | pixel height of line chart
`loading` |  | bool |  | flag to delay rendering while fetching data
`padding` |  | object | {<br />  top: 20,<br />  right: 20,<br />  bottom: 30,<br />  left: 50,<br />} | padding around the chart contents, space for Axis and Label
`style` |  | object |  | inline styles to apply to outermost svg element
`width` | true | number |  | pixel width of line chart
`xDomain` |  | array |  | [min, max] for xScale (i.e., the domain of the data)
`xScaleType` |  | one of: SCALE_TYPES |  | type of x scale<br />[name of d3 scale scale function](https://github.com/d3/d3-scale)
`yDomain` |  | array |  | [min, max] yScale (i.e., the range of the data)
`yScaleType` |  | one of: SCALE_TYPES |  | type of y scale<br />[name of d3 scale scale function](https://github.com/d3/d3-scale)

