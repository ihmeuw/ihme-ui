![travis badge](https://travis-ci.org/ihmeuw/ihme-ui.svg) [![codecov.io](https://codecov.io/github/ihmeuw/ihme-ui/coverage.svg?branch=master)](https://codecov.io/github/ihmeuw/ihme-ui?branch=master)

# IHME-UI
Visualization tools from the Institute for Health Metrics and Evaluation

### *WORK IN PROGRESS*: Not stable until v1.0

### Use
```sh
npm install ihme-ui
```

### API Reference
 - UI
   - [\<AxisChart /\>](#axis-chart)
   - [\<Line /\>](#line)
 - Test Utilities
  - [dataGenerator](#dataGenerator)


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

### Test Utilities
#### <a name="dataGenerator" href="#dataGenerator">#</a> Data Generator

Data Generator creates fake data for testing purposes.

Usage:
```javascript
const config = {
  primaryKeys = [
    {name: 'key_1', values: ['v_11', 'v_21', ..., 'v_m1']},
    {name: 'key_2', values: ['v_12', 'v_22', ..., 'v_m2']},
    ...
    {name: 'key_n', values: ['v_1n', 'v_2n', ..., 'v_mn']}
  ],
  valueKeys = [
    {name: 'value_1', range: [lower_1, upper_1], uncertainty: true},
    {name: 'value_2', range: [lower_2, upper_2], uncertainty: false},
    ...
    {name: 'value_k', range: [lower_k, upper_k], uncertainty: false}
  ],
  year: 2000,
  length: 10
}
dataGenerator(config);
```

Data Generator takes an object with four properties.

`primaryKeys` is an array of objects that have a `name` property that is a string, and a `values` property that is an array. The data generator will create unique composite keys based on the values arrays.

`valueKeys` is an array of objects that have a `name` property that is a string, a `range` property that is an array of two numbers, and an `uncertainty` property that is a boolean. Value keys are iterated so that their values are within the range specified. If `uncertainty` is true, data generator will produce additional keys of the form `(name)_ub` and `(name)_lb` to represent upper and lower bound uncertainties.

`year` is a number that represents a starting year for a series of years iterated by length. The ouput key is `year_id`.

`length` is a number for which each unique composite key gets a new value key.

Data generator also outputs a unique `id` key for each row of data.

#### <a name="code-quality" href="#code-quality">#</a> Code Quality
- eslint enforces AirBnB rules: https://github.com/airbnb/javascript
