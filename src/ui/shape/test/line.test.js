import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { maxBy, minBy } from 'lodash';
import d3Scale from 'd3-scale';
import { line } from 'd3-shape';

import { dataGenerator } from '../../../test-utils';
import { Line } from '../';

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
