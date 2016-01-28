import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import Label from '../src/components/label';

describe('<Label />', () => {
  it('renders an SVG text node', () => {
    const wrapper = shallow(<Label anchor="start" position={{ x: 5 }} value={25} />);
    expect(wrapper.find('text')).to.have.length(1);
  });

  it('renders a label that is a number to one fixed-point', () => {
    const wrapper = shallow(<Label anchor="start" position={{ x: 5, shift: 0 }} value={30.27} />);
    expect(wrapper.find('text').html()).to.equal(
      `<text text-anchor="start" fill="black" x="5">30.3</text>`
    );
  });

  it('renders a label that is a string', () => {
    const wrapper = shallow(<Label anchor="start" position={{ x: 5, shift: 0 }} value="Years" />);
    expect(wrapper.find('text').html()).to.equal(
      `<text text-anchor="start" fill="black" x="5">Years</text>`
    );
  });

  it('shifts the x position towards origin by shift when anchor==="start"', () => {
    const wrapper = shallow(<Label anchor="start" position={{ x: 20, shift: 5 }} />);
    expect(wrapper.find('text').html()).to.equal(
      `<text text-anchor="start" fill="black" x="15"></text>`
    );
  });

  it('shifts the x position away from the origin by shift when anchor==="end"', () => {
    const wrapper = shallow(<Label anchor="end" position={{ x: 20, shift: 5 }} />);
    expect(wrapper.find('text').html()).to.equal(
      `<text text-anchor="end" fill="black" x="25"></text>`
    );
  });

  it('does not shift the x position by shift when anchor==="middle"', () => {
    const wrapper = shallow(<Label anchor="middle" position={{ x: 20, shift: 5 }} />);
    expect(wrapper.find('text').html()).to.equal(
      `<text text-anchor="middle" fill="black" x="20"></text>`
    );
  });
});
