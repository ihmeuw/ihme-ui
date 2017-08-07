\<Axis />
=====================
{{{axis.description}}}

{{{axis.props}}}

--- 

#### \<XAxis />

`import { XAxis } from 'ihme-ui'`

Chart x-axis that extends \<Axis /> and provides some useful defaults.

All props documented on \<Axis /> are available on \<XAxis />. In addition, the following props are available:

Property | Required | Type(s) | Defaults | Description
:---    |:---      |:---     |:---      |:---
`autoFilterTickValues` | | bool | falsey | if true, will dynamically filter tick values by the available width or height
`orientation` |  | one of: 'top', 'bottom'  | 'bottom'  |  where to position axis line; will position ticks accordingly
`scale` | | func | | required if and only if `props.scales` is not provided
`scales` | | func | | required if and only if `props.scale` is not provided
`tickFontFamily` | | string | 'Helvetica' | font-family of axis ticks; used when taking measurement of widest tick if autoFilterTickValues === true
`tickFontSize` | | number | 12 | font size of axis ticks, in pixels; used when taking measurement of widest tick or to determine tick height if autoFilterTickValues === true

---

#### \<YAxis />

`import { YAxis } from 'ihme-ui'`

Chart y-axis that extends \<Axis /> and provides some useful defaults.

All props documented on \<Axis /> are available on \<YAxis />. In addition, the following props are available:

Property | Required | Type(s) | Defaults | Description
:---    |:---      |:---     |:---      |:---
`autoFilterTickValues` | | bool | falsey | if true, will dynamically filter tick values by the available width or height
`orientation` |  | one of: 'top', 'bottom'  | 'bottom'  |  where to position axis line; will position ticks accordingly
`scale` | | func | | required if and only if `props.scales` is not provided
`scales` | | func | | required if and only if `props.scale` is not provided
`tickFontFamily` | | string | 'Helvetica' | font-family of axis ticks; used when taking measurement of widest tick if autoFilterTickValues === true
`tickFontSize` | | number | 12 | font size of axis ticks, in pixels; used when taking measurement of widest tick or to determine tick height if autoFilterTickValues === true

