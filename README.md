![travis badge](https://travis-ci.org/ihmeuw/ihme-ui.svg) [![codecov.io](https://codecov.io/github/ihmeuw/ihme-ui/coverage.svg?branch=master)](https://codecov.io/github/ihmeuw/ihme-ui?branch=master)

# IHME-UI
Visualization tools from the Institute for Health Metrics and Evaluation

### Use
```sh
npm install ihme-ui
```

### API Reference
 - UI
   - [\<AxisChart /\>](#axis-chart)
   - [\<Line /\>](#line)

### UI Components

#### <a name="axis-chart" href="#axis-chart">#</a> \<AxisChart /\>
Container for a chart composed of other beaut/ui components, including axes, lines, points, etc. 
An AxisChart produces `x` and `y` scales and passes those scales, along with the chart's dimensions, to its child components.

**API**

Property | Required | Type(s) | Description
--- | :---: | :---: | ---
`width` | yes | number | width of the svg chart container 
`height` | yes | number | height of the svg chart container
`margins` | no | object | keys of `top`, `bottom`, `left`, `right` <br> default: `{ top: 20, bottom: 50, left: 50, right: 20 }`
`extraClasses` | no | array, string, object | extra class names to append to the element
`xDomain` | yes | array | [min, max] values for x scale (i.e., the domain of the data)
`xScaleType` | no | string | type of x scale, one of ['band', 'linear', 'ordinal', 'point'] <br> default: `ordinal`
`yDomain` | yes | array | [min, max] values for y scale (i.e., the range of the data)
`yScaleType` | no | string | type of y scale, one of ['band', 'linear', 'ordinal', 'point'] <br> default: `linear`

**EXAMPLE**

```jsx
import { AxisChart } from 'beaut/ui/axis-chart';
import { XAxis, YAxis } from 'beaut/ui/axis';

<AxisChart
  width={800}
  height={600}
  margins={{ top: 20, bottom: 50, left: 50, right: 20 }}
  xDomain={[2000, 2005, 2010, 2015]}
  xScaleType="point"
  yDomain={[0, 100]}
  yScaleType="linear"
>
  <XAxis />
  <YAxis />
  ...
</AxisChart>
```


#### <a name="line" href="#line">#</a> \<Line /\>
Line made up of array of data points.

**API**

Property | Required | Type(s) | Description
--- | :---: | :---: | ---
`data` | yes | array of objects | array of data 
`dataAccessors` | yes | object | keys of `x`, `y` with names of keys from `data` as values. <br>e.g. `{ x: 'year', y: 'value' }`
`scales` | yes | object | keys of `x`, `y` with scale functions of type `d3-scale`. <br> e.g. `{ x: d3Scale.ordinal..., y: d3Scale.linear... }`
`fill` | no | string | fill color type string
`stroke` | no | string | stroke color type string
`strokeWidth` | no | number | stroke width
`clickHandler` | no | func | function to be executed on click
`hoverHandler` | no | func | function to be executed on hover

**EXAMPLE**

```jsx
import { Line } from 'beaut/ui/shape';

<Line 
  data={[...]}
  dataAccessors={{ x: 'year', y: 'value' }}
  scales={{ x: d3Scale.ordinal..., y: d3Scale.linear... }}
/>
```

#### <a name="range-slider" href="#range-slider">#</a> \<RangeSlider /\>

- `import RangeSlider from 'beaut/ui/range-slider';`
- `import { RangeSlider } from 'beaut/ui';`

#### <a name="utility-functions" href="#utility-functions">#</a> Utility Functions
- `import utils from 'beaut/util';`
- `import { domain, scale } from 'beaut/utils';`

#### <a name="testing-utility-functions" href="#testing-utility-functions">#</a> Testing Utility Functions
- `import testUtils from 'beaut/test-util';`
- `import { dataMocker } from 'beaut/test-utils';`

#### <a name="code-quality" href="#code-quality">#</a> Code Quality
- eslint enforces AirBnB rules: https://github.com/airbnb/javascript
