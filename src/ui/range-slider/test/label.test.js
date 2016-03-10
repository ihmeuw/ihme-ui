import React from 'react';
import chai, { expect } from 'chai';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';

chai.use(chaiEnzyme());

import Label from '../src/components/label';

describe('<Label />', () => {
  it('renders an SVG text node', () => {
    const wrapper = shallow(<Label anchor="start" position={{ x: 5, y: 0 }} value={25} />);
    expect(wrapper.find('text')).to.have.length(1);
  });

  it('renders a label that is a number to one fixed-point', () => {
    const wrapper = shallow(
      <Label anchor="start" position={{ x: 5, y: 0, shift: 0 }} value={30.27} />
    );

    expect(wrapper.find('text')).to.have.text('30.3');
  });

  it('renders a label that is a string', () => {
    const wrapper = shallow(
      <Label anchor="start" position={{ x: 5, y: 0, shift: 0 }} value="Years" />
    );

    expect(wrapper.find('text')).to.have.text('Years');
  });

  it('shifts the x position towards origin by shift when anchor==="start"', () => {
    const wrapper = shallow(<Label anchor="start" position={{ x: 20, y: 0, shift: 5 }} />);
    expect(wrapper.find('text')).to.have.attr('x', '15px');
  });

  it('shifts the x position away from the origin by shift when anchor==="end"', () => {
    const wrapper = shallow(<Label anchor="end" position={{ x: 20, y: 0, shift: 5 }} />);
    expect(wrapper.find('text')).to.have.attr('x', '25px');
  });

  it('does not shift the x position by shift when anchor==="middle"', () => {
    const wrapper = shallow(<Label anchor="middle" position={{ x: 20, y: 0, shift: 5 }} />);
    expect(wrapper.find('text')).to.have.attr('x', '20px');
  });
});
