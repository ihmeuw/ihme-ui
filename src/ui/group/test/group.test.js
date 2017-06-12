import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import Group, { Option } from '../';

chai.use(chaiEnzyme());

describe('<Group />', () => {
  const mockEvent = {};

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

  describe('optionValueProp', () => {
    const spy = sinon.spy();

    afterEach(() => spy.reset());

    const tests = [
      {
        description: 'string',
        expectation: 1,
        foo: 1,
        optionValueProp: 'foo',
      },
      {
        description: 'function',
        expectation: 2,
        foo: { bar: 2 },
        optionValueProp: (props) => props.foo.bar,
      },
    ];

    tests.forEach(test => {
      it(`pulls value of Option off of props - ${test.description}`, () => {
        const wrapper = shallow(
          <Group optionValueProp={test.optionValueProp}>
            <Option
              foo={test.foo}
              onClick={spy}
              text="One"
            />
          </Group>
        );

        const button = wrapper.childAt(0);
        button.simulate('click', mockEvent);

        const [, value] = spy.getCall(0).args;
        expect(value).to.equal(test.expectation);
      });
    });
  });

  describe('events', () => {
    const groupOnClick = sinon.spy();
    const optionOnClick = sinon.spy();

    const wrapper = shallow(
      <Group onClick={groupOnClick}>
        <Option
          selected
          text="One"
          value={1}
        />
        <Option
          onClick={optionOnClick}
          text="Two"
          value={2}
        />
      </Group>
    );

    afterEach(() => [groupOnClick, optionOnClick].forEach(spy => spy.reset()));

    it('provides a default onClick handler attached to Group', () => {
      const button = wrapper.childAt(0);
      button.simulate('click', mockEvent);
      expect(groupOnClick.called).to.equal(true);
      expect(optionOnClick.called).to.equal(false);
    });

    it('allows individual Options to provide an onClick override', () => {
      const button = wrapper.childAt(1);
      button.simulate('click', mockEvent);
      expect(groupOnClick.called).to.equal(false);
      expect(optionOnClick.called).to.equal(true);
    });

    it('calls onClick with event, value, and the Option instance selected', () => {
      const button = wrapper.childAt(0);
      button.simulate('click', mockEvent);
      expect(groupOnClick.getCall(0).args.length).to.equal(3);

      const [
        event,
        value,
        instance,
      ] = groupOnClick.getCall(0).args;

      expect(event).to.equal(mockEvent);
      expect(value).to.equal(button.prop('value'));
      expect(button.matchesElement(instance)).to.equal(true);
    });
  });
});
