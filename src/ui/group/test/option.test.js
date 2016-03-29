import React from 'react';

import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';

import { Option } from '../';

chai.use(chaiEnzyme());

describe('<Option />', () => {
  it('renders a button by default', () => {
    const wrapper = shallow(<Option key={1} text="One" value="1" />);

    expect(wrapper).to.have.exactly(1).descendants('Button');
  });
});
