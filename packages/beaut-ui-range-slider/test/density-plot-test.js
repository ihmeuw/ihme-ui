import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import DensityPlot from '../src/components/density-plot';

describe('<DensityPlot />', () => {
  const clickSpy = sinon.spy();
  const hoverSpy = sinon.spy();

  afterEach(() => {
    clickSpy.reset();
    hoverSpy.reset();
  });

  it('should render an SVG g node', () => {
    const component = (
      <DensityPlot
        data={}
        keyProp={}
        valueProp={}
        colorScale={}
        xScale={}
        clickHandler={}
        hoverHandler={}
      />
    );

    const wrapper = shallow(component);
    expect(wrapper.find('g')).to.have.length(1);
  });
});