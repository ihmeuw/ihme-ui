import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { colorSteps } from '@ihme/beaut-test-utils';
import LinearGradient from '../components/linear-gradient';

describe('<LinearGradient />', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<LinearGradient colors={colorSteps} />);
  });

  it('renders as many SVG stops as color steps passed through props', () => {
    expect(wrapper.children()).to.have.length(colorSteps.length);
  });

  it('renders each SVG stop with a key, offset and stopColor prop', () => {
    wrapper.children().forEach(node => {
      expect(node.type()).to.equal('stop');
      expect(node.props()).to.include.keys('offset', 'stopColor');
    });
  });
});
