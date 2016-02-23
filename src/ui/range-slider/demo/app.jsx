// react
import React from 'react';
import { render } from 'react-dom';

// component
import RangeSlider from '../src';

// utils
import maxBy from 'lodash/maxBy';
import minBy from 'lodash/minBy';
import reduce from 'lodash/reduce';
import { scaleLinear } from 'd3-scale';
import { dataGenerator, colorSteps } from '../../../test-utils';

const valueField = 'value';
const keyField = 'loc_id';

const values = dataGenerator({
  keyField,
  valueField,
  length: 100,
  dataQuality: 'best'
});

const domain = [minBy(values, 'value').value, maxBy(values, 'value').value];

const data = {
  domain,
  values,
  keyField,
  valueField,
  rangeExtent: domain,
  unit: 'Deaths per 100,000'
};

// TODO
// add to beaut-util lib to make resusable
const generateColorDomain = function generateColorDomain(colors, xDomain) {
  // if max and min are the same number (e.g., full range of dataset is 0 -> 0)
  // return single element array
  const [min, max] = xDomain;
  if (min === max) return xDomain;

  const ret = [];
  const increment = (Math.abs(xDomain[1] - xDomain[0]) / (colors.length - 1));
  reduce(colors, (total) => {
    const step = total + increment;
    ret.push(step);
    return step;
  }, (xDomain[0] - increment));

  return ret;
};

const colors = {
  steps: colorSteps,
  scale: scaleLinear()
    .domain(generateColorDomain(colorSteps, domain))
    .range(colorSteps)
};

class App extends React.Component {

  render() {
    return (
      <RangeSlider
        colors={colors}
        data={data}
      />
    );
  }
}

render(<App />, document.getElementById('app'));
