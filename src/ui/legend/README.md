Legend
=====================

---

### \<Legend />
`import { Legend } from 'ihme-ui'`

Property | Required | Type(s) | Defaults | Description
:---    |:---      |:---     |:---      |:---
`className` |  | [CommonPropTypes.className](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) |  | className applied to outermost, wrapping `<div>`
`items` |  | array of object | [] | legend items
`ItemComponent` |  | func | LegendItem | component (must be passable to React.createElement) to render for each item;<br />passed props `className`, `item`, `labelKey`, `LabelComponent`, `onClear`, `onClick`,<br />`onMouseLeave`, `onMouseMove`, `onMouseOver`, `shapeColorKey`, `shapeTypeKey`, `style`<br />defaults to [LegendItem](https://github.com/ihmeuw/ihme-ui/blob/master/src/ui/legend/src/legend-item.jsx)
`itemClassName` |  | [CommonPropTypes.className](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) |  | classname applied to `ItemComponent`
`itemStyle` |  | [CommonPropTypes.style](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L16) |  | inline styles applied to `ItemComponent`<br />if passed an object, will be applied directly inline to the `<li>`<br />if passed a function, will be called with the current item obj
`LabelComponent` |  | func |  | custom component to render for each label, passed current item;<br />must be passable to React.createElement
`labelKey` |  | CommonPropTypes.dataAccessor.isRequired |  | path to label in item objects (e.g., 'name', 'properties.label')<br />or a function to resolve the label<br />signature: function (item) {...}
`listClassName` |  | [CommonPropTypes.className](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) |  | className applied to `<ul>`, which wraps legend items
`listStyle` |  | [CommonPropTypes.style](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L16) |  | inline styles applied to `<ul>`, which wraps legend items<br />if a function, passed items as argument. Signature: (items): {} => { ... }.
`onClear` |  | func |  | callback when 'clear' icon is clicked;<br />signature: (SyntheticEvent, item, instance) => {}
`onClick` |  | func |  | callback when legend item is clicked;<br />signature: (SyntheticEvent, item, instance) => {}
`onMouseLeave` |  | func | CommonDefaultProps.noop | onMouseLeave callback registered on each item.<br />signature: (SyntheticEvent, item, instance) => {...}
`onMouseMove` |  | func | CommonDefaultProps.noop | onMouseMove callback registered on each item.<br />signature: (SyntheticEvent, item, instance) => {...}
`onMouseOver` |  | func | CommonDefaultProps.noop | onMouseOver callback registered on each item.<br />signature: (SyntheticEvent, item, instance) => {...}
`shapeColorKey` |  | CommonPropTypes.dataAccessor.isRequired |  | path to shape color in item objects (e.g., 'color', 'properties.color')<br />or a function to resolve the color<br />signature: (item) => {...}
`shapeTypeKey` |  | CommonPropTypes.dataAccessor.isRequired |  | path to shape type in item objects (e.g., 'type', 'properties.type')<br />or a function to resolve the type<br />if a function: signature: (item) => {...}<br />must be one of [supported shape types](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/shape.js#L23)
`style` |  | [CommonPropTypes.style](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L16) |  | inline styles applied to outermost, wrapper `<div>`<br />if a function, passed items as argument. Signature: (items): {} => { ... }.
`title` |  | string |  | title for the legend
`TitleComponent` |  | func | LegendTitle | component (must be passable to React.createElement) to render for the title;<br />passed props `className`, `items`, `style`, `title`<br />defaults to [LegendTitle](https://github.com/ihmeuw/ihme-ui/blob/master/src/ui/legend/src/legend-title.jsx)
`titleClassName` |  | [CommonPropTypes.className](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) |  | className applied to title component
`titleStyles` |  | [CommonPropTypes.style](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L16) |  | inline styles applied to title component<br />if a function, passed items as argument.<br />Signature: (items): {} => { ... }.

---

### \<LegendItem />
import { LegendItem } from 'ihme-ui';

Default ItemComponent used by `<Legend />`.

Property | Required | Type(s) | Defaults | Description
:---    |:---      |:---     |:---      |:---
`className` |  | [CommonPropTypes.className](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) |  | classname(s) to apply to li
`item` | true | object |  | legend item to render
`LabelComponent` |  | func |  | custom component to render for each label, passed current item;<br />must be passable to React.createElement
`labelKey` |  | CommonPropTypes.dataAccessor.isRequired |  | path to label in item objects (e.g., 'name', 'properties.label')<br />or a function to resolve the label<br />signature: function (item) {...}
`onClear` |  | func |  | callback when 'clear' icon is clicked;<br />signature: (SyntheticEvent, item, instance) => {}
`onClick` |  | func |  | callback when legend item is clicked;<br />signature: (SyntheticEvent, item, instance) => {}
`onMouseLeave` |  | func | CommonDefaultProps.noop | onMouseLeave callback<br />signature: (SyntheticEvent, item, instance) => {...}
`onMouseMove` |  | func | CommonDefaultProps.noop | onMouseMove callback<br />signature: (SyntheticEvent, item, instance) => {...}
`onMouseOver` |  | func | CommonDefaultProps.noop | onMouseOver callback<br />signature: (SyntheticEvent, item, instance) => {...}
`shapeColorKey` |  | CommonPropTypes.dataAccessor.isRequired |  | path to shape color in item objects (e.g., 'color', 'properties.color')<br />or a function to resolve the color<br />signature: (item) => {...}
`shapeTypeKey` |  | CommonPropTypes.dataAccessor.isRequired |  | path to shape type in item objects (e.g., 'type', 'properties.type')<br />or a function to resolve the type<br />if a function: signature: (item) => {...}<br />must be one of [supported shape types](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/shape.js#L23)
`style` |  | [CommonPropTypes.style](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L16) |  | inline-styles to be applied to individual legend item <li><br />if a function, passed item as argument. Signature: (item): {} => { ... }.

---

### \<LegendTitle />
import { LegendTitle } from 'ihme-ui';

Default TitleComponent used by `<Legend />`.

Property | Required | Type(s) | Defaults | Description
:---    |:---      |:---     |:---      |:---
`className` |  | [CommonPropTypes.className](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) |  | classname applied to `<h3>`
`items` | true | array of object |  | legend items
`style` |  | [CommonPropTypes.style](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L16) |  | inline styles applied to title component<br />if a function, passed items as argument.<br />Signature: (items): {} => { ... }.
`title` |  | string |  | title for the legend
