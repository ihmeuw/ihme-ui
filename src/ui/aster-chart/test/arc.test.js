import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { mount, shallow } from 'enzyme';

import AsterArc from '../src/arc';

chai.use(chaiEnzyme());

describe('<AsterChart />', () => {
  let component;
  const d = 'M-3,78,35,0,0,1,-342,-78,-27,123,0,0,0,-120,27';

  before(() => {
    component = (
      <AsterArc
        className="test-class-name"
        classNameSelected="test-class-name-selected"
        d={d}
        datum={{}}
        fill="red"
        selected
        style={{ fill: 'blue' }}
        styleSelected={{ fill: 'black' }}
      />
    );
  });

  it('renders a path', () => {
    const wrapper = shallow(component);

    expect(wrapper).to.have.tagName('path');
  });

  it('has a regular className', () => {
    const wrapper = shallow(component);

    expect(wrapper.hasClass('test-class-name')).to.equal(true);
  });

  it('has a selected className', () => {
    const wrapper = shallow(component);

    expect(wrapper.hasClass('test-class-name-selected')).to.equal(true);
  });

  it('has a computed style', () => {
    const wrapper = mount(component);

    expect(wrapper).to.have.style('fill', 'black');
  });
});
