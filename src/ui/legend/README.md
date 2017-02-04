<Legend \/>
=====================

`import Legend from 'ihme-ui/ui/legend'`


Property | Required | Type(s) | Defaults | Description
        --- | :---: | :---: | :---: | ---
`items` | true | array of object | [] | legend items
`ItemComponent` |  | func | LegendItem | component (must be passable to React.createElement) to render for each item;<br />passed props `item`, `itemClassName`, `itemStyles`, `labelKey`, `LabelComponent`, `onClear`, `onClick`, `renderClear`, `symbolColorKey`, `symbolTypeKey`<br />defaults to [LegendItem](https://github.com/ihmeuw/ihme-ui/blob/master/src/ui/legend/src/legend-item.jsx)
`itemClassName` |  | [CommonPropTypes.className](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) |  | classname applied to `ItemComponent`
`itemStyles` |  | [CommonPropTypes.style](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L16) |  | inline styles applied to `ItemComponent`<br />if passed an object, will be applied directly inline to the `<li>`<br />if passed a function, will be called with the current item obj
`LabelComponent` |  | func |  | custom component to render for each label, passed current item;<br />must be passable to React.createElement
`labelKey` | true | string, func |  | path to label in item objects (e.g., 'name', 'properties.label')<br />or a function to resolve the label (signature: function (item) {...})
`onClear` |  | func |  | callback when 'clear' icon is clicked; signature: function(SyntheticEvent, item) {}
`onClick` |  | func |  | callback when legend item is clicked; signature: function(SyntheticEvent, item) {}
`renderClear` |  | bool |  | whether to render a 'clear' icon ('x') inline with each legend item
`symbolColorKey` | true | string, func |  | path to symbol color in item objects (e.g., 'color', 'properties.color')<br />or a function to resolve the color (signature: function (item) {...})
`symbolTypeKey` | true | string, func |  | path to symbol type in item objects (e.g., 'type', 'properties.type') or a function to resolve the type (signature: function (item) {...});<br />must be one of [supported symbol types](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/symbol.js#L23)
`title` |  | string |  | title for the legend
`TitleComponent` |  | func | LegendTitle | component (must be passable to React.createElement) to render for the title;<br />passed props `title`, `className`, `style`<br />defaults to [LegendTitle](https://github.com/ihmeuw/ihme-ui/blob/master/src/ui/legend/src/legend-title.jsx)
`titleClassName` |  | [CommonPropTypes.className](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) |  | className applied to title component
`titleStyles` |  | object |  | inline styles applied to title component
`ulClassName` |  | [CommonPropTypes.className](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) |  | className applied to `<ul>`, which wraps legend items
`wrapperClassName` |  | [CommonPropTypes.className](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) |  | className applied to outermost, wrapping `<div>`
`wrapperStyles` |  | object |  | inline styles applied to outermost, wrapper `<div>`
