Shapes
=====================

These components provide the "primitive" shapes for constructing line/area charts and scatter plots.
This is organizationally intended to mimic [d3-shape](https://github.com/d3/d3-shape).

---

#### \<Area />
`import { Area } from 'ihme-ui'`


Property | Required | Type(s) | Defaults | Description
:---    |:---      |:---     |:---      |:---       
`animate` |  | [Area.propTypes.animate](https://github.com/ihmeuw/ihme-ui/blob/react-move/src/ui/shape/src/area.jsx#L137) |  | Details below in [The animate prop](#animate) section.   
`className` |  | [CommonPropTypes.className](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) |  | className applied to path.
`clipPathId` |  | string |  | if a clip path is applied to a container element (e.g., an `<AxisChart />`),<br />clip this path to that container by passing in the clip path URL id.
`data` | true | array of object |  | Array of datum objects.
`dataAccessors` | true | object | { x: 'x', y0: 'y0', y1: 'y1' } | Accessors to pull appropriate values off of datum objects.<br />`dataAccessors` is an object that should have three properties: `x`, `y0`, and `y1`.<br />Each accessor can either be a string or function. If a string, it is assumed to be the name of a<br />property on datum objects; full paths to nested properties are supported (e.g., { `x`: 'values.year', ... }).<br />If a function, it is passed datum objects as its first and only argument.
`onClick` |  | func | CommonDefaultProps.noop | onClick callback.<br />signature: (SyntheticEvent, data, instance) => {...}
`onMouseLeave` |  | func | CommonDefaultProps.noop | onMouseLeave callback.<br />signature: (SyntheticEvent, data, instance) => {...}
`onMouseMove` |  | func | CommonDefaultProps.noop | onMouseMove callback.<br />signature: (SyntheticEvent, data, instance) => {...}
`onMouseOver` |  | func | CommonDefaultProps.noop | onMouseOver callback.<br />signature: (SyntheticEvent, data, instance) => {...}
`scales` | true | object |  | `x` and `y` scales.<br />Object with keys: `x`, and `y`.
`style` |  | [CommonPropTypes.style](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L16) | {<br />  fill: 'steelblue',<br />  stroke: 'steelblue',<br />  strokeWidth: 1,<br />} | inline styles applied to path

---

#### \<Line />
`import { Line } from 'ihme-ui'`


Property | Required | Type(s) | Defaults | Description
:---    |:---      |:---     |:---      |:---       
`animate` |  | [Line.propTypes.animate](https://github.com/ihmeuw/ihme-ui/blob/react-move/src/ui/shape/src/line.jsx#L138) |  | Details below in [The animate prop](#animate) section.
`className` |  | [CommonPropTypes.className](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) |  | className applied to path.
`clipPathId` |  | string |  | if a clip path is applied to a container element (e.g., an `<AxisChart />`),<br />clip this path to that container by passing in the clip path URL id.
`data` | true | array of object |  | Array of datum objects.
`dataAccessors` | true | object | { x: 'x', y: 'y' } | Accessors to pull appropriate values off of datum objects.<br />`dataAccessors` is an object that should have two properties: `x`, and `y`.<br />Each accessor can either be a string or function. If a string, it is assumed to be the name of a<br />property on datum objects; full paths to nested properties are supported (e.g., { `x`: 'values.year', ... }).<br />If a function, it is passed datum objects as its first and only argument.
`onClick` |  | func | CommonDefaultProps.noop | onClick callback.<br />signature: (SyntheticEvent, data, instance) => {...}
`onMouseLeave` |  | func | CommonDefaultProps.noop | onMouseLeave callback.<br />signature: (SyntheticEvent, data, instance) => {...}
`onMouseMove` |  | func | CommonDefaultProps.noop | onMouseMove callback.<br />signature: (SyntheticEvent, data, instance) => {...}
`onMouseOver` |  | func | CommonDefaultProps.noop | onMouseOver callback.<br />signature: (SyntheticEvent, data, instance) => {...}
`scales` | true | object |  | `x` and `y` scales.<br />Object with keys: `x`, and `y`.
`style` |  | [CommonPropTypes.style](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L16) | {<br />  stroke: 'steelblue',<br />  strokeWidth: 1,<br />} | inline styles applied to path

---

#### \<MultiLine />
`import { MultiLine } from 'ihme-ui'`

This is a convenience component intended to make it easier to render many `<Line />`s
on a single chart. It additionally supports rendering `<Area />`s when the proper `dataAccessors`
are provided, which can be helpful, for example, for showing uncertainty around an estimate represented
by a line.


Property | Required | Type(s) | Defaults | Description
:---    |:---      |:---     |:---      |:---     
`animate` |  | [MultiLine.propTypes.animate](https://github.com/ihmeuw/ihme-ui/blob/react-move/src/ui/shape/src/multi-line.jsx#L122) |  | Details below in [The animate prop](#animate) section.
`areaClassName` |  | [CommonPropTypes.className](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) |  | classname applied to `<Area/>`s that are children of MultiLine, if applicable
`areaStyle` |  | [CommonPropTypes.style](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L16) |  | inline styles applied to `<Area />`s, if applicable
`areaValuesIteratee` |  | func | CommonDefaultProps.identity | Applied to the data to transform area values. default: _.identity<br />signature: (data, key) => {...}
`className` |  | [CommonPropTypes.className](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) |  | className applied to outermost wrapping `<g>`
`clipPathId` |  | string |  | If a clip path is applied to a container element (e.g., an `<AxisChart />`),<br />clip all children of `<MultiLine />` to that container by passing in the clip path URL id.
`colorScale` |  | func | function() { return 'steelblue'; } | Function that accepts keyfield and returns stroke color for line.<br />signature: (key) => str
`data` |  | array of object |  | Array of objects, e.g. [ {location: 'USA',values: []}, {location: 'Canada', values: []} ].
`dataAccessors` | true | object, object, object |  | Keys on datum objects containing values to scale to chart<br />  x: accessor for xscale<br />  y: accessor for yscale (when applicable, e.g. <Line />)<br />  y0: accessor for yscale (when applicable; e.g., lower bound)<br />  y1: accessor for yscale (when applicable; e.g., upper bound)<br />To render `<Line />`s, include just x, y.<br />To render `<Area />`s, include just x, y0, y1.<br />To render `<Line />`s and `<Area />`s, include all four properties.<br />Each accessor can either be a string or function. If a string, it is assumed to be the name of a<br />property on datum objects; full paths to nested properties are supported (e.g., { `x`: 'values.year', ... }).<br />If a function, it is passed datum objects as its first and only argument.
`fieldAccessors` |  | object | {<br />  data: 'values',<br />  key: 'key',<br />} | Accessors for objects within `props.data`<br /> color: (optional) color data as input to color scale.<br /> data: data provided to child components. default: 'values'<br /> key: unique key to apply to child components. used as input to color scale if color field is not specified. default: 'key'<br /> For example:<br /> IF (`props.data` === [ {location: 'USA',values: [{...}, {...}]}, {location: 'Canada', values: [{...}, {...}]} ])<br /> THEN `fieldAccessors` === { data: 'values', key: 'location' }
`lineClassName` |  | [CommonPropTypes.className](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) |  | classname applied to `<Line />`s, if applicable
`lineStyle` |  | [CommonPropTypes.style](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L16) |  | inline styles applied to `<Line />`s, if applicable
`lineValuesIteratee` |  | func | CommonDefaultProps.identity | function to apply to the data to transform area values. default: _.identity<br />signature: (data, key) => {...}
`onClick` |  | func |  | onClick callback.<br />signature: (SyntheticEvent, data, instance) => {...}
`onMouseLeave` |  | func |  | onMouseLeave callback.<br />signature: (SyntheticEvent, data, instance) => {...}
`onMouseMove` |  | func |  | onMouseMove callback.<br />signature: (SyntheticEvent, data, instance) => {...}
`onMouseOver` |  | func |  | onMouseOver callback.<br />signature: (SyntheticEvent, data, instance) => {...}
`scales` | true | object | { x: scaleLinear(), y: scaleLinear() } | `x` and `y` scales.<br />Object with keys: `x`, and `y`.
`style` |  | [CommonPropTypes.style](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L16) |  | inline style applied to outermost wrapping `<g>`

---

#### \<Scatter />
`import { Scatter } from 'ihme-ui'`


Property | Required | Type(s) | Defaults | Description
:---    |:---      |:---     |:---      |:---       
`animate` |  | [Scatter.propTypes.animate](https://github.com/ihmeuw/ihme-ui/blob/react-move/src/ui/shape/src/scatter.jsx#L202) |  | Details below in [The animate prop](#animate) section.
`className` |  | [CommonPropTypes.className](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) |  | className applied to outermost wrapping `<g>`.
`clipPathId` |  | string |  | If a clip path is applied to a container element (e.g., an `<AxisChart />`),<br />clip all children of `<Scatter />` to that container by passing in the clip path URL id.
`colorScale` |  | func |  | If provided will determine color of rendered `<Shape />`s
`data` | true | array of object |  | Array of datum objects
`dataAccessors` | true | object |  | Accessors on datum objects<br />  fill: property on datum to provide fill (will be passed to `props.colorScale`)<br />  key: unique dimension of datum (required)<br />  shape: property on datum used to determine which type of shape to render (will be passed to `props.shapeScale`)<br />  x: property on datum to position scatter shapes in x-direction<br />  y: property on datum to position scatter shapes in y-direction<br />Each accessor can either be a string or function. If a string, it is assumed to be the name of a<br />property on datum objects; full paths to nested properties are supported (e.g., { `x`: 'values.year', ... }).<br />If a function, it is passed datum objects as its first and only argument.
`fill` |  | string | 'steelblue' | If `props.colorScale` is undefined, each `<Shape />` will be given this same fill value.
`focus` |  | object |  | The datum object corresponding to the `<Shape />` currently focused.
`focusedClassName` |  | [CommonPropTypes.className](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) |  | className applied if `<Shape />` has focus.
`focusedStyle` |  | [CommonPropTypes.style](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L16) |  | inline styles applied to focused `<Shape />`<br />If an object, spread into inline styles.<br />If a function, passed underlying datum corresponding to its `<Shape />`,<br />and return value is spread into inline styles;<br />signature: (datum) => obj
`onClick` |  | func | CommonDefaultProps.noop | onClick callback.<br />signature: (SyntheticEvent, datum, instance) => {...}
`onMouseLeave` |  | func | CommonDefaultProps.noop | onMouseLeave callback.<br />signature: (SyntheticEvent, datum, instance) => {...}
`onMouseMove` |  | func | CommonDefaultProps.noop | onMouseMove callback.<br />signature: (SyntheticEvent, datum, instance) => {...}
`onMouseOver` |  | func | CommonDefaultProps.noop | onMouseOver callback.<br />signature: (SyntheticEvent, datum, instance) => {...}
`scales` |  | object | { x: scaleLinear(), y: scaleLinear() } | `x` and `y` scales for positioning `<Shape />`s.<br />Object with keys: `x`, and `y`.
`selectedClassName` |  | [CommonPropTypes.className](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) |  | className applied to `<Shape />`s if selected
`selection` |  | array |  | Array of datum objects corresponding to selected `<Shape />`s
`size` |  | number | 64 | Size of `<Shape />`s; area in square pixels.<br />If not provided, `<Shape />` provides a default of 64 (8px x 8px).
`style` |  | [CommonPropTypes.style](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L16) |  | Inline styles applied to wrapping element (`<g>`) of scatter shapes
`shapeClassName` |  | [CommonPropTypes.className](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) |  | className applied to each `<Shape />`
`shapeScale` |  | func |  | If provided, used in conjunction with `dataAccessors.shape` (or `dataAccessors.key` if not provided)<br />to determine type of shape to render
`shapeStyle` |  | CommonDefaultProps.style |  | Inline styles passed to each `<Shape />`
`shapeType` |  | string | 'circle' | Type of shape to render; use in lieu of `props.shapeScale`<br />if you want all `<Shape />` to be of the same type.

---

#### \<Shape />
`import { Shape } from 'ihme-ui'`


Property | Required | Type(s) | Defaults | Description
:---    |:---      |:---     |:---      |:---      
`className` |  | [CommonPropTypes.className](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) |  | Class name applied to path.
`clipPathId` |  | string |  | If a clip path is applied to a container element (e.g., an `<AxisChart />`),<br />clip this path to that container by passing in the clip path URL id.
`datum` |  | object |  | Datum object corresponding to this shape ("bound" data, in the language in D3)
`fill` |  | string | 'steelblue' | Fill color for path.
`focused` |  | bool | false | Whether shape has focus.
`focusedClassName` |  | [CommonPropTypes.className](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) | 'focused' | Class name applied if shape has focus.
`focusedStyle` |  | [CommonPropTypes.style](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L16) | {<br />  stroke: '#AAF',<br />  strokeWidth: 1,<br />} | Inline styles applied if shape has focus.<br />If an object, spread directly into inline styles.<br />If a function, called with `props.datum` as argument and return value is spread into inline styles;<br />signature: (datum) => obj
`onClick` |  | func | CommonDefaultProps.noop | onClick callback.<br />signature: (SyntheticEvent, datum, instance) => {...}
`onMouseLeave` |  | func | CommonDefaultProps.noop | onMouseLeave callback.<br />signature: (SyntheticEvent, datum, instance) => {...}
`onMouseMove` |  | func | CommonDefaultProps.noop | onMouseMove callback.<br />signature: (SyntheticEvent, datum, instance) => {...}
`onMouseOver` |  | func | CommonDefaultProps.noop | onMouseOver callback.<br />signature: (SyntheticEvent, datum, instance) => {...}
`selected` |  | bool | false | Whether shape is selected.
`selectedClassName` |  | [CommonPropTypes.className](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) | 'selected' | Class name applied if selected.
`selectedStyle` |  | [CommonPropTypes.style](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L16) | {<br />  stroke: '#000',<br />  strokeWidth: 1,<br />} | Inline styles applied to selected `<Shape />`s.<br />If an object, spread into inline styles.<br />If a function, passed underlying datum corresponding to its `<Shape />`<br />and return value spread into line styles;<br />signature: (datum) => obj
`size` |  | number | 64 | Area in square pixels.
`style` |  | [CommonPropTypes.style](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L16) | {} | Base inline styles applied to `<Shape />`s.<br />If an object, spread into inline styles.<br />If a function, passed underlying datum corresponding to its `<Shape />`.
`shapeType` |  | one of: shapeTypes() | 'circle' | Type of shape to render, driven by d3-shape.<br />One of: 'circle', 'cross', 'diamond', 'square', 'star', 'triangle', 'wye'
`translateX` |  | number | 0 | Move shape away from origin in x direction.
`translateY` |  | number | 0 | Move shape away from origin in y direction.

---

## <a id="animate">The `animate` prop</a>
If a component is animatable, it uses the `animate` prop for its animation settings.
The `animate` prop can be a `bool` or an `object`. It has no default setting, meaning it 
*does not animate* without being given an `animate` prop.

Property | Required | Type(s) | Defaults | Description
:---    |:---      |:---     |:---      |:---       
`animate` |  | [bool](#animate-bool) or [object](#animate-object) |  | details below

---

### <a id="animate-bool">Using type `bool` for the `animate` prop</a>
When the `animate` prop evaluates to `false`, *or the `animate` prop is omitted*, no animation will occur.

When the `animate` prop evaluates to `true`, the [animatable attributes](#animatable-attributes) of
the component will animate with the default settings of the underlying animation library,
[React Move](https://github.com/react-tools/react-move#timing).

Here's a quick example of using a bool `animate` prop on an `<Line/>` component for default animation 
options of its [animatable attributes](https://github.com/ihmeuw/ihme-ui/blob/react-move/src/ui/shape/src/line.jsx#L228):
```
<Line
  animate
  {...otherLineProps}
/>
``` 
---

### <a id="animate-object">Using type `object` for the `animate` prop</a>
Animations can be finely tuned by passing an `object` in the `animate` prop.

Property | Required | Type(s) | Defaults | Description
:---    |:---      |:---     |:---      |:-------       
`events` |  | [AnimateEvents](https://github.com/ihmeuw/ihme-ui/blob/react-move/src/utils/props.js#L43) |  | Object containing functions to execute on animation events `start`, `interrupt`, and `end`. If left undefined, no functions will be executed on any animation `events`. More information on animation events in [React Move library's "Events" section](https://react-move.js.org/#/documentation/node-group). 
`timing` |  | [AnimateTiming](https://github.com/ihmeuw/ihme-ui/blob/react-move/src/utils/props.js#L53) |  | Root `timing` options for [all animatable attributes of the component](#animatable-attributes). If left undefined, [React Move's default "Timing" ](https://github.com/react-tools/react-move#timing) is used.
`[animatable_attribute]` |  | [AnimateProp](https://github.com/ihmeuw/ihme-ui/blob/react-move/src/utils/props.js#L86) |  | Object of instructions for a specific animatable property to override root/default animation settings. [More details in the next section](#animatable-attributes).

---

### <a id="animatable-attributes">Animatable attributes</a>
Each component that takes the `animate` prop has attributes that are animatable. 
Click through to see the list for each component.

Component | Animatable attributes list | Type
:---    |:---      |:---
Area | [Area.animatable](https://github.com/ihmeuw/ihme-ui/blob/react-move/src/ui/shape/src/area.jsx#L230) | [AnimateProp](https://github.com/ihmeuw/ihme-ui/blob/react-move/src/utils/props.js#L86)
Line | [Line.animatable](https://github.com/ihmeuw/ihme-ui/blob/react-move/src/ui/shape/src/line.jsx#L228) | [AnimateProp](https://github.com/ihmeuw/ihme-ui/blob/react-move/src/utils/props.js#L86)
MultiLine | [MultiLine.animatable](https://github.com/ihmeuw/ihme-ui/blob/react-move/src/ui/shape/src/multi-line.jsx#L287) | [AnimateProp](https://github.com/ihmeuw/ihme-ui/blob/react-move/src/utils/props.js#L86)
Scatter | [Scatter.animatable](https://github.com/ihmeuw/ihme-ui/blob/react-move/src/ui/shape/src/scatter.jsx#L191) | [AnimateProp](https://github.com/ihmeuw/ihme-ui/blob/react-move/src/utils/props.js#L86)
MultiScatter  | [MultiScatter.animatable](https://github.com/ihmeuw/ihme-ui/blob/react-move/src/ui/shape/src/multi-scatter.jsx#L316) | [AnimateProp](https://github.com/ihmeuw/ihme-ui/blob/react-move/src/utils/props.js#L86)

Any of the animatable attributes of a component can be a 
[property](https://github.com/ihmeuw/ihme-ui/blob/react-move/src/utils/props.js#L86) in the `animate` prop. 
The default/root `timing`, `events` properties can be overridden as well as the behavior during 
each phase of the animation lifecycle (`start`, `enter`, `update`, `leave`).

As an example, the `<Scatter/>` `animate` prop can apply custom animation settings to the `fill` 
attribute during the `update` phase of the animation lifecycle:
```
<Scatter
  animate={{
    fill: {
      timing: { duration: 333 },    // `timing` for `fill` animations besides what `update` overrides. `duration` in miliseconds.
      update: () => ({
        timing: { duration: 3000 }, // `duration` in miliseconds
        fill: ['purple'],           // String value to update to (animation values must be wrapped in an array).          
      }),
    }
  }}
  {...otherScatterProps}
/>
``` 
Note: Animation values must be wrapped in an array. This is an artifact of using `React Move` in 
the IHME-UI animation implementation. 
More can be read in their ["Transitions" section](https://github.com/react-tools/react-move#transitions). 
If it is desired for an animatable attribute *not* to animate, this can be achieved by simply *not* 
wrapping the value in an array.

---

### Arguments of the animation methods
It is often necessary to know what data is to be represented during animation in order to affect it 
accordingly. The signature has been detailed in the @callback type 
[AnimateMethodCallback](https://github.com/ihmeuw/ihme-ui/blob/react-move/src/utils/props.js#L296). 

Here's is an example of utilizing the arguments in an animation method:
```
function updateFill(computedFillValue, inputDatum, index) {
  // Use raw input data.
  const isSpecial = inputDatum.someSpecificProperty;
  
  // Use index of datum in data array.
  const isOdd = index % 2 !== 0;

  // Use default computed value of component for custom animation logic.
  const newFillValue = isSpecial && isOdd ? 'red' : computedFillValue;
  const newDelay = isSpecial ? 3000 : 333;
  
  // Custom animation event handling.
  const veryCustomEvents = {
    interrupt: () => {
      console.log('The <Scatter /> `fill` prop has been interrupted in the middle of its "update" phase animation!');
    }
  }
  
  return {
    fill: [newFillValue],         // remember to wrap the value in an array if it is to animate.
    timing: { delay: newDelay },
    events: veryCustomEvents,
  };
}

// Where the <Scatter/> is rendered, utilize the custom animation function:
renderScatter() {
  return (
    <Scatter 
      animate={{
        fill: { update: updateFill },
      }}
      {...otherScatterProps}
    />
  );
}
```
