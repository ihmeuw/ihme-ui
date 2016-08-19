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
    primaryKeys: [{ name: keyField, values: [keyField] }],
    valueKeys: [{ name: valueField, range: [100, 200], uncertainty: true }],
    length: 10
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

  const mouseOverSpy = sinon.spy((datum) => { return datum; });
  const mouseLeaveSpy = sinon.spy((datum) => { return datum; });

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
        onMouseOver={mouseOverSpy}
        onMouseLeave={mouseLeaveSpy}
      />
    );
  });

  afterEach(() => {
    clickCallback.reset();
    mouseOverSpy.reset();
    mouseLeaveSpy.reset();
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
    expect(mouseOverSpy.called).to.be.true;
    expect(mouseOverSpy.getCall(0).returnValue).to.be.an('array');
  });

  it('responds to a mouseleave event', () => {
    const wrapper = shallow(component);
    wrapper.find('path').first().simulate('mouseLeave');
    expect(mouseLeaveSpy.called).to.be.true;
    expect(mouseLeaveSpy.getCall(0).returnValue).to.be.an('array');
  });
});
