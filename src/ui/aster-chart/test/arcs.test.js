import React from 'react';
import { noop } from 'lodash';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import AsterArcs from '../src/arcs';

chai.use(chaiEnzyme());

describe('<AsterChart />', () => {
  let component;

  before(() => {
    component = (
      <AsterArcs
        arcValueFunction={noop}
        classNameArcGroup="arcs-test-class-name"
        colorField={'color'}
        colorScale={noop}
        datum={{ data: {} }}
        outlineFunction={noop}
      />
    );
  });

  it('renders a g', () => {
    const wrapper = shallow(component);

    expect(wrapper).to.have.tagName('g');
  });
});

describe('events', () => {
  const datum = { data: { property: 'I am a property of data' } };
  const eventHandler = sinon.spy();
  let wrapper;

  before(() => {
    wrapper = shallow(
      <AsterArcs
        arcValueFunction={noop}
        colorField={'color'}
        colorScale={noop}
        datum={datum}
        outlineFunction={noop}
        onClick={eventHandler}
        onMouseLeave={eventHandler}
        onMouseMove={eventHandler}
        onMouseOver={eventHandler}
      />
    );
  });

  ['click', 'mouseLeave', 'mouseMove', 'mouseOver'].forEach((evtName) => {
    it(`calls ${evtName}`, () => {
      const event = { preventDefault() {} };

      eventHandler.reset();
      wrapper.simulate(evtName, event);
      expect(eventHandler.calledOnce).to.be.true;
      expect(eventHandler.calledWith(event, datum)).to.be.true;
    });
  });
});
