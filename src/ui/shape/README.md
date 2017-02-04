Shapes
=====================

These components provide the "primitive" shapes for constructing line/area charts and scatter plots.
This is organizationally intended to mimic [d3-shape](https://github.com/d3/d3-shape).


#### `<Area />`
`import { Area } from 'ihme-ui/ui/shape'`


Property | Required | Type(s) | Defaults | Description
        --- | :---: | :---: | :---: | ---
`className` |  | [CommonPropTypes.className](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) |  | className applied to path.
`clipPathId` |  | string |  | if a clip path is applied to a container element (e.g., an `<AxisChart />`),<br />clip this path to that container by passing in the clip path URL id.
`data` | true | array of object |  | Array of datum objects.
`dataAccessors` | true | object | { x: 'x', y0: 'y0', y1: 'y1' } | Accessors to pull appropriate values off of datum objects.<br />`dataAccessors` is an object that should have three properties: `x`, `y0`, and `y1`.<br />Each accessor can either be a string or function. If a string, it is assumed to be the name of a<br />property on datum objects; full paths to nested properties are supported (e.g., { `x`: 'values.year', ... }).<br />If a function, it is passed datum objects as its first and only argument.
`onClick` |  | func | CommonDefaultProps.noop | onClick callback.<br />signature: function(SyntheticEvent, data, instance) {...}
`onMouseLeave` |  | func | CommonDefaultProps.noop | onMouseLeave callback.<br />signature: function(SyntheticEvent, data, instance) {...}
`onMouseMove` |  | func | CommonDefaultProps.noop | onMouseMove callback.<br />signature: function(SyntheticEvent, data, instance) {...}
`onMouseOver` |  | func | CommonDefaultProps.noop | onMouseOver callback.<br />signature: function(SyntheticEvent, data, instance) {...}
`scales` | true | object |  | `x` and `y` scales.<br />Object with keys: `x`, and `y`.
`style` |  | [CommonPropTypes.style](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L16) | {<br />  fill: 'steelblue',<br />  stroke: 'steelblue',<br />  strokeWidth: 1,<br />} | inline styles applied to path


#### `<Line />`
`import { Line } from 'ihme-ui/ui/shape'`


Property | Required | Type(s) | Defaults | Description
        --- | :---: | :---: | :---: | ---
`className` |  | [CommonPropTypes.className](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) |  | className applied to path.
`clipPathId` |  | string |  | if a clip path is applied to a container element (e.g., an `<AxisChart />`),<br />clip this path to that container by passing in the clip path URL id.
`data` | true | array of object |  | Array of datum objects.
`dataAccessors` | true | object | { x: 'x', y: 'y' } | Accessors to pull appropriate values off of datum objects.<br />`dataAccessors` is an object that should have two properties: `x`, and `y`.<br />Each accessor can either be a string or function. If a string, it is assumed to be the name of a<br />property on datum objects; full paths to nested properties are supported (e.g., { `x`: 'values.year', ... }).<br />If a function, it is passed datum objects as its first and only argument.
`onClick` |  | func | CommonDefaultProps.noop | onClick callback.<br />signature: function(SyntheticEvent, data, instance) {...}
`onMouseLeave` |  | func | CommonDefaultProps.noop | onMouseLeave callback.<br />signature: function(SyntheticEvent, data, instance) {...}
`onMouseMove` |  | func | CommonDefaultProps.noop | onMouseMove callback.<br />signature: function(SyntheticEvent, data, instance) {...}
`onMouseOver` |  | func | CommonDefaultProps.noop | onMouseOver callback.<br />signature: function(SyntheticEvent, data, instance) {...}
`scales` | true | object |  | `x` and `y` scales.<br />Object with keys: `x`, and `y`.
`style` |  | [CommonPropTypes.style](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L16) | {<br />  stroke: 'steelblue',<br />  strokeWidth: 1,<br />} | inline styles applied to path


#### `<MultiLine />`
`import { MultiLine } from 'ihme-ui/ui/shape'`

This is a convenience component intended to make it easier to render many `<Line />`s
on a single chart. It additionally supports rendering `<Area />`s when the proper `dataAccessors`
are provided, which can be helpful, for example, for showing uncertainty around an estimate represented
by a line.


Property | Required | Type(s) | Defaults | Description
        --- | :---: | :---: | :---: | ---
`areaClassName` |  | [CommonPropTypes.className](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) |  | classname applied to `<Area/>`s that are children of MultiLine, if applicable
`areaStyle` |  | [CommonPropTypes.style](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L16) |  | inline styles applied to `<Area />`s, if applicable
`areaValuesIteratee` |  | func | CommonDefaultProps.identity | Function to apply to the data to transform area values. default: _.identity<br />signature: (data, key) => {...}
`className` |  | [CommonPropTypes.className](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) |  | className applied to outermost wrapping `<g>`
`clipPathId` |  | string |  | If a clip path is applied to a container element (e.g., an `<AxisChart />`),<br />clip all children of `<MultiLine />` to that container by passing in the clip path URL id.
`colorScale` |  | func | function() { return 'steelblue'; } | Function that accepts keyfield and returns stroke color for line.
`data` |  | array of object |  | Array of objects, e.g. [ {location: 'USA',values: []}, {location: 'Canada', values: []} ].
`dataAccessors` | true | object, object, object |  | Keys on datum objects containing values to scale to chart<br />  x: accessor for xscale<br />  y: accessor for yscale (when applicable, e.g. <Line />)<br />  y0: accessor for yscale (when applicable; e.g., lower bound)<br />  y1: accessor for yscale (when applicable; e.g., upper bound)<br />To render `<Line />`s, include just x, y.<br />To render `<Area />`s, include just x, y0, y1.<br />To render `<Line />`s and `<Area />`s, include all four properties.<br />Each accessor can either be a string or function. If a string, it is assumed to be the name of a<br />property on datum objects; full paths to nested properties are supported (e.g., { `x`: 'values.year', ... }).<br />If a function, it is passed datum objects as its first and only argument.
`fieldAccessors` |  | object | {<br />  data: 'values',<br />  key: 'key',<br />} | Accessors for objects within `props.data`<br /> color: (optional) color data as input to color scale.<br /> data: data provided to child components. default: 'values'<br /> key: unique key to apply to child components. used as input to color scale if color field is not specified. default: 'key'<br /> For example:<br /> IF (`props.data` === [ {location: 'USA',values: [{...}, {...}]}, {location: 'Canada', values: [{...}, {...}]} ])<br /> THEN `fieldAccessors` === { data: 'values', key: 'location' }
`lineClassName` |  | [CommonPropTypes.className](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) |  | classname applied to `<Line />`s, if applicable
`lineStyle` |  | [CommonPropTypes.style](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L16) |  | inline styles applied to `<Line />`s, if applicable
`lineValuesIteratee` |  | func | CommonDefaultProps.identity | function to apply to the data to transform area values. default: _.identity<br />signature: (data, key) => {...}
`onClick` |  | func |  | onClick callback.<br />signature: function(SyntheticEvent, data, instance) {...}
`onMouseLeave` |  | func |  | onMouseLeave callback.<br />signature: function(SyntheticEvent, data, instance) {...}
`onMouseMove` |  | func |  | onMouseMove callback.<br />signature: function(SyntheticEvent, data, instance) {...}
`onMouseOver` |  | func |  | onMouseOver callback.<br />signature: function(SyntheticEvent, data, instance) {...}
`scales` | true | object | { x: scaleLinear(), y: scaleLinear() } | `x` and `y` scales.<br />Object with keys: `x`, and `y`.
`style` |  | [CommonPropTypes.style](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L16) |  | inline style applied to outermost wrapping `<g>`


#### `<Scatter />`
`import { Scatter } from 'ihme-ui/ui/shape'`


Property | Required | Type(s) | Defaults | Description
        --- | :---: | :---: | :---: | ---
`className` |  | [CommonPropTypes.className](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) |  | className applied to outermost wrapping `<g>`.
`clipPathId` |  | string |  | If a clip path is applied to a container element (e.g., an `<AxisChart />`),<br />clip all children of `<Scatter />` to that container by passing in the clip path URL id.
`colorScale` |  | func |  | If provided will determine color of rendered `<Symbol />`s
`data` | true | array of object |  | Array of datum objects
`dataAccessors` | true | object |  | Accessors on datum objects<br />  fill: property on datum to provide fill (will be passed to `props.colorScale`)<br />  key: unique dimension of datum (required)<br />  symbol: property on datum used to determine which type of symbol to render (will be passed to `props.symbolScale`)<br />  x: property on datum to position scatter symbols in x-direction<br />  y: property on datum to position scatter symbols in y-direction<br />Each accessor can either be a string or function. If a string, it is assumed to be the name of a<br />property on datum objects; full paths to nested properties are supported (e.g., { `x`: 'values.year', ... }).<br />If a function, it is passed datum objects as its first and only argument.
`fill` |  | string | 'steelblue' | If `props.colorScale` is undefined, each `<Symbol />` will be given this same fill value.
`focus` |  | object |  | The datum object corresponding to the `<Symbol />` currently focused.
`focusedClassName` |  | [CommonPropTypes.className](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) |  | className applied if `<Symbol />` has focus.
`focusedStyle` |  | [CommonPropTypes.style](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L16) |  | inline styles applied to focused `<Symbol />`<br />If an object, spread into inline styles.<br />If a function, passed underlying datum corresponding to its `<Symbol />`.
`onClick` |  | func | CommonDefaultProps.noop | onClick callback.<br />signature: function(SyntheticEvent, data, instance) {...}
`onMouseLeave` |  | func | CommonDefaultProps.noop | onMouseLeave callback.<br />signature: function(SyntheticEvent, data, instance) {...}
`onMouseMove` |  | func | CommonDefaultProps.noop | onMouseMove callback.<br />signature: function(SyntheticEvent, data, instance) {...}
`onMouseOver` |  | func | CommonDefaultProps.noop | onMouseOver callback.<br />signature: function(SyntheticEvent, data, instance) {...}
`scales` | true | object |  | `x` and `y` scales for positioning `<Symbol />`s.<br />Object with keys: `x`, and `y`.
`selectedClassName` |  | [CommonPropTypes.className](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) |  | className applied to `<Symbol />`s if selected
`selection` |  | array |  | Array of datum objects corresponding to selected `<Symbol />`s
`size` |  | number | 64 | Size of `<Symbol />`s; area in square pixels.<br />If not provided, `<Symbol />` provides a default of 64.
`style` |  | [CommonPropTypes.style](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L16) |  | Inline styles passed to each `<Symbol />`
`symbolClassName` |  | [CommonPropTypes.className](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) |  | className applied to each `<Symbol />`
`symbolScale` |  | func |  | If provided, used in conjunction with `dataAccessors.symbol` (or `dataAccessors.key` if not provided)<br />to determine type of symbol to render
`symbolType` |  | string | 'circle' | Type of symbol to render; use in lieu of `props.symbolScale`<br />if you want all `<Symbol />` to be of the same type.


#### `<Symbol />`
`import { Symbol } from 'ihme-ui/ui/shape'`


Property | Required | Type(s) | Defaults | Description
        --- | :---: | :---: | :---: | ---
`className` |  | [CommonPropTypes.className](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) |  | Class name applied to path.
`clipPathId` |  | string |  | If a clip path is applied to a container element (e.g., an `<AxisChart />`),<br />clip this path to that container by passing in the clip path URL id.
`datum` |  | object |  | Datum object corresponding to this symbol ("bound" data, in the language in D3)
`fill` |  | string | 'steelblue' | Fill color for path.
`focused` |  | bool | false | Whether symbol has focus.
`focusedClassName` |  | [CommonPropTypes.className](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) | 'focused' | Class name applied if symbol has focus.
`focusedStyle` |  | [CommonPropTypes.style](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L16) | {<br />  stroke: '#AAF',<br />  strokeWidth: 1,<br />} | Inline styles applied if symbol has focus.<br />If an object, spread directly into inline styles.<br />If a function, called with `props.datum` as argument; must return an object of inline styles.
`onClick` |  | func | CommonDefaultProps.noop | onClick callback.<br />signature: function(SyntheticEvent, data, instance) {...}
`onMouseLeave` |  | func | CommonDefaultProps.noop | onMouseLeave callback.<br />signature: function(SyntheticEvent, data, instance) {...}
`onMouseMove` |  | func | CommonDefaultProps.noop | onMouseMove callback.<br />signature: function(SyntheticEvent, data, instance) {...}
`onMouseOver` |  | func | CommonDefaultProps.noop | onMouseOver callback.<br />signature: function(SyntheticEvent, data, instance) {...}
`selected` |  | bool | false | Whether symbol is selected.
`selectedClassName` |  | [CommonPropTypes.className](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) | 'selected' | Class name applied if selected.
`selectedStyle` |  | [CommonPropTypes.style](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L16) | {<br />  stroke: '#000',<br />  strokeWidth: 1,<br />} | Inline styles applied to selected `<Symbol />`s.<br />If an object, spread into inline styles.<br />If a function, passed underlying datum corresponding to its `<Symbol />`.
`size` |  | number | 64 | Area in square pixels.
`style` |  | [CommonPropTypes.style](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L16) | {} | Base inline styles applied to `<Symbol />`s.<br />If an object, spread into inline styles.<br />If a function, passed underlying datum corresponding to its `<Symbol />`.
`symbolType` |  | one of: symbolTypes() | 'circle' | Type of symbol to render, driven by d3-shape.<br />One of: 'circle', 'cross', 'diamond', 'square', 'star', 'triangle', 'wye'
`translateX` |  | number | 0 | Move symbol away from origin in x direction.
`translateY` |  | number | 0 | Move symbol away from origin in y direction.
