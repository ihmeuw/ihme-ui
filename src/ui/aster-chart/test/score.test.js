import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import AsterScore from '../src/score';

chai.use(chaiEnzyme());

describe('<AsterScore />', () => {
  let component;

  before(() => {
    component = (
      <AsterScore
        centerTextBottom="bottom"
        centerTextTop="top"
        className={() => 'asterScore-test-classname'}
        data={[{ value: 1 }, { value: 1 }, { value: 1 }]}
        formatScore={(s) => s}
        radius={7}
        style={{ fill: 'red' }}
        valueField="value"
      />
    );
  });

  it('renders a g', () => {
    const wrapper = shallow(component);

    expect(wrapper).to.have.tagName('g');
  });
});

describe('events', () => {
  const data = [
    { data: { value: '1' } },
    { data: { value: '1' } },
    { data: { value: '1' } },
  ];
  const eventHandler = sinon.spy();
  let wrapper;

  before(() => {
    wrapper = shallow(
      <AsterScore
        className=""
        data={data}
        formatScore={(s) => s}
        onClick={eventHandler}
        onMouseLeave={eventHandler}
        onMouseMove={eventHandler}
        onMouseOver={eventHandler}
        radius={7}
        valueField="value"
      />
    );
  });

  ['click', 'mouseLeave', 'mouseMove', 'mouseOver'].forEach((evtName) => {
    it(`calls ${evtName}`, () => {
      const event = { preventDefault() {} };

      eventHandler.reset();
      wrapper.simulate(evtName, event);
      expect(eventHandler.calledOnce).to.be.true;
      expect(eventHandler.getCall(0).args[1].data).to.equal(data);
    });
  });

  it('event should report the correct average', () => {
    const event = { preventDefault() {} };

    eventHandler.reset();
    wrapper.simulate('click', event);
    expect(eventHandler.getCall(0).args[2].state.average).to.equal(1);
  });
});
