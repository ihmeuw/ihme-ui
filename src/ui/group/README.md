Grouped selection controls
=====================

#### <Group \/>
`import Group from 'ihme-ui/ui/group'`


A wrapper to group elements, both visually and functionally. Its primary use case is as a buttonset,
which can be accomplished by wrapping `<Option />` components (or similar, customized components) in a `<Group />`.

If providing a custom component instead of using `<Option />`, component must accept an identifying `value` prop.


Property | Required | Type(s) | Defaults | Description
        --- | :---: | :---: | :---: | ---
`children` | true | node |  | 
`className` |  | [CommonPropTypes.className](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) | styles.group | className applied to outermost wrapping div
`onClick` | true | func |  | onClick callback passed to each child<br />implicitly depends on child components having a `value` prop<br />signature: function(event, selectedValue) {...}
`style` |  | [CommonPropTypes.style](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L16) |  | inline styles applied to outermost wrapping div


#### <Option \/>
`import { Option } from 'ihme-ui/ui/group`


Component designed to be wrapped by `<Group />`. Renders `props.type` and provides it with computed props `className`, `disabled`, `selected`, and `style`.
Any additional props passed to `<Option />` will be passed directly to the rendered component.


Property | Required | Type(s) | Defaults | Description
        --- | :---: | :---: | :---: | ---
`className` |  | [CommonPropTypes.className](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) |  | combined with `disabledClassName` and `selectedClassName` (if applicable) and passed to rendered component as `className`
`disabled` |  | bool |  | whether option is disabled
`disabledClassName` |  | [CommonPropTypes.className](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) | styles.disabled | className applied when disabled
`disabledStyle` |  | [CommonPropTypes.style](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L16) |  | inline style applied when disabled
`selected` |  | bool |  | whether option is selected
`selectedClassName` |  | [CommonPropTypes.className](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) | styles.selected | className applied when selected
`selectedStyle` |  | [CommonPropTypes.style](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L16) |  | inline style applied when selected
`style` |  | [CommonPropTypes.style](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L16) |  | inline styles
`type` |  | string, func | Button | tag name (JSX primitive) or React component to be rendered<br />defaults to [`<Button />`](https://github.com/ihmeuw/ihme-ui/blob/master/src/ui/button/src/button.jsx)
`value` |  | any |  | an implicitly necessary prop; used by `<Group />` to generate proper onClick handlers
