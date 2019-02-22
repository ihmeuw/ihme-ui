#### \<BarChart />
=====================
`import { BarChart } from 'ihme-ui'`

`<BarChart />` is a composition that can be used for producing normal, grouped, and stacked bar charts, including x- and y-axes, title, and an optional legend.

Property | Required | Type(s) | Default | Description
:---    |:---      |:---     |:---      |:---
`axisLabels`| | { domain: string, range: string } | | label text for axes
`align` |  | number | | Alignment of each bar within its band. If there is any padding between bars, this property specifies how that space will be allocated. The value must be in the range [0, 1], where: <br/> - 0 represents left alignment <br/> - 0.5 represents center alignment <br/> - 1 represents right alignment <br/> See: https://github.com/d3/d3-scale/blob/master/README.md#band_align
`bandPadding` |  | number | | A convenience for setting the `bandInnerPadding` and `bandOuterPadding` to the same value. See: https://github.com/d3/d3-scale/blob/master/README.md#band_padding
`bandInnerGroupPadding` | | number | | Padding between the bars of each group, specified as a proportion of the band width (i.e. the space allocated for each group).
`bandInnerPadding` |  | number | | Padding between bars, specified as a proportion of the band width (i.e. the space allocated for each bar). The value must be in the range [0, 1], where: <br/> - 0 represents no padding between bars <br/> - 0.5 represents padding of the same width as the bars <br/> - 1 represents all padding, giving bars a width of 0 (probably not very useful) <br/> See: https://github.com/d3/d3-scale/blob/master/README.md#band_paddingInner
`bandOuterPadding` |  | number | | Padding before the first bar and after the last bar, specified as a proportion (or multiple) of the band width (i.e. the space allocated for each bar). See: https://github.com/d3/d3-scale/blob/master/README.md#band_paddingOuter
`categories` | true | string[] or number[] | | List of category names used in the bar chart. Categories are arrayed across the domain. For a normal bar chart, each category is represented by a single bar. For stacked bars, each category is represented by a single stack. For grouped bars, each category is represented by a single group.
`subcategories` | true | string[] or number[] | | List of subcategory names used in the bar chart. In a stacked bar chart, each stack contains a layer for each subcategory. In a grouped bar chart, each group contains a bar for each subcategory.
`chartStyle` | | [CommonPropTypes.style](../../../utils/props.js#L13) | | inline styles applied to the element wrapping the chart (included axes)
`className` |  | [CommonPropTypes.className](../../../utils/props.js#L13) |  | className applied to outermost container element
`data` | true | array of objects |  | Array of datum objects. A datum object can be just about anything. The only restriction is that it must be possible to obtain the category and value (and, for grouped or stacked bar charts, the subcategory) of each datum using the `dataAccessors`.
`dataAccessors` | true | { category: [CommonPropTypes.dataAccessor](../../utils/props.js#L30), subcategory: [CommonPropTypes.dataAccessor](../../utils/props.js#L30), value: [CommonPropTypes.dataAccessor](../../utils/props.js#L30) } | | Accessors on datum objects: <br/> - category: used to determine the bar's category (to plot it on the chart domain). In a stacked bar chart, it represents the stack. In a grouped bar chart, it represents the group. <br/> - subcategory: for a grouped or stacked bar chart, used to determine the bar's subcategory (layer in a stack or member of group) <br/> - value: used to obtain the bar's data value (to plot it on the chart range) <br/> Each accessor can either be a string or function. If a string, it is assumed to be the name of a property on datum objects; full paths to nested properties are supported (e.g. `{ x: 'values.year', ... }`). If a function, it is passed the datum as its first and only argument.
`displayLegend` | | bool | `false` | display a legend?
`fill` |  | string or function | | either a string representing the fill color (in which case the same color is used for all bars) or a function taking the `datum` and returning a string representing the fill color
`focus` |  | object |  | the datum object corresponding to the `<Bar/>` currently focused
`focusedClassName` |  | [CommonPropTypes.className](../../../utils/props.js#L13) |  | className applied if `<Bar/>` has focus
`focusedStyle` |  | [CommonPropTypes.style](../../../utils/props.js#L18) |  | inline styles applied to focused `<Bar/>`. If an object, spread into inline styles. If a function, passed underlying datum corresponding to its `<Bar/>`, and return value is spread into inline styles. <br/> `signature: (datum) => obj`
`legendAccessors` | if `displayLegend` | { labelKey: [CommonPropTypes.dataAccessor](../../utils/props.js#L30), shapeColorKey: [CommonPropTypes.dataAccessor](../../utils/props.js#L30), shapeTypeKey: [CommonPropTypes.dataAccessor](../../utils/props.js#L30) } | | Accessors to `legendItems` objects: <br/> - labelKey: used to get the legend item label <br/> - shapeColorKey: used to get the shape color <br/> - shapeTypeKey: used to get the shape type <br/> Required if `displayLegend` is `true`.
`legendItems` | if `displayLegend` | object[] | | Array of objects used to build items in the legend. These objects can be just about anything. The only restriction is that it must be possible to obtain the label, shape color, and shape type for the legend item using the `legendAccessors`. Required if `displayLegend` is `true`.
`legendClassName` | | [CommonPropTypes.className](../../../utils/props.js#L13) | | className applied to element wrapping the legend
`legendStyle | | [CommonPropTypes.style](../../../utils/props.js#L18) | | inline styles applied to element wrapping the legend
`onClick` |  | func | selects (or deselects) clicked bars | onClick callback applied to each `<Bar/>`. <br/> signature: (SyntheticEvent, datum, instance) => {...}
`onMouseLeave` |  | func | | onMouseLeave callback applied to each `<Bar/>`. <br/> signature: (SyntheticEvent, datum, instance) => {...}
`onMouseMove` |  | func | | onMouseMove callback applied to each `<Bar/>`. <br/> signature: (SyntheticEvent, datum, instance) => {...}
`onMouseOver` |  | func | | onMouseOver callback applied to each `<Bar/>`. <br/> signature: (SyntheticEvent, datum, instance) => {...}
`orientation` |  | `'vertical'` or `'horizontal'` | `'vertical'` | orientation of bar chart, representing the direction in which bars extend from the domain axis
`padding` | | { top: number, bottom: number, left: number, right: number } | | padding around the chart contents
`rectClassName` |  | [CommonPropTypes.className](../../../utils/props.js#L13) |  | className applied to each `<Bar/>`
`rectStyle` |  | [CommonPropTypes.style](../../../utils/props.js#L18) |  |  inline styles passed to each `<Bar/>`
`selectedClassName` |  | [CommonPropTypes.className](../../../utils/props.js#L13) |  | className applied to `<Bar/>`s if selected
`selectedStyle` | | [CommonPropTypes.style](../../../utils/props.js#L18) | | inline styles applied to selected `<Bar/>`s. If an object, spread into inline styles. If a function, passed underlying datum corresponding to its `<Bar/>`, and return value is spread into inline styles. `signature: (datum) => obj`
`selection` |  | object or array |  | datum object or array of datum objects corresponding to selected `<Bar/>`s
`style` |  | [CommonPropTypes.style](../../../utils/props.js#L18) |  | inline styles applied to outermost container element
`title` | | string | | title text for the chart
`titleClassName` | | [CommonPropTypes.className](../../../utils/props.js#L13) | | className applied to element wrapping the title
`titleStyle` | | [CommonPropTypes.style](../../../utils/props.js#L18) | | inline styles applied to element wrapping the title
`type` | | `'normal'`, `'stacked'`, or `'grouped'` | `'normal'` | bar chart type
