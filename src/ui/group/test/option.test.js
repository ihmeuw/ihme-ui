import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';

import { Option } from '../';
import styles from '../src/group.css';

chai.use(chaiEnzyme());

describe('<Option />', () => {
  it('renders a button by default', () => {
    const wrapper = shallow(<Option key={1} text="One" value="1" />);

    expect(wrapper).to.have.exactly(1).descendants('Button');
  });

  it('renders another type of element', () => {
    const Component = () => { return <a />; };
    const wrapper = shallow(<Option type={Component} />);
    expect(wrapper).to.have.exactly(1).descendants('Component');
  });

  describe('styles', () => {
    it('applies disabled styles, when disabled', () => {
      const wrapper = shallow(
        <Option disabledStyle={{ opacity: '0.5' }} disabled />
      );
      expect(wrapper).to.have.style('opacity', '0.5');
    });

    it('does not apply disabled styles, when not disabled', () => {
      const wrapper = shallow(
        <Option disabledStyle={{ opacity: '0.5' }} />
      );
      expect(wrapper).to.not.have.style('opacity', '0.5');
    });

    it('applies disabled styles, when disabled prop is changed', () => {
      const wrapper = shallow(
        <Option disabledStyle={{ opacity: '0.5' }} />
      );
      expect(wrapper).to.not.have.style('opacity', '0.5');
      wrapper.setProps({ disabled: true });
      expect(wrapper).to.have.style('opacity', '0.5');
      wrapper.setProps({ disabled: false });
      expect(wrapper).to.not.have.style('opacity', '0.5');
    });
  });

  describe('classNames', () => {
    it('applies default disabled style, when disabled', () => {
      const wrapper = shallow(
        <Option disabled />
      );
      expect(wrapper).to.have.className(styles.disabled);
    });

    it('applies provided disabled style, when disabled', () => {
      const wrapper = shallow(
        <Option disabledClassName="disabled-test" disabled />
      );
      expect(wrapper).to.have.className('disabled-test');
      expect(wrapper).to.not.have.className(styles.disabled);
    });
  });
});
