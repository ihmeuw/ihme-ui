import React from 'react';
import chai, { expect } from 'chai';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import SvgText from '../';

chai.use(chaiEnzyme());

describe('<SvgText />', () => {
  it('renders an SVG text node', () => {
    const wrapper = shallow(<SvgText anchor="start" x={5} value={25} />);
    expect(wrapper.find('text')).to.have.length(1);
  });
});
