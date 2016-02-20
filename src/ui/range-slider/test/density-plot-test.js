import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { dataGenerator } from '../../../test-utils';
import maxBy from 'lodash/maxby';
import minBy from 'lodash/minby';
import d3Scale from 'd3-scale';

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

  const domain = [minBy(data, 'value').value, maxBy(data, 'value').value];

  const xScale = d3Scale.scaleLinear().domain(domain).range([0, 600]);

  let component;

  before(() => {
    component = (
      <DensityPlot
        data={data}
        xScale={xScale}
        keyField={'loc_id'}
        valueField={'value'}
        colorScale={function colorScale() { return 'blue'; }}
        width={450}
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
