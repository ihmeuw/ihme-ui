Bar
=====================

These components provide the "primitive" bar shapes for constructing bar charts.

---

#### \<MultiBars />
`import { MultiBars } from 'ihme-ui'`

Property | Required | Type(s) | Defaults | Description
:---    |:---      |:---     |:---      |:---
`barsClassName` |  |  [CommonPropTypes.className](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) |  | className applied to `<Bars />`'s outermost wrapping `<g>`
`barsStyle` |  | [CommonPropTypes.style](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) |  | inline styles applied to `<Bars />`'s outermost wrapping `<g>`.
`className` |  | object |  | className applied to outermost wrapping `<g>`
`clipPathId` |  | string |  |  * If a clip path is applied to a container element (e.g., an `<AxisChart />`), clip all children of `<MultiBars />` to that container by passing in the clip path URL id.
`colorScale` |  | func |  | If provided and `dataAccessors.fill` is undefined, determines the color of bars.
`data` | true | array of objects |  | Array of objects, each of which is passed as prop `datum` to a `Bar` component.
`dataAccessors` | true | object |  | Accessors on datum objects<br />dataAccessors description: {Object}<br /> - `fill`: property on datum to provide fill (will be passed to `props.colorScale`)<br /> - `key`: unique dimension of datum (required)<br /> - `stack`: property on datum to position bars svg element rect in x-direction<br /> - `value`: property on datum to position bars svg element rect in y-direction<br /> - `layer`: property on datum to position bars svg element rect in categorical format. (grouped/stacked) <br />
`fieldAccessors` |  | object |  | Accessors for objects within `props.data`<br />fieldAccessors description: {Object}<br /> - `color`: (optional) color data as input to color scale<br /> - `data`: data provided to child components. default: `values`<br /> - `key`: unique key to apply to child components. used as input to color scale if color field is not specified. default: `key`
`focus` |  | object |  | The datum object corresponding to the `<Bar />` currently focused.
`focusedClassName` |  | [CommonPropTypes.className](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) |  | className applied if `<Bar />` has focus.
`focusedStyle` |  | [CommonPropTypes.style](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) |  | Inline styles applied if svg element rect has focus < br/> If an object, spread directly into inline styles. <br /> If a function, called with `props.datum` as argument and return value is spread into inline styles
`layerDomain` |  | array of objects |  | Accessors on label objects<br />layer description: {Object}<br /> - `labelKey`: property used to access the path to label in item objects (e.g., 'name', 'properties.label')<br /> - `shapeColorKey`: property used to access the path to shape color in item objects (e.g., 'color', 'properties.color')<br /> - `shapeTypeKey`: property used to access the path to shape type in item objects (e.g., 'type', 'properties.type')
`layerOrdinal` |  | func |  | Layer ordinal scale for categorical data within a grouped/stacked bar chart.
`onClick` |  | func |  | onClick callback;<br />signature: (SyntheticEvent, datum, Path) => {...}
`onMouseLeave` |  | func |  | onMouseLeave callback.;<br />signature: (SyntheticEvent, datum, Path) => {...}
`onMouseMove` |  | func |  | onMouseMove callback.;<br />signature: (SyntheticEvent, datum, Path) => {...}
`onMouseOver` |  | func |  | onMouseOver callback.;<br />signature: (SyntheticEvent, datum, Path) => {...}
`orientation` |  | string |  | Orientation in which bars should be created. <br /> Defaults to vertical, but option for horizontal orientation supported
`scales` |  | { x: func, y: func } |  |  `x` and `y` scales for positioning `<Bar />`s. Object with keys: `x`, and `y`.
`selectedClassName` |  | [CommonPropTypes.className](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) |  | Class name applied if selected.
`selectedStyle` |  | object |  | Inline styles applied to selected `<Bar />`s. <br /> If an object, spread into inline styles. <br /> If a function, passed underlying datum corresponding to its `<Bar />` and return value spread into line styles
`selection` |  | object or array |  | Datum object or array of datum objects corresponding to selected `<Bar />`s
`style` |  | style [CommonPropTypes.style](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) |  | Base inline styles applied to `<Bar />`s. <br /> If an object, spread into inline styles.  <br /> If a function, passed underlying datum corresponding to its `<Bar />`.
`stacked` |  | boolean |  | unused?

#### \<Bars />
`import { Bars } from 'ihme-ui'`

Property | Required | Type(s) | Defaults | Description
:---    |:---      |:---     |:---      |:---
`align` |  | number |  | [format of scaleBand](https://github.com/d3/d3-scale/blob/master/README.md#scaleBand)<br /> Ordinal scaleBand align property. Sets the alignment of `<Bars />`s to the to the specified value which must be in the range [0, 1].
`bandPadding` |  | number [format of scaleBand](https://github.com/d3/d3-scale/blob/master/README.md#scaleBand) |  | Ordinal scaleBand padding property. A convenience method for setting the inner and outer padding of `<Bars />`s to the same padding value
`bandPaddingInner` |  | number [format of scaleBand](https://github.com/d3/d3-scale/blob/master/README.md#scaleBand) |  | Sets the inner padding of `<Bars />`s to the specified value which must be in the range [0, 1].
`bandPaddingInner` |  | number [format of scaleBand](https://github.com/d3/d3-scale/blob/master/README.md#scaleBand) |  | Sets the outer padding of `<Bars />`s to the specified value which must be in the range [0, 1].
`className` |  | object |  | Class name applied to svg element rect.
`clipPathId` |  | string |  |  * If a clip path is applied to a container element (e.g., an `<AxisChart />`), clip all children of `<MultiBars />` to that container by passing in the clip path URL id.
`colorScale` |  | func |  | If provided and `dataAccessors.fill` is undefined, determines the color of bars.
`data` | true | array of objects |  | Array of objects, each of which is passed as prop `datum` to a `Bar` component.
`dataAccessors` | true | object |  | Accessors on datum objects<br />dataAccessors description: {Object}<br /> - `fill`: property on datum to provide fill (will be passed to `props.colorScale`)<br /> - `key`: unique dimension of datum (required)<br /> - `stack`: property on datum to position bars svg element rect in x-direction<br /> - `value`: property on datum to position bars svg element rect in y-direction<br /> - `layer`: property on datum to position bars svg element rect in categorical format. (grouped/stacked) <br />
`fill` |  | string |  |  Fill color for svg element rect.
`focus` |  | object |  | The datum object corresponding to the `<Bar />` currently focused.
`focusedClassName` |  | [CommonPropTypes.className](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) |  | className applied if svg element rect has focus.
`focusedStyle` |  | [CommonPropTypes.style](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) |  | Inline styles applied if svg element rect has focus < br/> If an object, spread directly into inline styles. <br /> If a function, called with `props.datum` as argument and return value is spread into inline styles
`height` |  | number |  | Height of svg element rect.
`layerOrdinal` |  | func |  | Layer ordinal scale for categorical data within a grouped/stacked bar chart.
`onClick` |  | func |  | onClick callback;<br />signature: (SyntheticEvent, datum, Path) => {...}
`onMouseLeave` |  | func |  | onMouseLeave callback.;<br />signature: (SyntheticEvent, datum, Path) => {...}
`onMouseMove` |  | func |  | onMouseMove callback.;<br />signature: (SyntheticEvent, datum, Path) => {...}
`onMouseOver` |  | func |  | onMouseOver callback.;<br />signature: (SyntheticEvent, datum, Path) => {...}
`orientation` |  | string |  | Orientation in which bars should be created. <br /> Defaults to vertical, but option for horizontal orientation supported
`rectClassName` |  | [CommonPropTypes.className](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) |  | className applied to each `<Bar />`
`rectStyle` |  | [CommonPropTypes.style](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) |  |  Inline styles passed to each `<Bar />`
`scales` |  | { x: func, y: func } |  |  `x` and `y` scales for positioning `<Bar />`s. Object with keys: `x`, and `y`.
`selectedClassName` |  | [CommonPropTypes.className](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) |  | Class name applied if selected.
`selection` |  | object or array |  | Datum object or array of datum objects corresponding to selected `<Bar />`s
`style` |  | style [CommonPropTypes.style](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) |  | Base inline styles applied to `<Bar />`s. <br /> If an object, spread into inline styles.  <br /> If a function, passed underlying datum corresponding to its `<Bar />`.
`type` |  | PropTypes.oneOf(['Stacked', 'stacked', 'Grouped', 'grouped'] |  | Type of bar chart to be created. <br />Default is a simple vertically oriented bar graph. Options for grouped and stacked are also supported.
`grouped` |  | boolean |  | unused?
`stacked` |  | boolean |  | unused?

#### \<Bar />
`import { Bar } from 'ihme-ui'`

Property | Required | Type(s) | Defaults | Description
:---    |:---      |:---     |:---      |:---
`className` |  | object |  | Class name applied to svg element rect.
`clipPathId` |  | string |  | If a clip path is applied to a container element (e.g., an `<AxisChart />`)  clip this path to that container by passing in the clip path URL id.
`datum` |  | object |  | Datum object corresponding to the bar. The component makes no assumptions about the shape of this object. It's only used as a parameter to client-supplied callbacks, like `onClick` and the function form of `style`.
`fill` |  | string |  |  Fill color for svg element rect.
`focused` |  | boolean |  | Whether svg element rect is selected.
`focusedClassName` |  | [CommonPropTypes.className](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) |  | className applied if svg element rect has focus.
`focusedStyle` |  | [CommonPropTypes.style](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) |  | Inline styles applied if svg element rect has focus < br/> If an object, spread directly into inline styles. <br /> If a function, called with `props.datum` as argument and return value is spread into inline styles
`height` |  | number |  | Height of svg element rect.
`onClick` |  | func |  | event handler passed to both choropleth and choropleth legend;<br />signature: (SyntheticEvent, datum, Path) => {...}
`onMouseLeave` |  | func |  | event handler passed to both choropleth and choropleth legend;<br />signature: (SyntheticEvent, datum, Path) => {...}
`onMouseMove` |  | func |  | event handler passed to both choropleth and choropleth legend;<br />signature: (SyntheticEvent, datum, Path) => {...}
`onMouseOver` |  | func |  | event handler passed to both choropleth and choropleth legend;<br />signature: (SyntheticEvent, datum, Path) => {...}
`selected` |  | boolean |  | Whether svg element rect is selected.
`selectedClassName` |  | [CommonPropTypes.className](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) |  | Class name applied if selected.
`selectedStyle` |  | object |  | Inline styles applied to selected `<Bar />`s. <br /> If an object, spread into inline styles. <br /> If a function, passed underlying datum corresponding to its `<Bar />` and return value spread into line styles
`style` |  | style [CommonPropTypes.style](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) |  | Base inline styles applied to `<Bar />`s. <br /> If an object, spread into inline styles.  <br /> If a function, passed underlying datum corresponding to its `<Bar />`.
`width` |  | number |  | Width of svg element rect.
`x` |  | number |  | Initial x position of svg element rect.
`y` |  | number |  | Initial y position of svg element rect.
