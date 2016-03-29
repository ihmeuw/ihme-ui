import React from 'react';

import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';

import Button from '../src/button';
import Spinner from '../../spinner';

chai.use(chaiEnzyme());

describe('<Button />', () => {
  it('renders a button', () => {
    const wrapper = shallow(<Button />);
    expect(wrapper).to.have.length(1);
    expect(wrapper).to.have.tagName('button');
  });

  it('spreads a list of classes into the button', () => {
    const classes = ['foo', 'bar', 'baz'];
    const wrapper = shallow(<Button className={classes} />);

    classes.forEach((expectedClass) => {
      expect(wrapper).to.have.className(expectedClass);
    });
  });

  it('shows a spinner when showSpinner is true', () => {
    const wrapper = shallow(<Button showSpinner />);
    expect(wrapper).to.contain(<Spinner size="small" />);
  });

  it('displays text', () => {
    const wrapper = shallow(<Button text="A text" />);
    expect(wrapper).to.have.text('A text');
  });

  it('displays an icon', () => {
    const wrapper = shallow(<Button icon="image.png" />);
    expect(wrapper).to.have.exactly(1).descendants('img');
  });

  it('displays an icon and text', () => {
    const wrapper = shallow(<Button icon="image.png" text="A text" />);
    expect(wrapper).to.have.exactly(1).descendants('img')
      .and.to.have.text('A text');
  });

  it('shows a spinner instead of icon', () => {
    const wrapper = shallow(<Button icon="image.png" showSpinner />);
    expect(wrapper).to.contain(<Spinner size="small" />)
      .and.to.not.have.descendants('img');
  });
});
