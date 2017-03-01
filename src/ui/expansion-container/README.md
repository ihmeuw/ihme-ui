Expanding components
=====================
ihme-ui provides two helpers for expanding a child component to fill the space taken up by its parent.

---

#### \<ExpansionContainer />
`import { ExpansionContainer } from 'ihme-ui'`


Property | Required | Type(s) | Defaults | Description
:---    |:---      |:---     |:---      |:---       
`className` |  | [CommonPropTypes.className](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) |  | className applied to outermost wrapping div
`style` |  | [CommonPropTypes.style](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L16) |  | inline styles applied to outermost wrapping div; `position: relative` is added automatically
`children` |  | node |  | 
`group` |  | string | 'default' | key used by `<Expandable />`s to register with `<ExpansionContainer />`;<br />if more than one `<ExpansionContainer />` is mounted, `group` should be treated as required and unique per instance.

---

#### \<Expandable />
`import { Expandable } from 'ihme-ui'`


`<Expandable />` is a *mostly* drop in replacement for a layout `<div />` that gives its contents
expanding powers, and must accompany an `<ExpansionContainer />` of the same `group` (default
group is 'default'). Flex related layout styles are passed directly to a content `<div />`, and
additional styles like `border`, `margin`, etc. must be supplied via the `expandableClassName`
and `expandableStyle` props.

Note: Transitions on the restore event do not execute on Firefox, and thus have been disabled.


Property | Required | Type(s) | Defaults | Description
:---    |:---      |:---     |:---      |:---       
`className` |  | [CommonPropTypes.className](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) |  | className applied to outermost containing div
`style` |  | [CommonPropTypes.style](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L16) |  | inline styles applied to outermost containing div
`expandableClassName` |  | [CommonPropTypes.className](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) |  | className applied to div directly wrapping component to expand
`expandableStyle` |  | [CommonPropTypes.style](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L16) |  | inline styles applied to div directly wrapping component to expand
`iconClassName` |  | [CommonPropTypes.className](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) |  | className applied to "expand/contract" icon
`iconStyle` |  | [CommonPropTypes.style](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L16) |  | inline styles applied to "expand/contract" icon
`iconSize` |  | string, number | '20px' | size of icon in px; applied to contentStyle as paddingRight and iconStyle as fontSize
`children` |  | node |  | 
`group` |  | string | 'default' | key used by `<Expandable />`s to register with `<ExpansionContainer />`;<br />if more than one `<ExpansionContainer />` is mounted, `group` should be treated as required<br />and unique per instance.
`hideIcon` |  | bool |  | do not render "expand/contract" icon
`transition` |  | string | 'all 0.5s ease' | CSS transition to apply to `<Expandable />` when transitioning in height/width
