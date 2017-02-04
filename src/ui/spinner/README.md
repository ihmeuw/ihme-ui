<Spinner \/>
=====================

`import Spinner from 'ihme-ui/ui/spinner'`


Yet another loading indicator. But don't be fooled! This one doesn't actually spin.


Property | Required | Type(s) | Defaults | Description
        --- | :---: | :---: | :---: | ---
`className` |  | [CommonPropTypes.className](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) |  | Class name applied to outermost wrapping `<div>`.
`inline` |  | bool |  | Display inline with other elements (e.g., in a button).
`style` |  | [CommonPropTypes.style](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L16) |  | Inline styles applied to outermost wrapping `<div>`.
`symbolFill` |  | string | 'black' | Fill color of loading symbol.
`symbolStyle` |  | [CommonPropTypes.style](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L16) |  | Inline styles applied to loading symbol.
`symbolType` |  | string | 'circle' | Type of loading symbol to render.<br />One of: 'circle', 'cross', 'diamond', 'square', 'star', 'triangle', 'wye'
