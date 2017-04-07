\<Choropleth />
=====================
`import { Choropleth } from 'ihme-ui'`


Property | Required | Type(s) | Defaults | Description
:---    |:---      |:---     |:---      |:---       
`className` |  | [CommonPropTypes.className](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) |  | className applied to outermost div
`colorScale` | true | func |  | accepts value of `keyfield` (str), returns stroke color for line (str)
`controls` |  | bool | false | show zoom controls
`controlsClassName` |  | [CommonPropTypes.className](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) |  | className applied to controls container div
`controlsButtonClassName` |  | [CommonPropTypes.className](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) |  | className applied to controls buttons
`controlsButtonStyle` |  | object |  | inline styles to apply to controls buttons
`controlsStyle` |  | object |  | inline styles to apply to outermost div
`data` | true | array of object |  | array of datum objects
`focus` |  | object |  | The datum object corresponding to the `<Path />` currently focused.
`focusedClassName` |  | [CommonPropTypes.className](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) |  | className applied if `<Path />` has focus.
`focusedStyle` |  | [CommonPropTypes.style](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L16) |  | inline styles applied to focused `<Path />`<br />If an object, spread into inline styles.<br />If a function, passed underlying datum corresponding to its `<Path />`,<br />and return value is spread into inline styles;<br />signature: (datum) => obj
`geometryKeyField` | true | string, func |  | uniquely identifying field of geometry objects;<br />if a function, will be called with the geometry object as first parameter<br />N.B.: the resolved value of this prop should match the resolved value of `props.keyField`<br />e.g., if data objects are of the following shape: { location_id: <number>, mean: <number> }<br />and if features within topojson are of the following shape: { type: <string>, properties: { location_id: <number> }, arcs: <array> }<br />`keyField` may be one of the following: 'location_id', or (datum) => datum.location_id<br />`geometryKeyField` may be one of the following: 'location_id' or (feature) => feature.properties.location_id
`height` |  | number | 400 | pixel height of containing element
`keyField` | true | string, func |  | unique key of datum;<br />if a function, will be called with the datum object as first parameter
`layers` | true | array of object | [] | layers of topojson to include<br />layer description: {Object}<br /> - `className`: className applied to layer<br /> - `filterFn`: optional function to filter mesh grid, passed adjacent geometries<br />     refer to [https://github.com/mbostock/topojson/wiki/API-Reference#mesh](https://github.com/mbostock/topojson/wiki/API-Reference#mesh)<br /> - `name`: (Required) along with layer.type, will be part of the `key` of the layer; therefore, `${layer.type}-${layer.name}` needs to be unique<br /> - `object`: (Required) name corresponding to key within topojson objects collection<br /> - `selectedClassName`: className applied to selected paths<br /> - `selectedStyle`: inline styles applied to selected paths<br />     func: (feature) => style object<br /> - `style`: inline styles applied to layer<br />     func: (feature) => style object<br /> - `type`: (Required) whether the layer should be a feature collection or mesh grid<br />     one of: "feature", "mesh"<br /> - `visible`: whether or not to render layer
`maxZoom` |  | number | Infinity | max allowable zoom factor; 1 === fit bounds
`minZoom` |  | number | 0 | min allowable zoom factor; 1 === fit bounds
`onClick` |  | func |  | passed to each path;<br />signature: (SyntheticEvent, datum, Path) => {...}
`onMouseLeave` |  | func |  | passed to each path;<br />signature: (SyntheticEvent, datum, Path) => {...}
`onMouseMove` |  | func |  | passed to each path;<br />signature: (SyntheticEvent, datum, Path) => {...}
`onMouseOver` |  | func |  | passed to each path;<br />signature: (SyntheticEvent, datum, Path) => {...}
`selectedLocations` |  | array of object | [] | array of selected location objects
`style` |  | object |  | inline styles applied outermost div
`topology` | true | object |  | full topojson object<br />for more information, see the [topojson wiki](https://github.com/topojson/topojson/wiki)
`valueField` | true | string, func |  | key of datum that holds the value to display (e.g., 'mean')<br />if a function, signature: (data, feature) => value
`width` |  | number | 600 | pixel width of containing element
`zoomStep` |  | number | 1.1 | amount to zoom in/out from zoom controls.<br />current zoom scale is multiplied by prop value.<br />e.g. 1.1 is equal to 10% steps, 2.0 is equal to 100% steps

