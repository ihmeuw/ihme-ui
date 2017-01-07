![travis badge](https://travis-ci.org/ihmeuw/ihme-ui.svg) [![codecov.io](https://codecov.io/github/ihmeuw/ihme-ui/coverage.svg?branch=master)](https://codecov.io/github/ihmeuw/ihme-ui?branch=master)

# [IHME-UI](https://github.com/ihmeuw/ihme-ui)

ihme-ui is a collection of JavaScript and React-based visualization tools and user interface elements developed by the [Institute of Health Metrics and Evaluation](http://healthdata.org). These elements are used in IHME's [visualizations of global health metrics](http://www.healthdata.org/results/data-visualizations).

* [Installation](#installation)
* [API Reference](#api)
  * [\<Axis /\>](#axis-)
    * [\<XAxis /\>](#xaxis-)
    * [\<YAxis /\>](#yaxis-)
  * [\<AxisChart /\>](#axischart-)
  * [\<Button /\>](#button-)
  * [\<Choropleth /\>](#choropleth-)
  * [\<ChoroplethLegend /\>](#choroplethlegend-)
  * [\<ExpansionContainer /\>](#expansioncontainer-)
  * [\<Group /\>](#group-)
    * [\<Option /\>](#option-)
  * [\<HtmlLabel /\>](#htmllabel-)
  * [\<MultiSelect /\> and \<SingleSelect /\>](#multiselect--and-singleselect-)
  * [\<ResponsiveContainer /\>](#responsivecontainer-)
  * [\<Shape /\>](#shape-)
    * [\<Area /\>](#area-)
    * [\<Line /\>](#line-)
    * [\<MultiLine /\>](#multiline-)
    * [\<Scatter /\>](#scatter-)
    * [\<Symbol /\>](#symbol-)
  * [\<Slider /\>](#slider-)
  * [\<Spinner /\>](#spinner-)
  * [\<SvgText /\>](#svgtext-)
* [Test Utilities](#test-utilities)
  * [Data Generator](#data-generator)
* [Code Quality](#code-quality)

###### WORK IN PROGRESS: Not stable until v1.0.0

---

## Installation

To install ihme-ui tools and all dependencies:

```sh
npm install -S ihme-ui
```
To install demo files:

```sh
npm run demo
```

## API

### General notes
#### className

All className props are run through the [classnames](https://github.com/JedWatson/classnames) library, so can be a string, an object, or an array.

#### style

All style props can take an object. In some cases, the style prop can take a function that will compute and return a style object based on some criteria listed in the description.

---

### \<Axis /\>
`import Axis from 'ihme-ui/ui/axis'`

Chart axis

Property | Required | Type(s) | Defaults | Description
        --- | :---: | :---: | :---: | ---
`axisClassName` | no | [className](#className) | | className applied to group element directly containing axis
`axisStyle` | no | object | | inline styles applied to group element directly containing axis
`className` | no | [className](#className) | | className applied to outermost group element
`height` | yes, unless translate provided | number | 0 | height of charting area, minus padding
`label` | no | string | | the axis label
`labelClassName` | no | [className](#className) | | className applied to text element surrounding axis label
`labelStyle` | no | object | | inline applied to text element surrounding axis label
`orientation` | yes | string | | where to position axis line; will position ticks accordingly;<br />one of: "top", "right", "bottom", "left"
`padding` | no | object | { top: 40, bottom: 40, left: 50, right: 50 } | used to position label 
`scale` | yes | function | d3.scaleLinear() | appropriate scale for object
`style` | no | object | | inline styles to apply to outermost group element
`ticks` | no | number | | [number of axis ticks use](https://github.com/d3/d3-axis#axis_ticks)
`tickArguments` | no | array | | [alternative to tickValues and/or tickFormat](https://github.com/d3/d3-axis#axis_tickArguments)
`tickFormat` | no | function | | [format of axis ticks](https://github.com/d3/d3-axis#axis_tickFormat)
`tickPadding` | no | number | | [padding of axis ticks](https://github.com/d3/d3-axis#axis_tickPadding)
`tickSize` | no | number | | [size of both inner and outer tick lines](https://github.com/d3/d3-axis#axis_tickSize)
`tickSizeInner` | no | number | | [size of inner tick lines](https://github.com/d3/d3-axis#axis_tickSizeInner)
`tickSizeOuter` | no | number | | [size of outer tick lines](https://github.com/d3/d3-axis#axis_tickSizeOuter)
`tickValues` | no | object | | [user-specified tick values](https://github.com/d3/d3-axis#axis_tickValues)
`translate` | yes, unless width and height provided | object | | push axis in x or y direction
`width` | yes, unless translate provided | number | 0 | width of charting area, minus padding

#### \<XAxis />
`import { XAxis } from 'ihme-ui/ui/axis'`

Chart x-axis that extends \<Axis /> and provides some useful defaults

Property | Required | Type(s) | Defaults | Description
        --- | :---: | :---: | :---: | ---
`orientation` | no | string | "bottom" | where to position axis line; will position ticks accordingly;<br />one of: "top", "bottom"
`padding` | no | object | { top: 40, bottom: 40 } | used to position label 
`scales` | yes | object | { x: d3.scaleLinear() } | appropriate scale for object

#### \<YAxis />
`import { YAxis } from 'ihme-ui/ui/axis'`

Chart y-axis that extends \<Axis /> and provides some useful defaults

Property | Required | Type(s) | Defaults | Description
        --- | :---: | :---: | :---: | ---
`orientation` | no | string | "left" | where to position axis line; will position ticks accordingly;<br />one of: "right", "left"
`padding` | no | object | { left: 50, right: 50 } | used to position label 
`scales` | yes | object | { y: d3.scaleLinear() } | appropriate scale for object

### \<AxisChart /\>
`import AxisChart from 'ihme-ui/ui/axis-chart'`

Wraps and provides its child charting components width, height, scales, and padding

Property | Required | Type(s) | Defaults | Description
        --- | :---: | :---: | :---: | ---
`className` | no | [className](#className) | | className applied to outermost svg element
`height` | yes | number | | pixel height of line chart
`loading` | no | bool | | flag to delay rendering while fetching data
`padding`| no | object | { top: 20, bottom: 30, left: 50, right: 20 } | padding around the chart contents
`style` | no | object | | inline styles to apply to outermost svg element
`width` | yes | number | | pixel width of line chart
`xDomain` | no | array | | [min, max] for xScale (i.e., the domain of the data)
`xScaleType`| yes | string | | type of x scale<br />[name of d3 scale scale function](https://github.com/d3/d3-scale) 
`yDomain` | no | array | | [min, max] yScale (i.e., the range of the data)
`yScaleType` | yes | string | | type of y scale<br />[name of d3 scale scale function](https://github.com/d3/d3-scale)

### \<Button /\>
`import Button from 'ihme-ui/ui/button'`

Button with customizable id, name, class name, icon, animation, and click handler.

Property | Required | Type(s) | Defaults | Description
        --- | :---: | :---: | :---: | ---
`className` | no | [className](#className) | | className applied to button
`disabled` | no | boolean | | boolean value to set button as disabled
`disabledClassName` | no | [className](#className) | | className applied to button when disabled
`disabledStyle` | no | object | | inline styles to apply to outermost svg element when disabled
`icon` | no | string | | path to image to render within button tag
`id` | no | string | | id value for button
`name` | no | string | | name of button
`onClick` | no | function | | function to be executed on an onClick event
`showSpinner` | no | boolean | | boolean value to display a loading spinner
`style` | no | object | | inline styles to apply to outermost svg element
`text` | no | string | | text to render within button tag
`theme` | no | string | | color scheme of component (see button.css)

### \<Choropleth /\>
`import Choropleth from 'ihme-ui/ui/choropleth'`

Interactive map component

Property | Required | Type(s) | Defaults | Description
        --- | :---: | :---: | :---: | ---
`className` | no | [className](#className) | | className applied to outermost div
`colorScale` | yes | func | | function that accepts value of `keyfield` (str), and returns (str) stroke color for line
`controls` | no | bool |  | show zoom controls 
`controlsClassName` | no | [className](#className) | | className applied to controls container div 
`controlsButtonClassName` | no | [className](#className) | | className applied to controls buttons 
`controlsButtonStyle` | no | object | | inline styles to apply to controls buttons 
`controlsStyle` | no | object | | inline styles to apply to outermost div 
`data` | yes | array |  | array of datum objects 
`geometryKeyField` | yes | string, func | | uniquely identifying field of geometry objects; if a function, will be called with the geometry object as first parameter 
`height` | no | number | 400 | pixel height of containing element
`keyField` | yes | string, func |  | unique key of datum; if a function, will be called with the datum object as first parameter
`layers` | yes | array | | see [layers detail](#layers-detail)
`maxZoom` | no | number | | max allowable zoom factor; 1 === fit bounds 
`minZoom` | no | number | | min allowable zoom factor; 1 === fit bounds 
`onClick` | no | func | | passed to each path;<br />signature: (event, datum, Path) => {...}
`onMouseLeave` | no | func | | passed to each path;<br />signature: (event, datum, Path) => {...}
`onMouseMove` | no | func | | passed to each path;<br />signature: (event, datum, Path) => {...}
`onMouseOver` | no | func | | passed to each path;<br />signature: (event, datum, Path) => {...}
`selectedLocations` | no | array | | array of selected location objects
`style` | no | object | | inline styles applied outermost div
`topology` | yes | object | | full topojson object<br />for information, see [topojson wiki](https://github.com/topojson/topojson/wiki)
`valueField` | yes | string, func |  | key of datum that holds the value to display<br />function: (data, feature) => value
`width` | no | number | 600 | pixel width of containing element
`zoomStep` | no | number | 1.1 | amount to zoom in/out from zoom controls. current zoom scale is multiplied by prop value.<br />e.g. 1.1 is equal to 10% steps, 2.0 is equal to 100% steps

##### Layers detail 

Property | Required | Type(s) | Defaults | Description
        --- | :---: | :---: | :---: | ---
`className` | no | [className](#className) | | className applied to layer
`filterFn` | no | func | | optional function to filter mesh grid, passed adjacent geometries<br />refer to [https://github.com/mbostock/topojson/wiki/API-Reference#mesh](https://github.com/mbostock/topojson/wiki/API-Reference#mesh)
`name` | yes | string | | along with layer.type, will be part of the `key` of the layer; therefore, `${layer.type}-${layer.name}` needs to be unique
`object` | yes | string | | name corresponding to key within topojson objects collection
`selectedClassName` | no | [className](#className) | | className applied to selected paths
`selectedStyle` | no | [style](#style) | | inline styles applied to selected paths<br />func: (feature) => style object
`style` | no | [style](#style) | | inline styles applied to layer<br />func: (feature) => style object
`type` | yes | string | | whether the layer should be a feature collection or mesh grid<br />one of: "feature", "mesh"
`visible` | no | bool | | whether or not to render layer

### \<ChoroplethLegend /\>
`import ChoroplethLegend from 'ihme-ui/ui/choropleth-legend'`

Density plot with range sliders and axis

Property | Required | Type(s) | Defaults | Description
        --- | :---: | :---: | :---: | ---
`axisTickFormat` | no | function | [numberFormat](https://github.com/ihmeuw/ihme-ui/blob/docs/src/utils/numbers.js#L9) | [format of axis ticks](https://github.com/d3/d3-axis#axis_tickFormat)
`axisTranslate` | no | object | { x: 0, y: 20 } | shift axis in the x or y directions; use to put padding between the color gradient rect and the axis
`colorScale` | yes | function | | color scale for density plot; should accept `datum[valueField]` and return color string
`colorSteps` | yes | array | | array of color steps, e.g. ['#fff', '#ccc', '\#000', ...]
`data` | yes | array | | array of datum objects
`domain` | yes | array | | [min, max] for xScale; xScale positions density plot and provides axis
`height` | no | number | | height of outermost svg
`keyField` | no | string or function | | uniquely identifying property of datum or function that accepts datum and returns unique value; if not provided, density plot symbols are keyed as `${xValue}:${yValue}:${index}`
`margins` | no | object | { top: 50, right: 100, bottom: 50, left: 100 } | margins to subtract from width and height
`onClick` | no | function | noop | onClick callback for density plot circles; <br /> signature: function(event, data, instance) {...}
`onMouseLeave` | no | function | noop | onMouseLeave callback for density plot circles; <br /> signature: function(event, data, instance) {...}
`onMouseMove` | no | function | noop | onMouseMove callback for density plot circles; <br /> signature: function(event, data, instance) {...}
`onMouseOver` | no | function | noop | onMouseOver callback for density plot circles; <br /> signature: function(event, data, instance) {...}
`onSliderMove` | no | function | noop | callback function to attach to slider handles; passed [min, max] (Array), the range extent as a percentage
`rangeExtent` | yes | array | | array of [min, max] for slider in data space; `domain` is a good initial value
`selectedLocations` | no | array | | array of selected datum objects
`sliderHandleFormat` | no | function | [numberFormat](https://github.com/ihmeuw/ihme-ui/blob/docs/src/utils/numbers.js#L9) | format of slider handle labels
`unit` | no | string | | unit of data; axis label
`valueField` | yes | string or function | | property of data objects used to position and fill density plot circles; if a function, passed datum object
`width` | no | number | | width of outermost svg, in pixels
`x1` | no | number | 0 | x-axis coord (as percentage) of the start of the gradient (e.g., 0)
`x2` | no | number | 100 | x-axis coord (as percentage) of the end of the gradient (e.g., 100)
`xScale` | no | function | d3.scaleLinear() | scale for positioning density plot along its x-axis; must expose `domain` and `range` methods
`zoom` | no | number | 1 | float value used for implementing "zooming"; any element that needs to become larger in "presentation mode" should respond to this scale factor.<br /><br />Guide: <br />zoom: 0 -> smallest possible<br />zoom: 0.5 -> half of normal size<br />zoom: 1 -> normal<br />zoom: 2 -> twice normal size

### \<ExpansionContainer /\>
`import ExpansionContainer from 'ihme-ui/ui/expansion-container'`

Drop-in replacement for any grouping element (e.g., div) that provides functionality for expanding `<Expandable />` components to `<ExpansionContainer />`'s full height and width.

Property | Required | Type(s) | Defaults | Description
        --- | :---: | :---: | :---: | ---
`className` | no | [className](#className) | | className applied to outermost wrapping div
`style` | no | object | | inline styles applied to outermost wrapping div; `position: relative` is added automatically
`group` | no | string | "default" |  key used by `<Expandable />`s to register with `<ExpansionContainer />`; if more than one `<ExpansionContainer />` is mounted, `group` should be treated as required and unique per instance.

### \<Group /\>

Button set with `selectable` property and customizable class names and interaction handlers.

Property | Required | Type(s) | Description
        --- | :---: | :---: | ---
`children` | yes | object |  React element or elements<br /><br />one of type: arrayOf(PropTypes.node), node
`className` | no | string, object | one of type: string, object, array
`onClick` | yes | function | click handler with following signature: function(event, selectedValue)
`style` | no | object | inline-styles to be applied to group wrapper

#### \<Option /\>

Options for the group element, wrapped by group. Any additional props will be passed directly to the fundamental element this renders.

Property | Required | Type(s) | Description
        --- | :---: | :---: | ---
`className` | no | string, object | one of type: string, object, array
`disabled` | no | boolean | whether option is disabled
`disabledClassName` | no | string, array, object | className to apply when disabled
`disabledStyle` | no | object | inline-style to apply when disabled
`icon` | no | string | path to image to render within label tag
`selected` | no | boolean | whether option is selected
`selectedClassName` | no | string, array, object | className to apply when selected
`selectedStyle` | no | object | inline-style to apply when selected
`text` | no | string | text to render within label tag
`type` | no | string, number, object | react element to be wrapped by this option (default: Button)

### \<HtmlLabel /\>

HTML element label with customizable class name, icon, text, appearance, and interaction handlers.

Property | Required | Type(s) | Description
        --- | :---: | :---: | ---
`children` | no | object |  React element or elements<br /><br />one of type: arrayOf(PropTypes.node), node
`className` | no | string, object | one of type: string, object, array
`clickHandler` | no | object | function with following signature: function({ value })
`hoverHandler` | no | object | function with following signature: function({ value })
`htmlFor` | no | string | ID of a labelable form-related element
`icon` | no |string | path to image to render within label tag
`text` | no | string | text to render within label tag
`theme` | no | string | color scheme of component; see html-label.css

### \<MultiSelect /\> and \<SingleSelect /\>

Select boxes built on top of [IHME-React-Select](https://github.com/ihmeuw/ihme-react-select). At minimum, the following props should be declared.

Property | Required | Type(s) | Description
        --- | :---: | :---: | ---
`labelKey` | yes | string | key on option objects holding label (e.g., `location_name`)
`valueKey` | yes | string | key on option objects holding value (e.g., `location_id`)
`onChange` | yes | func | function to be executed on change in value
`options` | yes | array | array of option objects
`value` | yes | array or object | list of options or single option currently selected
`hierarchical` | no | boolean | whether or not to display options hierarchically; if `true`, option objects need a `level` key

#### Example

```jsx
import { SingleSelect, MultiSelect } from 'ihme-ui/ui';

<SingleSelect
    labelKey="name"
    valueKey="name"
    onChange={ function (selection <Object>) {...} }
    options={ [{location_name: 'Albany', location_id: 1 }, ...] }
    value={{ location_name: 'Denver', location_id: 2 }}
/>

<MultiSelect
    labelKey="name"
    valueKey="name"
    onChange={ function (selections <Array>) {...} }
    options={ [{location_name: 'Albany', location_id: 1 }, ...] }
    value={[{ location_name: 'Denver', location_id: 2 }, ...]}
/>
```


### \<ResponsiveContainer /\>

Responsive HTML container with customizable resize callback function and responsiveness to height and width. A simple wrapper for [react-virtualized](https://github.com/bvaughn/react-virtualized).

Property | Required | Type(s) | Description
        --- | :---: | :---: | ---
`children` | yes | object | React element or elements<br /><br />one of type: arrayOf(PropTypes.node), node
`disableHeight` | no | boolean | boolean value to disable dynamic :height property
`disableWidth` | no | boolean | boolean value to disable dynamic :width property
`onResize` | no | object | Callback function to be invoked on resize ({height, width})

### \<Shape /\>

Selection of useful shapes and data displays, suitable for use within an ihme-ui chart.

#### \<Area /\>

Area element with customizable appearance, data, data accessors, and interaction handlers.

Property | Required | Type(s) | Description
        --- | :---: | :---: | ---
`clickHandler` | no | object | (default: noop)
`color` | no | string | (default: steelblue)
`data` | yes | object | array of objects, e.g. [ {}, {}, {} ]
`dataAccessors` | yes | object | (default: { x: 'x', y0: 'y0', y1: 'y1' })
`hoverHandler` | no | object | (default: noop)
`scales` | yes | object | [scales from d3Scale](https://github.com/d3/d3/wiki/Quantitative-Scales)
`strokeWidth` | no | string | (default: 2.5)

#### \<Line /\>

Line element with customizable appearance, data, data accessors, and interaction handlers.

Property | Required | Type(s) | Description
        --- | :---: | :---: | ---
`clickHandler` | no | object | (default: noop)
`data` | yes | object | array of objects e.g. [ {}, {}, {} ]
`dataAccessors` | yes | object | (default: { x: 'x', y: 'y' })
`fill` | no | string | (default: none)
`hoverHandler` | no | object | (default: noop)
`scales` |yes | object | [scales from d3Scale](https://github.com/d3/d3/wiki/Quantitative-Scales)
`stroke` | no | string | (default: steelblue)
`strokeWidth` | no | string | (default: 2.5)

#### \<MultiLine /\>

Multi-line element with customizable appearance, data, data accessors, and interaction handlers.

Property | Required | Type(s) | Description
        --- | :---: | :---: | ---
`clickHandler` | no | object |
`colorScale` | no | object | function that accepts keyfield, and returns stroke color for line
`data` | no | object | array of objects e.g. [ {location: 'USA',values: []}, {location: 'Canada', values: []}
`dataAccessors` | yes | object | key names containing x, y data<br />x -> accessor for xscale<br />y -> accessor for yscale (when there's one, e.g. <Line />)<br />y0 -> accessor for yscale (when there're two; e.g., lower bound)<br />y1 -> accessor for yscale (when there're two; e.g., upper bound)
`dataField` | no | string | key that holds values to be represented by individual lines
`hoverHandler` | no | object |
`keyField` | no | string | key that uniquely identifies dataset within array of datasets
`scales` | no | object | [scales from d3Scale](https://github.com/d3/d3/wiki/Quantitative-Scales)
`showLine` | no | boolean | whether or not to draw lines (e.g., mean estimate lines)
`showUncertainty` | no | boolean | whether or not to draw uncertainty areas for lines

#### \<Scatter /\>

Scatterplot element with customizable appearance, data, data accessors, and interaction handlers.

Property | Required | Type(s) | Description
        --- | :---: | :---: | ---
`onClick` | no | object | partially applied function that takes in datum and returns function
`color` | no | string | (default: steelblue)
`colorScale` | no | object | function that accepts keyfield, and returns color for each symbol, overrides color above
`data` | yes | object | array of objects e.g. [ {}, {}, {} ]
`dataAccessors` | yes | object | key names containing x, y data
`onHover` | no | object | partially applied function that takes in datum and returns function
`scales` | yes | object | [scales from d3Scale](https://github.com/d3/d3/wiki/Quantitative-Scales)
`size` | no | number |
`symbolType` | no | string | key name for value of symbol (default: circle)

#### \<MultiScatter /\>

Scatterplot element with customizable appearance, data, data accessors, and interaction handlers.

Property | Required | Type(s) | Description
        --- | :---: | :---: | ---
`colorScale` | no | object | function that accepts keyfield, and returns stroke color for line
`data` | no | object | array of objects e.g. [ {location: 'USA',values: []}, {location: 'Canada', values: []}
`dataAccessors` | yes | object | key names containing x, y data
`dataField` | no | string | key name for values representing individual lines
`keyField` | no | string | key name for topic of data
`onClick` | no | object | partially applied function that takes in datum and returns function
`onHover` | no | object | partially applied function that takes in datum and returns function
`scales` | yes | object | [scales from d3Scale](https://github.com/d3/d3/wiki/Quantitative-Scales)
`size` | no | number |
`symbolField` | no | string | key name for value of symbol
`symbolScale` | no | object | function to transform symbol value to a shape

#### \<Symbol /\>

Symbol element with customizable appearance, data, and interaction handlers.

Property | Required | Type(s) | Description
        --- | :---: | :---: | ---
`clickHandler` | no | object | partially applied fn that takes in datum and returns fn (default: noop)
`color` | no | string | (default:steelblue)
`data` | no | object | Datum for the click and hover handlers.
`hoverHandler` | no | object | partially applied fn that takes in datum and returns fn (default: noop)
`position` | no | object | (default: x: 0, y: 0)
`size` | no | number | area in square pixels (default: 64)
`strokeWidth` | no | number | (default: 1)
`type` | no | object | will match a [SYMBOL_TYPE](https://github.com/d3/d3/wiki/SVG-Shapes#symbol_type) (default: circle)<br /><br />one of: 'circle', 'square', 'triangle', 'cross', 'diamond', 'star', 'wye'

### \<Slider /\>

Single- or multi-input-value selector on a track with customizable appearance and interaction handlers.

Property | Required | Type(s) | Description
        --- | :---: | :---: | ---
`fill` | no | bool | boolean value to include fill in the track to indicate value (default: false)
`fillColor` | no | string | style for the fill color (default: '#ccc')
`height` | no | number | height of element in pixels (default: 24)
`labelFunc` | no | object | function applied to the selected value prior to rendering.<br /><br />Parameters: value - selected value<br />returns: 'string'<br />default: \_.identity
`onChange` | yes | object | callback function when value is changed.<br /><br />Parameters:<br />value: object with keys ['min'] and 'max'<br />key: key of most recent value change
`minValue` | yes | number | minimum slider value
`maxValue` | yes | number | maximum slider value
`step` | no | number | step between slider values (default: 1)
`value` | yes | number, object | initial selected value. If number, a single slider handle will be rendered. If object with keys 'min' and 'max', two slider handles will be rendered.<br /><br />one of type: number, array, shape
`width` | no | number | width of element in pixels (default: 200)

### \<Spinner /\>

Animated indicator (e.g., for loading) with customizable size.

Property | Required | Type(s) | Description
        --- | :---: | :---: | ---
`className` | no | string, object | one of type: string, object, array
`inline` | no | bool | display spinner inline with other elements (e.g., in a button)
`size` | no | string | one of: 'small', 'medium', 'large'

### \<SvgText /\>

SVG element label with customizable anchor, position, and value.

Property | Required | Type(s) | Description
        --- | :---: | :---: | ---
`anchor` | yes | string | one of: 'start', 'middle', 'end']
`dx` | no | number |
`dy` | no | number |
`fill` | no | string | (default: black)
`value` | no | string, number | one of type: string, number
`x` | yes | number |
`y` | no | number |

---

## Test Utilities

### Data Generator

Data Generator creates fake data for testing purposes.

#### API Description

Data Generator takes an object with four properties.

`primaryKeys` is an array of objects that have a `name` property that is a string, and a `values` property that is an array. The data generator will create unique composite keys based on the values arrays.

`valueKeys` is an array of objects that have a `name` property that is a string, a `range` property that is an array of two numbers, and an `uncertainty` property that is a boolean. Value keys are iterated so that their values are within the range specified. If `uncertainty` is true, data generator will produce additional keys of the form `(name)_ub` and `(name)_lb` to represent upper and lower bound uncertainties.

`year` is a number that represents a starting year for a series of years iterated by length. The output key is `year_id`.

`length` is a number for which each unique composite key gets a new value key. If there are many composite keys, each key receives `length` number of data points.
```javascript
const config = {
  primaryKeys: [
    {name: 'A', values: [1, 2]},
    {name: 'B', values: [1, 2, 3]}
  ],
  valueKeys: [
    {name: 'value', range: [100, 200], uncertainty: false}
  ],
  year: 2000,
  length: 2
}
//outputs
[
  {A: 1, B: 1, value: v_1, year_id: 2000},
  {A: 1, B: 1, value: v_2, year_id: 2001},
  {A: 1, B: 2, value: v_1, year_id: 2000},
  {A: 1, B: 2, value: v_2, year_id: 2001},
  {A: 1, B: 3, value: v_1, year_id: 2000},
  {A: 1, B: 3, value: v_2, year_id: 2001},
  {A: 2, B: 1, value: v_1, year_id: 2000},
  {A: 2, B: 1, value: v_2, year_id: 2001},
  {A: 2, B: 2, value: v_1, year_id: 2000},
  {A: 2, B: 2, value: v_2, year_id: 2001},
  {A: 2, B: 3, value: v_1, year_id: 2000},
  {A: 2, B: 3, value: v_2, year_id: 2001}
]
```

Data generator also outputs a unique `id` key for each row of data.

#### Example

```javascript
const config = {
  primaryKeys: [
    {name: 'key_1', values: ['v_11', 'v_21', ..., 'v_m1']},
    {name: 'key_2', values: ['v_12', 'v_22', ..., 'v_m2']},
    ...
    {name: 'key_n', values: ['v_1n', 'v_2n', ..., 'v_mn']}
  ],
  valueKeys: [
    {name: 'value_1', range: [lower_1, upper_1], uncertainty: true},
    {name: 'value_2', range: [lower_2, upper_2], uncertainty: false},
    ...
    {name: 'value_k', range: [lower_k, upper_k], uncertainty: false}
  ],
  year: 2000,
  length: 10
}
dataGenerator(config);
```

## Code Quality
- eslint enforces AirBnB rules: https://github.com/airbnb/javascript
