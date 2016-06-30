import React from 'react';

import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';

import Ticks from '../src/ticks';

chai.use(chaiEnzyme());

describe('<Ticks />', () => {
  it('renders an svg with correct number of `lines`', () => {
    const wrapper = shallow(
      <Ticks
        x={[1, 2, 3, 4, 5]}
      />
    );
    expect(wrapper).to.have.attr('width', '100%');
    expect(wrapper).to.have.attr('height', '100%');
    expect(wrapper.find('line')).to.have.length(5);
  });

  it('passes styles to components', () => {
    const wrapper = shallow(
      <Ticks
        style={{ backgroundColor: 'blue' }}
        tickStyle={{ stroke: 'red' }}
        x={[1, 2, 3, 4, 5]}
      />
    );
    expect(wrapper).to.have.style('background-color', 'blue');
    expect(wrapper.find('line').first()).to.have.style('stroke', 'red');
  });
});
