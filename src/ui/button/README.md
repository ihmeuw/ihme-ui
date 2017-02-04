<Button \/>
=====================
`import Button from 'ihme-ui/ui/button'`


Property | Required | Type(s) | Defaults | Description
        --- | :---: | :---: | :---: | ---
`className` |  | [CommonPropTypes.className](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) |  | className applied to button
`disabled` |  | bool |  | boolean value to set button as disabled
`disabledClassName` |  | [CommonPropTypes.className](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) | styles.disabled | className applied to button when disabled
`disabledStyle` |  | [CommonPropTypes.style](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L16) |  | inline styles to apply to outermost svg element when disabled
`icon` |  | string |  | path to image to render within button tag
`id` |  | string |  | id value for button
`name` |  | string |  | [name of button](https://www.w3.org/TR/2011/WD-html5-20110525/association-of-controls-and-forms.html#attr-fe-name)
`onClick` |  | func |  | function to be executed on click;<br />signature: function(SyntheticEvent) {...}
`showSpinner` |  | bool |  | boolean value to display a loading spinner
`style` |  | object |  | inline styles to apply to button
`text` |  | string |  | text to render within button tag
`theme` |  | one of: 'green' |  | color scheme of component (see button.css)

