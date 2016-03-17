import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';

import Button from '../src/button';

chai.use(chaiEnzyme());

describe('<Button/>', () => {
  it('renders a button', () => {
    const wrapper = shallow(<Button />);
    expect(wrapper).to.have.length(1);
    expect(wrapper).to.have.tagName('button');
  });

  it('spreads a list of classes into the button', () => {
    const classes = ['foo', 'bar', 'baz'];
    const wrapper = shallow(<Button classes={classes} />);

    classes.forEach((expectedClass) => {
      expect(wrapper).to.have.className(expectedClass);
    });
  });

  it('renders itself within a label', () => {
    const wrapper = shallow(<Button label="A label" />);
    expect(wrapper).to.have.tagName('label');
    expect(wrapper).to.have.exactly(1).descendants('button');
  });
});
