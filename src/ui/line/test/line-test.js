import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { dataGenerator } from '../../../test-utils';
import maxBy from 'lodash/maxby';
import minBy from 'lodash/minby';
import d3Scale from 'd3-scale';

import Line from '../src';

describe('<Line />', () => {
  const keyField = 'year_id';
  const valueField = 'value';
  const bounds = 600;

  const data = dataGenerator({
    keyField,
    valueField,
    length: 10,
    dataQuality: 'best',
    useDates: true
  });

  let component;

  const range = [minBy(data, valueField)[valueField], maxBy(data, valueField)[valueField]];
  const domain = [minBy(data, keyField)[keyField], maxBy(data, keyField)[keyField]];

  const xScale = d3Scale.scaleLinear().domain(domain).range([0, bounds]);
  const yScale = d3Scale.scaleLinear().domain(range).range([0, bounds]);

  before(() => {
    component = (
      <Line
        data={data}
        xScale={xScale}
        yScale={yScale}
        keyField={keyField}
        valueField={valueField}
        width={bounds}
        height={bounds}
      />
    );
  });

  it('should render an SVG g node', () => {
    const wrapper = shallow(component);
    expect(wrapper.find('g'));
  });

});
