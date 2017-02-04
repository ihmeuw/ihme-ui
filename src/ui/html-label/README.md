<HtmlLabel \/>
=====================
`import HtmlLabel from 'ihme-ui/ui/html-label'`

An HTML `<label>` to wrap interactive content.


Property | Required | Type(s) | Defaults | Description
        --- | :---: | :---: | :---: | ---
`children` |  | element |  | 
`className` |  | [CommonPropTypes.className](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11) |  | className applied to `<label>`
`htmlFor` |  | string |  | ID of a labelable element; useful if label does not contain its control.<br />See [https://www.w3.org/TR/html5/forms.html#attr-label-for](https://www.w3.org/TR/html5/forms.html#attr-label-for).
`icon` |  | string |  | path to image to render within label tag
`onClick` |  | func |  | signature: function(SyntheticEvent) {...}
`onMouseOver` |  | func |  | signature: function(SyntheticEvent) {...}
`text` |  | string |  | text to render within label tag
`theme` |  | one of: 'dark', 'light' | 'light' | one of: 'dark' (`color: white`), 'light' (`color: black`)

