import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { symbol, symbolCircle } from 'd3';

import { Shape } from '../';

chai.use(chaiEnzyme());

describe('<Shape />', () => {
  it('renders any shape that is supported by d3Shape.symbol', () => {
    const assertion = (type) => {
      const wrapper = shallow(<Shape shapeType={type} />);
      expect(wrapper).to.have.exactly(1).descendants('path');
      expect(wrapper.find('path'))
        .to.have.attr('d')
        .that.is.a('string');
    };

    ['circle', 'cross', 'diamond', 'square', 'star', 'triangle', 'wye'].forEach(assertion);
  });

  it('renders a circle when given a type that is not supported by d3Shape.symbol', () => {
    const wrapper = shallow(<Shape shapeType="unicorn" />);
    expect(wrapper).to.have.exactly(1).descendants('path');
    expect(wrapper.find('path'))
      .to.have.attr('d')
      .that.is.a('string')
      .that.equals(symbol().type(symbolCircle)());
  });

  it('applies a rotate modifier when appropriate', () => {
    const wrapper = shallow(<Shape shapeType="triangle down" />);
    expect(wrapper.find('path'))
      .to.have.attr('transform')
      .that.equals('translate(0, 0) rotate(180)');
  });

  it('does not apply a rotate modifier when appropriate', () => {
    const wrapper = shallow(<Shape shapeType="triangle" />);
    expect(wrapper.find('path'))
      .to.have.attr('transform')
      .that.equals('translate(0, 0) rotate(0)');
  });

  describe('styling', () => {
    const datum = {
      mean: 10,
    };

    const baseStyle = {
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

    it('applies style as an object', () => {
      const wrapper = shallow(
        <Shape
          datum={datum}
          style={baseStyle}
        />
      );

      expect(wrapper).to.have.style('stroke', 'red');
      expect(wrapper).to.have.style('stroke-width', '10');
    });

    it('applies style as a function', () => {
      const wrapper = shallow(
        <Shape
          datum={datum}
          style={(d) => ({ stroke: 'red', strokeWidth: d.mean })}
        />
      );

      expect(wrapper).to.have.style('stroke', 'red');
      expect(wrapper).to.have.style('stroke-width', '10');
    });

    it('applies selectedStyle as an object', () => {
      const wrapper = shallow(
        <Shape
          datum={datum}
          style={baseStyle}
          selected
          selectedStyle={selectedStyle}
        />
      );

      expect(wrapper).to.have.style('stroke', 'white');
      expect(wrapper).to.have.style('stroke-width', '20');
    });

    it('applies selectedStyle as a function', () => {
      const wrapper = shallow(
        <Shape
          datum={datum}
          style={baseStyle}
          selected
          selectedStyle={(d) => ({ stroke: 'white', strokeWidth: d.mean * 2 })}
        />
      );

      expect(wrapper).to.have.style('stroke', 'white');
      expect(wrapper).to.have.style('stroke-width', '20');
    });

    it('applies focusedStyle as an object', () => {
      const wrapper = shallow(
        <Shape
          datum={datum}
          focused
          focusedStyle={focusedStyle}
          style={baseStyle}
          selected
          selectedStyle={selectedStyle}
        />
      );

      expect(wrapper).to.have.style('stroke', 'blue');
      expect(wrapper).to.have.style('stroke-width', '20');
    });

    it('applies focusedStyle as a function', () => {
      const wrapper = shallow(
        <Shape
          datum={datum}
          focused
          focusedStyle={() => ({ stroke: 'blue' })}
          style={baseStyle}
          selected
          selectedStyle={selectedStyle}
        />
      );

      expect(wrapper).to.have.style('stroke', 'blue');
      expect(wrapper).to.have.style('stroke-width', '20');
    });
  });

  describe('classnames', () => {
    const wrapper = shallow(
      <Shape
        className="base-classname"
        focusedClassName="focused-classname"
        selectedClassName="selected-classname"
      />
    );

    it('applies a base classname', () => {
      expect(wrapper).to.have.className('base-classname');
    });

    it('applies a selectedClassName if the shape is selected', () => {
      wrapper.setProps({ selected: true });
      expect(wrapper).to.have.className('base-classname');
      expect(wrapper).to.have.className('selected-classname');
    });

    it('applies a focusedClassName if the shape has focus', () => {
      wrapper.setProps({ focused: true });
      expect(wrapper).to.have.className('base-classname');
      expect(wrapper).to.have.className('selected-classname');
      expect(wrapper).to.have.className('focused-classname');
    });
  });

  describe('events', () => {
    const eventHandler = sinon.spy();

    it(`calls onClick, mouseDown, mouseMove, mouseOut, and mouseOver 
    with event, locationId, and the React element`, () => {
      const datum = { mean: 10 };
      const wrapper = shallow(
        <Shape
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
      ['click', 'mouseLeave', 'mouseMove', 'mouseOver'].forEach((evtName) => {
        eventHandler.reset();
        wrapper.simulate(evtName, event);
        expect(eventHandler.calledOnce).to.be.true;
        expect(eventHandler.calledWith(event, datum, inst)).to.be.true;
      });
    });
  });


});
