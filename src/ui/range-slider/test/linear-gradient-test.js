import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { colorSteps } from '../../../test-utils/src/index';
import LinearGradient from '../src/components/linear-gradient';

describe('<LinearGradient />', () => {
  it('renders a linearGradient node as HTML text', () => {
    const wrapper = shallow(<LinearGradient colors={colorSteps} />);
    const renderedHTML = wrapper.find('linearGradient').render();
    expect(renderedHTML.find('#choropleth-linear-gradient-def')).to.have.length(1);
  });

  it('renders as many SVG stops as color steps passed through props', () => {
    const wrapper = shallow(<LinearGradient colors={colorSteps} />);

    expect(wrapper.children()).to.have.length(colorSteps.length);
  });

  it('renders each SVG stop with a key, offset and stopColor prop', () => {
    const wrapper = shallow(<LinearGradient colors={colorSteps} />);

    wrapper.children().forEach(node => {
      expect(node.type()).to.equal('stop');
      expect(node.props()).to.include.keys('offset', 'stopColor');
    });
  });

  it('defines x-axis coord start and end of the vector gradient', () => {
    const wrapper = shallow(
      <LinearGradient
        colors={colorSteps}
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
