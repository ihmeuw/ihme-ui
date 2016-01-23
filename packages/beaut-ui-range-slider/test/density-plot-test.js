import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { dataGenerator } from '@ihme/beaut-test-utils';

import DensityPlot from '../src/components/density-plot';

describe('<DensityPlot />', () => {
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

  const data = dataGenerator({
    keyField: 'loc_id',
    valueField: 'value',
    length: 10,
    dataQuality: 'best'
  });

  let component;

  before(() => {
    component = (
      <DensityPlot
        data={data}
        keyProp={'loc_id'}
        valueProp={'value'}
        colorScale={function colorScale() { return 'blue'; }}
        xScale={function xScale() { return 5; }}
        clickHandler={clickCallback}
        hoverHandler={hoverCallback}
      />
    );
  });

  afterEach(() => {
    clickCallback.reset();
    hoverCallback.reset();
  });

  it('should render an SVG g node', () => {
    const wrapper = shallow(component);
    expect(wrapper.find('g')).to.have.length(1);
  });

  it('should as many <circle>s as data points', () => {
    const wrapper = shallow(component);
    expect(wrapper.find('circle')).to.have.length(10);
  });

  it('should respond to a click event', () => {
    const wrapper = shallow(component);
    wrapper.find('circle').first().simulate('click');
    expect(clickCallback.called).to.be.true;

    const curriedSpy = clickCallback.getCall(0).returnValue.getCall(0);
    expect(curriedSpy.returnValue).to.be.an('object')
      .with.keys(['loc_id', 'value']);
  });

  it('should respond to a mouseover event', () => {
    const wrapper = shallow(component);
    wrapper.find('circle').first().simulate('mouseOver');
    expect(hoverCallback.called).to.be.true;

    const curriedSpy = hoverCallback.getCall(0).returnValue.getCall(0);
    expect(curriedSpy.returnValue).to.be.an('object')
      .with.keys(['loc_id', 'value']);
  });
});
