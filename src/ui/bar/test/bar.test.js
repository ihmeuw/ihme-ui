import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzme from 'chai-enzyme';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import { Bar } from '../';

chai.use(chaiEnzme());

describe('<Bar />', () => {
  it('renders a svg rect element that represents one bar given properties', () => {
    const wrapper = shallow(
      <Bar
        x={0}
        y={0}
        height={10}
        width={10}
      />
    );

    expect(wrapper.find('rect'))
      .to.have.attr('fill');
  });

  describe('styling', () => {
    const datum = {
      mean: 10,
    };

    const baseStyle = {
      fill: 'steelblue',
      stroke: 'red',
      strokeWidth: 10,
    };

    const selectedStyle = {
      stroke: 'white',
      strokeWidth: 20,
    };

    const focusedStyle = {
      stroke: 'blue',
    };

    it('accepts an object as prop `style`', () => {
      const wrapper = shallow(
        <Bar
          datum={datum}
          style={baseStyle}
        />
      );

      expect(wrapper.find('rect'))
        .to.have.style('stroke', 'red');
      expect(wrapper.find('rect'))
        .to.have.style('stroke-width', '10');
    });

    it('accepts a function as prop `style`', () => {
      const wrapper = shallow(
        <Bar
          datum={datum}
          style={(d) => ({ stroke: 'red', strokeWidth: d.mean })}
        />
      );

      expect(wrapper.find('rect'))
        .to.have.style('stroke', 'red');
      expect(wrapper.find('rect'))
        .to.have.style('stroke-width', '10');
    });

    it('accepts an object as prop `selectedStyle`', () => {
      const wrapper = shallow(
        <Bar
          datum={datum}
          style={baseStyle}
          selected
          selectedStyle={selectedStyle}
        />
      );

      expect(wrapper.find('rect'))
        .to.have.style('stroke', 'white');
      expect(wrapper.find('rect'))
        .to.have.style('stroke-width', '20');
    });

    it('accepts a function as prop `selectedStyle`', () => {
      const wrapper = shallow(
        <Bar
          datum={datum}
          style={baseStyle}
          selected
          selectedStyle={(d) => ({ stroke: 'white', strokeWidth: d.mean * 2 })}
        />
      );

      expect(wrapper.find('rect'))
        .to.have.style('stroke', 'white');
      expect(wrapper.find('rect'))
        .to.have.style('stroke-width', '20');
    });

    it('accepts an object as prop `focusedStyle`', () => {
      const wrapper = shallow(
        <Bar
          datum={datum}
          focused
          focusedStyle={focusedStyle}
          style={baseStyle}
          selected
          selectedStyle={selectedStyle}
        />
      );

      expect(wrapper.find('rect'))
        .to.have.style('stroke', 'blue');
      expect(wrapper.find('rect'))
        .to.have.style('stroke-width', '20');
    });

    it('accepts a function as prop `focusedStyle`', () => {
      const wrapper = shallow(
        <Bar
          datum={datum}
          focused
          focusedStyle={() => ({ stroke: 'blue' })}
          style={baseStyle}
          selected
          selectedStyle={selectedStyle}
        />
      );

      expect(wrapper.find('rect'))
        .to.have.style('stroke', 'blue');
      expect(wrapper.find('rect'))
        .to.have.style('stroke-width', '20');
    });
  });

  describe('classnames', () => {
    const classNames = {
      base: 'base-classname',
      focused: 'focused-classname',
      selected: 'selected-classname'
    };

    const wrapper = shallow(
      <Bar
        className={classNames.base}
        focusedClassName={classNames.focused}
        selectedClassName={classNames.selected}
      />
    );

    it('applies a base classname', () => {
      expect(wrapper.find('rect'))
        .to.have.className(classNames.base);
    });

    it('applies a selectedClassName if the shape is selected', () => {
      wrapper.setProps({ selected: true });
      expect(wrapper.find('rect'))
        .to.have.className(classNames.base);
      expect(wrapper.find('rect'))
        .to.have.className(classNames.selected);
    });

    it('applies a focusedClassName if the shape has focus', () => {
      wrapper.setProps({ focused: true });
      expect(wrapper.find('rect'))
        .to.have.className(classNames.base);
      expect(wrapper.find('rect'))
        .to.have.className(classNames.selected);
      expect(wrapper.find('rect'))
        .to.have.className(classNames.focused);
    });
  });

  describe('events', () => {
    const eventHandler = sinon.spy();

    it(`calls onClick, mouseDown, mouseMove, mouseOut, and mouseOver 
    with event, locationId, and the React element`, () => {
      const datum = {
        mean: 10
      };

      const wrapper = shallow(
        <Bar
          datum={datum}
          onClick={eventHandler}
          onMouseLeave={eventHandler}
          onMouseMove={eventHandler}
          onMouseOver={eventHandler}
        />
      );

      const event = {
        preventDefault() {}
      };

      const inst = wrapper.instance();
      ['click', 'mouseLeave', 'mouseMove', 'mouseOver'].forEach((eventName) => {
        eventHandler.reset();
        wrapper.find('rect').simulate(eventName, event);
        expect(eventHandler.calledOnce).to.be.true;
        expect(eventHandler.calledWith(event, datum, inst)).to.be.true;
      });
    });
  });
});
