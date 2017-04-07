\<Map />
=====================
`import { Map } from 'ihme-ui'`

`<Map />` is a composition of `<Choropleth />` and `<ChoroplethLegend />`.
It provides a mesh-filter-based implementation for displaying disputed territories. In order to take advantage of this feature,
your topojson must conform to the following requirements:
 - geometries that are disputed must have an array of ids on their `properties` object on a key named `disputes`.
 - the above ids must be resolvable by `props.geometryKeyField`

[See it in action!](http://vizhub.healthdata.org/mortality/age-estimation)


Property | Required | Type(s) | Defaults | Description
:---    |:---      |:---     |:---      |:---       
`axisTickFormat` |  | func |  | [format of axis ticks](https://github.com/d3/d3-axis#axis_tickFormat)<br />implicitly defaults to [numberFormat](https://github.com/ihmeuw/ihme-ui/blob/docs/src/utils/numbers.js#L9)
`className` |  | [CommonPropTypes.className](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) |  | className applied to outermost wrapping div
`colorSteps` |  | array | defaultColorSteps.slice().reverse() | list of hex or rbg color values<br />color scale will interpolate between these values<br />defaults to list of 11 colors with blue at the "bottom" and red at the "top"<br />this encodes IHME's "high numbers are bad" color scheme
`data` | true | array |  | array of datum objects
`domain` | true | array |  | domain of color scale
`focus` |  | object |  | The datum object corresponding to the `<Shape />` currently focused.
`focusedClassName` |  | [CommonPropTypes.className](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) |  | className applied if `<Shape />` has focus.
`focusedStyle` |  | [CommonPropTypes.style](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L16) |  | inline styles applied to focused `<Shape />`<br />If an object, spread into inline styles.<br />If a function, passed underlying datum corresponding to its `<Shape />`,<br />and return value is spread into inline styles;<br />signature: (datum) => obj
`extentPct` |  | array | [0, 1] | [minPercent, maxPercent] of color scale domain to place slider handles
`geometryKeyField` | true | string, func |  | uniquely identifying field of geometry objects;<br />if a function, will be called with the geometry object as first parameter<br />N.B.: the resolved value of this prop should match the resolved value of `props.keyField`<br />e.g., if data objects are of the following shape: { location_id: <number>, mean: <number> }<br />and if features within topojson are of the following shape: { type: <string>, properties: { location_id: <number> }, arcs: <array> }<br />`keyField` may be one of the following: 'location_id', or (datum) => datum.location_id<br />`geometryKeyField` may be one of the following: 'location_id' or (feature) => feature.properties.location_id
`keyField` | true | string, func |  | unique key of datum;<br />if a function, will be called with the datum object as first parameter
`legendClassName` |  | [CommonPropTypes.className](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) |  | classname applied to div containing choropleth legend
`legendMargins` |  | object | {<br />  top: 20,<br />  right: 50,<br />  bottom: 0,<br />  left: 50,<br />} | margins passed to `<ChoroplethLegend />`<br />subtracted from width and height of `<ChoroplethLegend />`
`legendStyle` |  | object |  | inline style object applied to div containing choropleth legend
`loading` |  | bool | false | is data for this component currently being fetched<br />will prevent component from updating (a la shouldComponentUpdate) if true
`mapClassName` |  | [CommonPropTypes.className](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) |  | className applied to div directly wrapping `<Choropleth />`
`mapStyle` |  | [CommonPropTypes.style](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L16) |  | inline styles applied to div directly wrapping `<Choropleth />`
`onClick` |  | func |  | event handler passed to both choropleth and choropleth legend;<br />signature: (SyntheticEvent, datum, Path) => {...}
`onMouseLeave` |  | func |  | event handler passed to both choropleth and choropleth legend;<br />signature: (SyntheticEvent, datum, Path) => {...}
`onMouseMove` |  | func |  | event handler passed to both choropleth and choropleth legend;<br />signature: (SyntheticEvent, datum, Path) => {...}
`onMouseOver` |  | func |  | event handler passed to both choropleth and choropleth legend;<br />signature: (SyntheticEvent, datum, Path) => {...}
`onSetScale` |  | func |  | callback for "Set scale" button;<br />passed current rangeExtent (in data space) as first and only argument<br />signature: ([min, max]) => {...}
`onSliderMove` | true | func |  | callback function to attach to slider handles;<br />passed [min, max] (Array), the range extent as a percentage<br />signature: ([min, max]) => {...}
`onResetScale` | true | func |  | callback for "Reset" button;<br />passed current rangeExtent (in data space) as first and only argument<br />rangeExtent in this case will always equal this.props.domain<br />signature: (domain) => {...}
`selectedLocations` |  | array of object | [] | array of selected location objects
`sliderHandleFormat` |  | func |  | format of slider handle labels<br />implicitly defaults to [numberFormat](https://github.com/ihmeuw/ihme-ui/blob/docs/src/utils/numbers.js#L9)
`style` |  | object |  | inline styles applied to outermost wrapping div
`title` |  | string |  | title positioned on top of choropleth<br />in semi-opaque div that spans the full width of the component
`titleClassName` |  | [CommonPropTypes.className](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) |  | className applied to div wrapping the title
`titleStyle` |  | object |  | inline styles applied to div wrapping the title
`topojsonObjects` |  | array of string | ['national'] | array of keys on topology.objects (e.g., ['national', 'ADM1', 'health_districts']);<br />if a key on topology.objects is omitted, it will not be rendered
`topology` | true | object |  | preprojected topojson;<br />for more information, see the [topojson wiki](https://github.com/topojson/topojson/wiki)
`unit` |  | string |  | unit of data;<br />used as axis label in choropleth legend
`valueField` | true | string, func |  | key of datum that holds the value to display (e.g., 'mean')<br />if a function, signature: (data, feature) => value
`zoomControlsClassName` |  | object, string |  | className applied to controls container div
`zoomControlsStyle` |  | object |  | inline styles to apply to controls buttons

