import React from 'react';

import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';

import Group, { Option } from '../';

chai.use(chaiEnzyme());

describe('<Group />', () => {
  it('renders options as buttons', () => {
    const wrapper = shallow(
      <Group>
        <Option key={1} text="One" selected />
        <Option key={2} text="Two" />
        <Option key={3} text="Three" disabled />
      </Group>
    );

    expect(wrapper).to.have.exactly(3).descendants('Option');
  });
});
