import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { maxBy, minBy } from 'lodash';
import d3Scale from 'd3-scale';
import { area } from 'd3-shape';

import { dataGenerator } from '../../../test-utils';
import { Area } from '../';

chai.use(chaiEnzyme());

describe('<Area />', () => {
  const keyField = 'year_id';
  const valueField = 'value';
  const chartDimensions = {
    width: 600,
    height: 400
  };

  const data = dataGenerator({
    primaryKeys: [{ name: keyField, values: [keyField] }],
    valueKeys: [{ name: valueField, range: [100, 200], uncertainty: true }],
    length: 10
  });

  const range = [minBy(data, 'value_lb')[valueField], maxBy(data, 'value_ub')[valueField]];
  const domain = [minBy(data, keyField)[keyField], maxBy(data, keyField)[keyField]];

  const xScale = d3Scale.scalePoint().domain(domain).range([0, chartDimensions.width]);
  const yScale = d3Scale.scaleLinear().domain(range).range([chartDimensions.height, 0]);

  const clickCallback = sinon.spy((datum) => {
    return sinon.spy(() => {
      return datum;
    });
  });

  const hoverCallback = sinon.spy((datum) => {
    return sinon.spy(() => {
      return datum;
    });
  });

  const areaFunction = area()
    .x((datum) => { return xScale(datum[keyField]); })
    .y0((datum) => { return yScale(datum.value_lb); })
    .y1((datum) => { return yScale(datum.value_ub); });

  const expectedPath = areaFunction(data);
  let component;

  before(() => {
    component = (
      <Area
        data={data}
        scales={{ x: xScale, y: yScale }}
        dataAccessors={{ x: keyField, y0: 'value_lb', y1: 'value_ub' }}
        clickHandler={clickCallback}
        hoverHandler={hoverCallback}
      />
    );
  });

  afterEach(() => {
    clickCallback.reset();
    hoverCallback.reset();
  });

  it('renders an SVG path node with a d attribute', () => {
    const wrapper = shallow(component);
    const path = wrapper.find('path');

    expect(path).to.have.length(1);
    expect(path).to.have.attr('d', expectedPath);
  });

  it('responds to a click event', () => {
    const wrapper = shallow(component);
    wrapper.find('path').first().simulate('click');
    expect(clickCallback.called).to.be.true;

    const curriedSpy = clickCallback.getCall(0).returnValue.getCall(0);
    expect(curriedSpy.returnValue).to.be.an('array');
  });

  it('responds to a mouseover event', () => {
    const wrapper = shallow(component);
    wrapper.find('path').first().simulate('mouseOver');
    expect(hoverCallback.called).to.be.true;

    const curriedSpy = hoverCallback.getCall(0).returnValue.getCall(0);
    expect(curriedSpy.returnValue).to.be.an('array');
  });
});
