// react
import React from 'react';
import { render } from 'react-dom';

// component
import RangeSlider from '../src/components/range-slider';

// utils
import maxBy from 'lodash.maxby';
import minBy from 'lodash.minby';
import reduce from 'lodash.reduce';
import { scaleLinear } from 'd3-scale';
import { colorSteps, dataGenerator } from '@ihme/beaut-test-utils';

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
  rangeExtent: domain
};

// TODO
// add to beaut-util lib to make resusable
const generateColorDomain = function generateColorDomain(colorSteps, domain) {
  // if max and min are the same number (e.g., full range of dataset is 0 -> 0)
  // return single element array
  const [min, max] = domain;
  if (min === max) return domain;

  let ret = [];
  const increment = (Math.abs(domain[1] - domain[0]) / (colorSteps.length - 1));
  reduce(colorSteps, function(total) {
    const step = total + increment;
    ret.push(step);
    return step;
  }, (domain[0] - increment));

  return ret;
};

const colors = {
  steps: colorSteps,
  scale: scaleLinear()
    .domain(generateColorDomain(colorSteps, domain))
    .range(colorSteps)
};

render(<RangeSlider colors={colors} data={data} />, document.getElementById('app'));
