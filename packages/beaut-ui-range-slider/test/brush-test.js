import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import d3Scale from 'd3-scale';

import Brush from '../src/components/brush';

describe('<Brush />', () => {
  const domain = [0, 100];
  const width = 600;
  const xScale = d3Scale.scaleLinear().domain(domain).range([0, width]);

  it('renders four <rect/>\'s', () => {
    const component = (
      <Brush
        xScale={xScale}
        rangeExtent={domain}
        width={600}
      />
    );
    const wrapper = shallow(component);
    expect(wrapper.find('rect')).to.have.length(4);
  });
});
