import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';

import { colorSteps } from '../../../test-utils';
import LinearGradient from '../src/linear-gradient';

chai.use(chaiEnzyme());

describe('ChoroplethLegend <LinearGradient />', () => {
  it('renders a linearGradient node as HTML text', () => {
    const wrapper = shallow(
      <LinearGradient
        colors={colorSteps}
        width={400}
        height={15}
      />
    );

    expect(wrapper.find('linearGradient')).to.have.length(1);
  });

  it('renders as many SVG stops as color steps passed through props', () => {
    const wrapper = shallow(
      <LinearGradient
        colors={colorSteps}
        width={400}
        height={15}
      />
    );

    expect(wrapper.find('linearGradient').children()).to.have.length(colorSteps.length);
  });

  it('renders each SVG stop with a key, offset and stopColor prop', () => {
    const wrapper = shallow(
      <LinearGradient
        colors={colorSteps}
        width={400}
        height={15}
      />
    );

    wrapper.find('linearGradient').children().forEach(node => {
      expect(node.type()).to.equal('stop');
      expect(node.props()).to.include.keys('offset', 'stopColor');
    });
  });

  it('defines x-axis coord start and end of the vector gradient', () => {
    const wrapper = shallow(
      <LinearGradient
        colors={colorSteps}
        width={400}
        height={15}
        x1={25}
        x2={75}
      />
    );
    const node = wrapper.find('linearGradient');

    expect(node.prop('x1')).to.be.a('string')
      .and.to.equal('25%');

    expect(node.prop('x2')).to.be.a('string')
      .and.to.equal('75%');
  });
});
