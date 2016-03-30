import React from 'react';
import chai, { expect } from 'chai';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';

chai.use(chaiEnzyme());

import SvgText from '../';

describe('<Label />', () => {
  it('renders an SVG text node', () => {
    const wrapper = shallow(<SvgText anchor="start" x={5} value={25} />);
    expect(wrapper.find('text')).to.have.length(1);
  });

  it('renders a label that is a number to one fixed-point', () => {
    const wrapper = shallow(<SvgText anchor="start" x={5} value={30.27} />);

    expect(wrapper.find('text')).to.have.text('30.3');
  });

  it('renders a label that is a string', () => {
    const wrapper = shallow(<SvgText anchor="start" x={5} value="Years" />);

    expect(wrapper.find('text')).to.have.text('Years');
  });
});
