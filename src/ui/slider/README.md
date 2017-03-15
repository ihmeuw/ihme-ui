\<Slider />
=====================

`import { Slider } from 'ihme-ui'`


Property | Required | Type(s) | Defaults | Description
:---    |:---      |:---     |:---      |:---       
`disabled` |  | bool | false | Disable slider visually and functionally.
`fill` |  | bool |  | Include fill in the track to indicate value.
`fillClassName` |  | [CommonPropTypes.className](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) |  | Class name applied to fill.
`fillStyle` |  | object |  | Inline styles applied to fill.
`fontSize` |  | string |  | Font size of handle labels.
`handleClassName` |  | [CommonPropTypes.className](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) |  | Class name applied to slider handle.
`handleStyle` |  | object |  | Inline styles applied to slider handle.
`labelFunc` |  | func | identity | Function applied to label prior to rendering.<br />Signature: (value): string => {...}
`onDrag` | true | func | noop | [dragmove](http://interactjs.io/docs/#interactevents) callback.<br />Called when slider value is changed.<br />Signature: (SyntheticEvent, values, Slider) => {...}<br /> - {Object} SyntheticEvent - the triggered action<br /> - {Object} values - { high: ..., low: ... }<br /> - {Object} Slider - the slider object (class instance)
`onDragEnd` |  | func | noop | [dragend](http://interactjs.io/docs/#interactevents) callback.<br />Called when slider handle is released.<br />Signature: (SyntheticEvent, values, Slider) => {...}<br /> - {Object} SyntheticEvent - the triggered action<br /> - {Object} values - { high: ..., low: ... }<br /> - {Object} Slider - the slider object (class instance)
`onKey` |  | func | noop | onKeyDown callback. Named for consistency with onDrag and onDragEnd.<br />Signature: (SyntheticEvent, values, Slider) => {...}<br /> - {Object} SyntheticEvent - the triggered action<br /> - {Object} values - { high: ..., low: ... }<br /> - {Object} Slider - the slider object (class instance)
`onKeyEnd` |  | func | noop | onKeyUp callback. Named for consistency with onDrag and onDragEnd.<br />Signature: (SyntheticEvent, values, Slider) => {...}<br /> - {Object} SyntheticEvent - the triggered action<br /> - {Object} values - { high: ..., low: ... }<br /> - {Object} Slider - the slider object (class instance)
`onTrackClick` |  | func | noop | onClick callback for slider track.<br />Signature: (SyntheticEvent, values, Slider) => {...}<br /> - {Object} SyntheticEvent - the triggered action<br /> - {Object} values - { high: ..., low: ... }<br /> - {Object} Slider - the slider object (class instance)
`range` | true | array, object |  | Extent of slider values. Can be either an array of [min, max] or a configuration object.<br /> Config:<br />   - low: min value<br />   - high: max value<br />   - steps: number of steps between low and high<br />   - precision: rounding precision
`ticks` |  | bool |  | Show ticks in track.
`tickClassName` |  | [CommonPropTypes.className](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) |  | Class name applied to each tick marking within the track, if applicable.
`tickStyle` |  | object |  | Inline styles applied to each tick marking within the track, if applicable.
`trackClassName` |  | [CommonPropTypes.className](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) |  | Class name applied to slider track.
`trackStyle` |  | object |  | Inline styles applied to slider track.
`value` | true | number, string, array, object |  | Selected value.<br />If number, a single slider handle will be rendered.<br />If object with keys 'low' and 'high', two slider handles (a "range slider") will be rendered.
`width` |  | number | 200 | Width of slider (in pixels).
`className` |  | [CommonPropTypes.className](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) |  | Class name applied to outermost wrapper.
`style` |  | object |  | Inline styles applied to outermost wrapper.
