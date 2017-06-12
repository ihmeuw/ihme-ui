import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';
import kebabCase from 'lodash/kebabCase';

import { Option } from '../';
import styles from '../src/option.css';

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
    const tests = [
      {
        prop: 'disabled',
        style: { disabledStyle: { opacity: '0.5' } },
      },
      {
        prop: 'selected',
        style: { selectedStyle: { fontWeight: 'bold' } },
      },
    ];

    tests.forEach(test => {
      const [stylePropName] = Object.keys(test.style);
      const [inlineStyleName] = Object.keys(test.style[stylePropName]);
      const kebabedInlineStyleName = kebabCase(inlineStyleName);
      const inlineStyleValue = test.style[stylePropName][inlineStyleName];

      it(`applies ${stylePropName} when ${test.prop}`, () => {
        const wrapper = shallow(<Option {...test.style} {...{ [test.prop]: true }} />);

        expect(wrapper).to.have.style(kebabedInlineStyleName, inlineStyleValue);
      });

      it(`does not apply ${stylePropName} when not ${test.prop}`, () => {
        const wrapper = shallow(<Option {...test.style} />);

        expect(wrapper).to.not.have.style(kebabedInlineStyleName, inlineStyleValue);
      });

      it(`toggles ${stylePropName} when ${test.prop} prop is toggled`, () => {
        const wrapper = shallow(<Option {...test.style} />);

        expect(wrapper).to.not.have.style(kebabedInlineStyleName, inlineStyleValue);
        wrapper.setProps({ [test.prop]: true });
        expect(wrapper).to.have.style(kebabedInlineStyleName, inlineStyleValue);
        wrapper.setProps({ [test.prop]: false });
        expect(wrapper).to.not.have.style(kebabedInlineStyleName, inlineStyleValue);
      });
    });
  });

  describe('classNames', () => {
    const tests = [
      { prop: 'disabled', className: { disabledClassName: 'foo' } },
      { prop: 'selected', className: { selectedClassName: 'bar' } },
    ];

    tests.forEach(test => {
      const [classNamePropName] = Object.keys(test.className);

      it(`applies default ${classNamePropName} when ${test.prop}`, () => {
        const wrapper = shallow(<Option {...{ [test.prop]: true }} />);

        expect(wrapper).to.have.className(styles[test.prop]);
      });

      it(`applies provided ${classNamePropName} when ${test.prop}`, () => {
        const wrapper = shallow(<Option {...test.className} {...{ [test.prop]: true }} />);

        expect(wrapper).to.have.className(test.className[classNamePropName]);
        expect(wrapper).to.not.have.className(styles[test.prop]);
      });
    });
  });

  describe('props', () => {
    it('passes non-Option props down to whatever element it renders', () => {
      const wrapper = shallow(
        <Option foo="bar" />
      );
      expect(wrapper.find('Button')).to.have.prop('foo', 'bar');
    });

    it('does not pass Option props down to whatever element it renders', () => {
      const wrapper = shallow(
        <Option selectedStyle={{ display: 'none' }} />
      );
      expect(wrapper.find('Button')).to.have.not.have.prop('selectedStyle');
    });
  });
});
