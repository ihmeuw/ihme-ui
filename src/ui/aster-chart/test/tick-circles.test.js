import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { mount, shallow } from 'enzyme';

import AsterTickCircles from '../src/tick-circles';

chai.use(chaiEnzyme());

describe('<AsterTickCircles />', () => {
  let component;

  before(() => {
    component = (
      <AsterTickCircles
        classNameInnerTick="inner-class-test"
        classNameOuterTick="outer-class-test"
        domain={[0, 100]}
        innerRadius={5}
        radius={10}
        styleInnerTick={{ innerStyle: 'inner' }}
        styleOuterTick={{ outerStyle: 'outer' }}
        ticks={6}
      >
        <div id="child-div">child div</div>
      </AsterTickCircles>
    );
  });

  it('renders a g', () => {
    const wrapper = shallow(component);

    expect(wrapper).to.have.tagName('g');
  });

  it('Has correct child content', () => {
    const wrapper = mount(component).children();
    const childText = wrapper.find('#child-div').text();

    expect(childText).to.equal('child div');
    expect(wrapper.containsMatchingElement(
      <div id="child-div">child div</div>
    )).to.equal(true);
  });

  it('renders inner circle', () => {
    const wrapper = mount(component).children();

    expect(wrapper.containsMatchingElement(
      <circle className="inner-class-test" />
    )).to.equal(true);
  });

  it('renders outer circle', () => {
    const wrapper = mount(component).children();

    expect(wrapper.containsMatchingElement(
      <circle className="outer-class-test" />
    )).to.equal(true);
  });
});
