import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';

import AsterWhiskers from '../src/whiskers';

chai.use(chaiEnzyme());

describe('<AsterChart />', () => {
  let component;
  const datum = {
    endAngle: 3.5903916041026207,
    index: 7,
    padAngle: 0,
    startAngle: 3.141592653589793,
    value: 1,
  };

  before(() => {
    component = (
      <AsterWhiskers
        boundsLowerField="lower"
        boundsUpperField="upper"
        data={datum}
        domainEnd={100}
        innerRadius={123}
        radius={351}
        className="test-whiskers-class-name"
        style={(data) => { return { stroke: (data.value === 1) ? 'blue' : 'red' }; }}
      />
    );
  });

  it('renders a g', () => {
    const wrapper = shallow(component);

    expect(wrapper).to.have.tagName('g');
  });

  it('derives element\'s style by using style as a function', () => {
    const wrapper = shallow(component);

    expect(wrapper).to.have.style('stroke', 'blue');
  });

  it('has the correct className', () => {
    const wrapper = shallow(component);

    expect(wrapper).to.have.className('test-whiskers-class-name');
  });
});
