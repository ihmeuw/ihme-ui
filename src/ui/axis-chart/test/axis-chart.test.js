import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { mount, shallow } from 'enzyme';
import { maxBy, minBy, map, uniqBy } from 'lodash';

import { dataGenerator } from '../../../utils';
import AxisChart from '../';

chai.use(chaiEnzyme());

describe('<AxisChart />', () => {
  const keyField = 'year_id';
  const valueField = 'value';

  const data = dataGenerator({
    primaryKeys: [{ name: keyField, values: [keyField] }],
    valueKeys: [{ name: valueField, range: [100, 200], uncertainty: true }],
    length: 10,
  });

  const lineData = [{ location: 'USA', values: data }, { location: 'Canada', values: data }];

  let component;

  const yDomain = [minBy(data, valueField)[valueField], maxBy(data, valueField)[valueField]];
  const xDomain = map(uniqBy(data, keyField), (obj) => (obj[keyField]));

  before(() => {
    component = (
      <AxisChart
        xDomain={xDomain}
        xScaleType="point"
        yDomain={yDomain}
        yScaleType="linear"
        width={800}
        height={600}
        clipPath
      >
        {
          map(lineData, (dataSet) => (
            <p key={dataSet.location} />
          ))
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

  it('passes clip-path id to child components', () => {
    const wrapper = shallow(component);
    expect(wrapper.find('p').first())
      .to.have.prop('clipPathId')
      .that.is.a('string');
  });

  describe('updates based on new props', () => {
    it('creates new scales from width and height', () => {
      const wrapper = mount(component);
      wrapper.setProps({ width: 600, height: 400 });

      const { padding } = wrapper.props();
      const paddingWidth = padding.left + padding.right;
      const paddingHeight = padding.top + padding.bottom;
      expect(wrapper.state('scales').x.range()).to.deep.equal([0, 600 - paddingWidth]);
      expect(wrapper.state('scales').y.range()).to.deep.equal([400 - paddingHeight, 0]);
    });

    it('creates new scales from new scale types', () => {
      const wrapper = mount(component);
      const { x: oldX, y: oldY } = wrapper.state('scales');

      wrapper.setProps({ xScaleType: 'linear', xDomain: [0, 1] });
      const { x: newX } = wrapper.state('scales');
      expect(newX).to.not.equal(oldX);
      expect(newX.range()).to.deep.equal([0, 730]);
      expect(newX.domain()).to.deep.equal([0, 1]);

      wrapper.setProps({ yScaleType: 'linear', yDomain: [0, 1] });
      const { y: newY } = wrapper.state('scales');
      expect(newY).to.not.equal(oldY);
      expect(newY.range()).to.deep.equal([550, 0]);
      expect(newX.domain()).to.deep.equal([0, 1]);
    });

    it('doesn\'t update state for same props', () => {
      const wrapper = mount(component);
      const { x: oldX, y: oldY } = wrapper.state('scales');

      wrapper.update();
      const { x: newX, y: newY } = wrapper.state('scales');
      expect(newX).to.equal(oldX);
      expect(newY).to.equal(oldY);
    });
  });
});
