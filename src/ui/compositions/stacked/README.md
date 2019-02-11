\<Stacked />
=====================
`import { Stacked } from 'ihme-ui'`

`<Stacked />` is a composition of `<MultiBars />`, `<XAxis />`, `<YAxis />` and `<AxisChart />`.

Property | Required | Type(s) | Defaults | Description
:---    |:---      |:---     |:---      |:---
`align` |  | number |  | [format of scaleBand](https://github.com/d3/d3-scale/blob/master/README.md#scaleBand)<br /> Ordinal scaleBand align property. Sets the alignment of `<Bars />`s to the to the specified value which must be in the range [0, 1].
`bandPadding` |  | number [format of scaleBand](https://github.com/d3/d3-scale/blob/master/README.md#scaleBand) |  | Ordinal scaleBand padding property. A convenience method for setting the inner and outer padding of `<Bars />`s to the same padding value
`bandPaddingInner` |  | number [format of scaleBand](https://github.com/d3/d3-scale/blob/master/README.md#scaleBand) |  | Sets the inner padding of `<Bars />`s to the specified value which must be in the range [0, 1].
`bandPaddingInner` |  | number [format of scaleBand](https://github.com/d3/d3-scale/blob/master/README.md#scaleBand) |  | Sets the outer padding of `<Bars />`s to the specified value which must be in the range [0, 1].
`bandObject` |  | object |  |  Values used for the d3 scale band properties<br />bandObject description: {Object}<br /> - `align`: property used for the align property to alter d3 scaleBand alignment<br /> - `bandPadding`: property used for the bandPadding to alter d3 scaleBand inner and outer padding<br /> - `bandPaddingInner`: property used for the bandPaddingInner to alter d3 scaleBand inner padding<br /> - `bandPaddingOuter`: property used for the bandPaddingOuter to alter d3 scaleBand outer padding <br />
`chartStyle` |  | object |  | inline styles applied to div wrapping the chart
`colorScale` |  | func |  | If provided will determine color of rendered `<Bar />
`className` |  | string |  | applied to chart-container
`data` | true | array |  | array of datum objects
`dataAccessors` | true | object |  | Accessors on datum objects<br />dataAccessors description: {Object}<br /> - `fill`: property on datum to provide fill (will be passed to `props.colorScale`)<br /> - `key`: unique dimension of datum (required)<br /> - `stack`: property on datum to position bars svg element rect in x-direction<br /> - `value`: property on datum to position bars svg element rect in y-direction<br /> - `layer`: property on datum to position bars svg element rect in categorical format. (grouped/stacked) <br />
`displayLegend` |  | boolean | false | when true display the legend component
`fieldAccessors` |  | object |  | Accessors for objects within `props.data`<br />fieldAccessors description: {Object}<br /> - `color`: (optional) color data as input to color scale<br /> - `data`: data provided to child components. default: `values`<br /> - `key`: unique key to apply to child components. used as input to color scale if color field is not specified. default: `key`
`fill` |  | string |  |  If `props.colorScale` is undefined, each `<Bar />` will be given this same fill value.
`focus` |  | object |  | The datum object corresponding to the `<Shape />` currently focused.
`labelAccessors` |  | object |  | Accessors on label objects<br />labelAccessors description: {Object}<br /> - `title`: property used to access the title of the composite component<br /> - `xLabel`: property used to access the xLabel of the composite component<br /> - `yLabel`: property used to access the yLabel of the composite component
`width` |  | number |  | Domain use for the layerOrdinal prop that scales the layer categorical data together.
`layerDomain` |  | array|  | Domain used for the layerOrdinal prop that scales the layer categorical data together.
`legendAccessors` |  | object |  | Accessors on label objects<br />legendAccessors description: {Object}<br /> - `labelKey`: property used to access the path to label in item objects (e.g., 'name', 'properties.label')<br /> - `shapeColorKey`: property used to access the path to shape color in item objects (e.g., 'color', 'properties.color')<br /> - `shapeTypeKey`: property used to access the path to shape type in item objects (e.g., 'type', 'properties.type')
`legendKey` |  | string |  | path to label in item objects (e.g., 'name', 'properties.label') or a function to resolve the label | |
`legendClassName` |  | [CommonPropTypes.className](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) |  | className applied to div wrapping the title
`legendStyle` |  | object |  | inline style object applied to div containing choropleth legend
`onClick` |  | func |  | event handler passed to both choropleth and choropleth legend;<br />signature: (SyntheticEvent, datum, Path) => {...}
`onMouseLeave` |  | func |  | event handler passed to both choropleth and choropleth legend;<br />signature: (SyntheticEvent, datum, Path) => {...}
`onMouseMove` |  | func |  | event handler passed to both choropleth and choropleth legend;<br />signature: (SyntheticEvent, datum, Path) => {...}
`onMouseOver` |  | func |  | event handler passed to both choropleth and choropleth legend;<br />signature: (SyntheticEvent, datum, Path) => {...}
`orientation` |  | string | vertical | Orientation in which bars should be created. <br /> Defaults to vertical, but option for horizontal orientation supported
`scaleAccessors` |  | object |  | Accessors on scales properties<br />scaleAccessors description: {Object}<br /> - `xDomain`: property used to access the xDomain of the scales object<br /> - `yDomain`: property used to access the yDomain of the scales object<br /> - `xScale`: property used to access the xScale  of the scales object<br /> - `yScale`: property used to access the yScale of the scales object
`style` |  | object |  | inline styles applied to outermost wrapping div
`titleClassName` |  | [CommonPropTypes.className](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) |  | className applied to div wrapping the title
`titleStyle` |  | object |  | inline styles applied to div wrapping the title
`type` |  | string |  | Options 'stacked' or 'grouped'. Type of bar chart to be created. If regular bar, do not include.
