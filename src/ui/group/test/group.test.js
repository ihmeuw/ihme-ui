import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { mount, shallow } from 'enzyme';
import sinon from 'sinon';

import Group, { Option } from '../';

chai.use(chaiEnzyme());

describe('<Group />', () => {
  it('renders options as buttons', () => {
    const wrapper = shallow(
      <Group>
        <Option value={1} text="One" selected />
        <Option value={2} text="Two" />
        <Option value={3} text="Three" disabled />
      </Group>
    );

    expect(wrapper).to.have.exactly(3).descendants('Option');
  });

  it('handles clicks', () => {
    const mockEvent = {};
    const clickHandler = sinon.spy((evt, value) => value);

    const wrapper = mount(
      <Group onClick={clickHandler}>
        <Option value={1} text="One" id="clickMe" selected />
        <Option value={2} text="Two" />
        <Option value={3} text="Three" disabled />
      </Group>
    );

    const button = wrapper.find('#clickMe');
    button.simulate('click');
    expect(clickHandler.called).to.be.true;
    expect(clickHandler.calledWithMatch(mockEvent, 1)).to.be.true;
  });
});
