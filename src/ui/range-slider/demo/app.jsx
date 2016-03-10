// react
import React from 'react';
import { render } from 'react-dom';

// component
import RangeSlider from '../src';

// utils
import maxBy from 'lodash/maxBy';
import minBy from 'lodash/minBy';
import { scaleLinear } from 'd3-scale';
import { dataGenerator, colorSteps } from '../../../test-utils';
import { generateColorDomain } from '../../../utils/domain';

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
