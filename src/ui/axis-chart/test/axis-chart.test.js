import React from 'react';

import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';

import { maxBy, minBy, map, uniqBy } from 'lodash';

import { dataGenerator } from '../../../test-utils';
import { AxisChart } from '../';

chai.use(chaiEnzyme());


describe('<AxisChart />', () => {
  const keyField = 'year_id';
  const valueField = 'value';

  const data = dataGenerator({
    keyField,
    valueField,
    length: 10,
    dataQuality: 'best',
    useDates: true
  });

  const lineData = [{ location: 'USA', values: data }, { location: 'Canada', values: data }];

  let component;

  const yDomain = [minBy(data, valueField)[valueField], maxBy(data, valueField)[valueField]];
  const xDomain = map(uniqBy(data, keyField), (obj) => { return (obj[keyField]); });

  before(() => {
    component = (
      <AxisChart
        xDomain={xDomain}
        xScaleType="point"
        yDomain={yDomain}
        yScaleType="linear"
        width={800}
        height={600}
      >
        {
          map(lineData, (dataset) => {
            return (
              <p key={dataset.location}/>
            );
          })
        }
      </AxisChart>
    );
  });

  it('renders an svg', () => {
    const wrapper = shallow(component);
    expect(wrapper).to.have.tagName('svg');
  });

  it('renders child components', () => {
    const wrapper = shallow(component);
    expect(wrapper).to.have.exactly(2).descendants('p');
  });

  it('passes scales as props to child components', () => {
    const wrapper = shallow(component);
    expect(wrapper.find('p').first())
      .to.have.prop('scales')
      .that.is.an('object')
      .that.has.keys(['x', 'y']);
  });
});
