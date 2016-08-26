import React from 'react';
import chai, { expect } from 'chai';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';

chai.use(chaiEnzyme());

import SvgText from '../';

describe('<SvgText />', () => {
  it('renders an SVG text node', () => {
    const wrapper = shallow(<SvgText anchor="start" x={5} value={25} />);
    expect(wrapper.find('text')).to.have.length(1);
  });
});
