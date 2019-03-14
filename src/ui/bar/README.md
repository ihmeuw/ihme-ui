Bars
=====================

components for creating bar charts

---

#### \<Bar/>
`import { Bar } from 'ihme-ui'`

A low-level component representing a simple rectangle, used as a primitive element in `Bars`, `GroupedBars`, and `StackedBars`.

Property | Required | Type(s) | Default | Description
:---    |:---      |:---     |:---      |:---
`className` |  | object |  | Class name applied to svg element rect.
`clipPathId` |  | string |  | If a clip path is applied to a container element (e.g., an `<AxisChart />`)  clip this path to that container by passing in the clip path URL id.
`datum` |  | object |  | Datum object associated with the bar. The component makes no assumptions about the shape of this object. It's only used as a parameter to client-supplied callbacks, like `onClick` and the function form of `style`.
`fill` |  | string | `'steelblue'` |  Fill color for svg element rect.
`focused` |  | boolean | `false` | Whether svg element rect is selected.
`focusedClassName` |  | [CommonPropTypes.className](../../../utils/props.js#L13) | `'focused'` | className applied if svg element rect has focus.
`focusedStyle` |  | [CommonPropTypes.style](../../utils/props.js#L18) | `{ stroke: '#000', strokeWidth: 1 }` | Inline styles applied if svg element rect has focus < br/> If an object, spread directly into inline styles. <br /> If a function, called with `props.datum` as argument and return value is spread into inline styles
`height` | true | number |  | Height of svg element rect.
`onClick` |  | func | no-op | handler for 'click' event. signature: (SyntheticEvent, datum, Path) => {...}
`onMouseLeave` |  | func | no-op | handler for 'mouseleave' event. signature: (SyntheticEvent, datum, Path) => {...}
`onMouseMove` |  | func | no-op | handler for 'mousemove' event. signature: (SyntheticEvent, datum, Path) => {...}
`onMouseOver` |  | func | no-op | handler for 'mouseover' event. signature: (SyntheticEvent, datum, Path) => {...}
`selected` |  | boolean | `false` | Whether svg element rect is selected.
`selectedClassName` |  | [CommonPropTypes.className](../../../utils/props.js#L13) | `'selected'` | Class name applied if selected.
`selectedStyle` |  | object | `{ stroke: '#000', strokeWidth: 1 }` | Inline styles applied to selected `<Bar/>`s. <br /> If an object, spread into inline styles. <br /> If a function, passed underlying datum corresponding to its `<Bar/>` and return value spread into line styles
`style` |  | style [CommonPropTypes.style](../../utils/props.js#L18) | `{}` | Base inline styles applied to `<Bar/>`s. <br /> If an object, spread into inline styles.  <br /> If a function, passed underlying datum corresponding to its `<Bar/>`.
`width` | true | number |  | Width of svg element rect.
`x` | true | number |  | Initial x position of svg element rect.
`y` | true | number |  | Initial y position of svg element rect.

---

#### Common Props for \<Bars/>, \<GroupedBars/>, and \<StackedBars/>

Property | Required | Type(s) | Default | Description
:---    |:---      |:---     |:---      |:---
`align` |  | number | 0.5 | Alignment of each bar within its band. If there is any padding between bars, this property specifies how that space will be allocated. The value must be in the range [0, 1], where: <br/> - 0 represents left alignment <br/> - 0.5 represents center alignment <br/> - 1 represents right alignment <br/> See: https://github.com/d3/d3-scale/blob/master/README.md#band_align
`bandPadding` |  | number | 0.05 | A convenience for setting the `innerPadding` and `outerPadding` to the same value. See: https://github.com/d3/d3-scale/blob/master/README.md#band_padding
`innerPadding` |  | number | | Padding between bars, specified as a proportion of the band width (i.e. the space allocated for each bar). The value must be in the range [0, 1], where: <br/> - 0 represents no padding between bars <br/> - 0.5 represents padding of the same width as the bars <br/> - 1 represents all padding, giving bars a width of 0 (probably not very useful) <br/> See: https://github.com/d3/d3-scale/blob/master/README.md#band_paddingInner
`outerPadding` |  | number | | Padding before the first bar and after the last bar, specified as a proportion (or multiple) of the band width (i.e. the space allocated for each bar). See: https://github.com/d3/d3-scale/blob/master/README.md#band_paddingOuter
`categories` | true | string[] or number[] | | List of category names used in the bar chart. Categories are arrayed across the domain. For a normal bar chart, each category is represented by a single bar. For stacked bars, each category is represented by a single stack. For grouped bars, each category is represented by a single group.
`className` |  | [CommonPropTypes.className](../../../utils/props.js#L13) |  | className applied to outermost wrapping `<g>`
`clipPathId` |  | string |  | If a clip path is applied to a container element, clip all children to that container by passing in the clip path URL id.
`data` | true | array of objects |  | Array of datum objects. A datum object can be just about anything. The only restriction is that it must be possible to obtain the category and value (and, for grouped or stacked bar charts, the subcategory) of each datum using the `dataAccessors`.
`fill` |  | string or function | | either a string representing the fill color (in which case the same color is used for all bars) or a function taking the `datum` and returning a string representing the fill color
`focus` |  | object |  | the datum object corresponding to the `<Bar/>` currently focused
`focusedClassName` |  | [CommonPropTypes.className](../../../utils/props.js#L13) |  | className applied if `<Bar/>` has focus
`focusedStyle` |  | [CommonPropTypes.style](../../utils/props.js#L18) |  | inline styles applied to focused `<Bar/>`. If an object, spread into inline styles. If a function, passed underlying datum corresponding to its `<Bar/>`, and return value is spread into inline styles. <br/> `signature: (datum) => obj`
`height` | true | number |  | height, in pixels, of bar chart
`width` | true | number | | width, in pixels, of bar chart
`onClick` |  | func | no-op | onClick callback applied to each `<Bar/>`. <br/> signature: (SyntheticEvent, datum, instance) => {...}
`onMouseLeave` |  | func | no-op | onMouseLeave callback applied to each `<Bar/>`. <br/> signature: (SyntheticEvent, datum, instance) => {...}
`onMouseMove` |  | func | no-op | onMouseMove callback applied to each `<Bar/>`. <br/> signature: (SyntheticEvent, datum, instance) => {...}
`onMouseOver` |  | func | no-op | onMouseOver callback applied to each `<Bar/>`. <br/> signature: (SyntheticEvent, datum, instance) => {...}
`orientation` |  | `'vertical'` or `'horizontal'` | `'vertical'` | orientation of bar chart, representing the direction in which bars extend from the domain axis
`rangeMax` | | number | | maximum value (on the range axis) the chart needs to support. If not provided, it will be computed from the data.
`rectClassName` |  | [CommonPropTypes.className](../../../utils/props.js#L13) |  | className applied to each `<Bar/>`
`rectStyle` |  | [CommonPropTypes.style](../../utils/props.js#L18) |  |  inline styles passed to each `<Bar/>`
`scales` |  | `{ x: func, y: func }` |  |  Object with keys: `x`, and `y`, representing D3 scaling functions used for positioning `<Bar/>`s. The domain axis is assumed to use a band scale, the range axis a linear scale. See: <br/> - https://github.com/d3/d3-scale/blob/master/README.md#band-scales <br/> - https://github.com/d3/d3-scale/blob/master/README.md#linear-scales <br/> `scales` is an optional low-level interface designed to integrate with AxisChart, which passes this prop to its children. If not provided, appropriate scaling functions will be computed based on the `data` and the chart `height` and `width`.
`selectedClassName` |  | [CommonPropTypes.className](../../../utils/props.js#L13) |  | className applied to `<Bar/>`s if selected
`selectedStyle` | | [CommonPropTypes.style](../../utils/props.js#L18) | | inline styles applied to selected `<Bar/>`s. If an object, spread into inline styles. If a function, passed underlying datum corresponding to its `<Bar/>`, and return value is spread into inline styles. `signature: (datum) => obj`
`selection` |  | object or array |  | datum object or array of datum objects corresponding to selected `<Bar/>`s
`style` |  | [CommonPropTypes.style](../../utils/props.js#L18) |  | inline styles applied to wrapping `<g>` element

---

#### \<Bars/>
`import { Bars } from 'ihme-ui'`

Creates the bars for a conventional bar chart (i.e. one bar for each category)

Property | Required | Type(s) | Default | Description
:---    |:---      |:---     |:---      |:---
`dataAccessors` | true | { category: [CommonPropTypes.dataAccessor](../../utils/props.js#L30), value: [CommonPropTypes.dataAccessor](../../utils/props.js#L30) } | | Accessors on datum objects: <br/> - `category`: used to determine the bar's category (to plot it on the chart domain) <br/> - `value`: used to obtain the bar's data value (to plot it on the chart range) <br/> Each accessor can either be a string or function. If a string, it is assumed to be the name of a property on datum objects; full paths to nested properties are supported (e.g. `{ x: 'values.year', ... }`). If a function, it is passed the datum as its first and only argument.

---

#### \<GroupedBars/>
`import { GroupedBars } from 'ihme-ui'`

Creates the bars for a grouped bar chart. Each category represents a group, and each subcategory represents a single bar in each group.

Property | Required | Type(s) | Default | Description
:---    |:---      |:---     |:---      |:---
`innerGroupPadding` | | number | 0.02 | Padding between the bars of each group, specified as a proportion of the band width (i.e. the space allocated for each group).
`dataAccessors` | true | { category: [CommonPropTypes.dataAccessor](../../utils/props.js#L30), subcategory: [CommonPropTypes.dataAccessor](../../utils/props.js#L30), value: [CommonPropTypes.dataAccessor](../../utils/props.js#L30) } | | Accessors on datum objects: <br/> - category: used to determine the bar's group (to plot it on the chart domain) <br/> - subcategory: used to determine the bar's subcategory within its group <br/> - value: used to obtain the bar's data value (to plot it on the chart range) <br/> Each accessor can either be a string or function. If a string, it is assumed to be the name of a property on datum objects; full paths to nested properties are supported (e.g. `{ x: 'values.year', ... }`). If a function, it is passed the datum as its first and only argument.
`subcategories` | true | string[] or number[] | | List of subcategory names used in the bar chart. In a grouped bar chart, each group contains a bar for each subcategory.

---

#### \<StackedBars/>
`import { StackedBars } from 'ihme-ui'`

Creates the bars for a stacked bar chart. Each category represents a stack, and each subcategory represents a layer in each stack.

Property | Required | Type(s) | Default | Description
:---    |:---      |:---     |:---      |:---
`dataAccessors` | true | { category: [CommonPropTypes.dataAccessor](../../utils/props.js#L30), subcategory: [CommonPropTypes.dataAccessor](../../utils/props.js#L30), value: [CommonPropTypes.dataAccessor](../../utils/props.js#L30) } | | Accessors on datum objects: <br/> - category: used to determine the bar's stack (to plot it on the chart domain) <br/> - subcategory: used to determine the bar's layer within its stack <br/> - value: used to obtain the bar's data value (to plot it on the chart range) <br/> Each accessor can either be a string or function. If a string, it is assumed to be the name of a property on datum objects; full paths to nested properties are supported (e.g. `{ x: 'values.year', ... }`). If a function, it is passed the datum as its first and only argument.
`subcategories` | true | string[] or number[] | | List of subcategory names used in the bar chart. In a stacked bar chart, each stack contains a layer for each subcategory.
