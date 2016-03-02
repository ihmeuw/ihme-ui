import React from 'react';

import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';

import maxBy from 'lodash/maxby';
import minBy from 'lodash/minby';

import d3Scale from 'd3-scale';
import { line } from 'd3-shape';

import { dataGenerator } from '../../../test-utils';
import { Line } from '../src';

chai.use(chaiEnzyme());


describe('<Line />', () => {
  const keyField = 'year_id';
  const valueField = 'value';
  const chartDimensions = {
    width: 600,
    height: 400
  };

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

  const xScale = d3Scale.scalePoint().domain(domain).range([0, chartDimensions.width]);
  const yScale = d3Scale.scaleLinear().domain(range).range([chartDimensions.height, 0]);

  const lineFunction = line()
    .x((datum) => { return xScale(datum[keyField]); })
    .y((datum) => { return yScale(datum[valueField]); });

  const expectedPath = lineFunction(data);

  before(() => {
    component = (
      <Line
        data={data}
        scales={{ x: xScale, y: yScale }}
        dataAccessors={{ x: keyField, y: valueField }}
      />
    );
  });

  it('renders an SVG path node with a d attribute', () => {
    const wrapper = shallow(component);
    const path = wrapper.find('path');

    expect(path).to.have.length(1);
    expect(path).to.have.attr('d', expectedPath);
  });
});
