import React from 'react';

import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';

import maxBy from 'lodash/maxBy';
import minBy from 'lodash/minBy';
import map from 'lodash/map';
import uniqBy from 'lodash/uniqBy';

import d3Scale from 'd3-scale';

import { dataGenerator } from '../../../test-utils';
import { MultiLine } from '../';

chai.use(chaiEnzyme());

const keyField = 'year_id';
const valueField = 'value';

describe('<MultiLine />', () => {
  const data = dataGenerator({
    keyField,
    valueField,
    length: 10,
    dataQuality: 'best',
    useDates: true
  });

  const yDomain = [minBy(data, valueField)[valueField], maxBy(data, valueField)[valueField]];
  const xDomain = map(uniqBy(data, keyField), (obj) => { return (obj[keyField]); });

  const scales = {
    x: d3Scale.scalePoint().domain(xDomain).range([0, 100]),
    y: d3Scale.scaleLinear().domain(yDomain).range([100, 0])
  };

  const lineData = [{ location: 'USA', values: data }, { location: 'Canada', values: data }];

  let component;

  before(() => {
    component = (
      <MultiLine
        data={lineData}
        keyField={'location'}
        dataField={'values'}
        scales={scales}
        dataAccessors={{ x: keyField, y: valueField }}
      />
    );
  });

  it('renders a g', () => {
    const wrapper = shallow(component);
    expect(wrapper.find('g')).to.have.length(1);
  });

  it('renders two paths', () => {
    const wrapper = shallow(component);
    expect(wrapper).to.have.exactly(2).descendants('Line');
  });

  it('passes a subset of its props to child components', () => {
    const wrapper = shallow(component);
    const child = wrapper.find('Line').first();
    expect(child)
      .to.have.prop('scales')
      .that.is.an('object')
      .that.has.keys(['x', 'y']);

    expect(child)
      .to.not.have.prop('keyField');
  });
});
