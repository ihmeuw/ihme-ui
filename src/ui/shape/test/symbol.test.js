import React from 'react';

import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';
import d3Shape from 'd3-shape';

import { Symbol } from '../';

chai.use(chaiEnzyme());

describe('<Symbol />', () => {
  it('renders any shape that is supported by d3Shape.symbol', () => {
    const assertion = (type) => {
      const wrapper = shallow(<Symbol type={type} />);
      expect(wrapper).to.have.exactly(1).descendants('path');
      expect(wrapper.find('path'))
        .to.have.attr('d')
        .that.is.a('string');
    };

    ['circle', 'cross', 'diamond', 'square', 'star', 'triangle', 'wye'].forEach(assertion);
  });

  it('renders a circle when given a type that is not supported by d3Shape.symbol', () => {
    const wrapper = shallow(<Symbol type={'unicorn'} />);
    expect(wrapper).to.have.exactly(1).descendants('path');
    expect(wrapper.find('path'))
      .to.have.attr('d')
      .that.is.a('string')
      .that.equals(d3Shape.symbol().type(d3Shape.symbolCircle)());
  });

  it('has #000 stroke when selected', () => {
    const wrapper = shallow(
      <Symbol
        selected={1}
      />
    );
    expect(wrapper.props().stroke).to.equal('#000');
  });
});
