Grouped selection controls
=====================

#### \<Group />
`import { Group } from 'ihme-ui'`

A wrapper to group elements. Its primary use case is as a buttonset, which can be accomplished
by wrapping `<Option />` components (or similar, customized components) in a `<Group />`.

Property | Required | Type(s) | Defaults | Description
:---    |:---      |:---     |:---      |:---
`children` | true | node |  |
`className` |  | [CommonPropTypes.className](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) |  | className applied to outermost wrapping div
`onClick` |  | func | noop | onClick callback passed to each child<br />signature: (SyntheticEvent, selectedValue, optionInstance) {...}
`optionValueProp` |  | [CommonPropTypes.dataAccessor](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L28) | 'value' | Prop passed to `<Option />` to include in onClick handler<br />If function, passed Option.props as input.<br />Otherwise, uses object access to pull value off Option.props.<br />E.g., if every `<Option />` is provided a `foo` prop that uniquely identifies that option,<br />set `optionValueProp="foo"` to include that value in the onClick handler.
`style` |  | [CommonPropTypes.style](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L16) |  | inline styles applied to outermost wrapping div

---

#### \<Option />
`import { Option } from 'ihme-ui'`

Component designed to be wrapped by `<Group />`. Renders `props.type` and provides it with computed props `className`, `disabled`, `selected`, and `style`.
Any additional props passed to `<Option />` will be passed directly to the rendered component.

Property | Required | Type(s) | Defaults | Description
:---    |:---      |:---     |:---      |:---
`className` |  | [CommonPropTypes.className](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) | styles.option | combined with `disabledClassName` and `selectedClassName` (if applicable) and passed to rendered component as `className`
`disabled` |  | bool |  | whether option is disabled
`disabledClassName` |  | [CommonPropTypes.className](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) | styles.disabled | className applied when disabled
`disabledStyle` |  | [CommonPropTypes.style](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L16) |  | inline style applied when disabled
`selected` |  | bool |  | whether option is selected
`selectedClassName` |  | [CommonPropTypes.className](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) | styles.selected | className applied when selected
`selectedStyle` |  | [CommonPropTypes.style](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L16) |  | inline style applied when selected
`style` |  | [CommonPropTypes.style](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L16) |  | inline styles
`type` |  | string, func | Button | tag name (JSX primitive) or React component to be rendered<br />defaults to [`<Button />`](https://github.com/ihmeuw/ihme-ui/blob/master/src/ui/button/src/button.jsx)
