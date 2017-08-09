import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzme from 'chai-enzyme';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import { Bar } from '../';

chai.use(chaiEnzme());

describe('<Bar />', () => {
  it('renders a svg rect element that represents one bar',  () => {
    const wrapper = shallow( <Bar /> );
    expect(wrapper).to.have.descendants('g');
    expect(wrapper).to.have.descendants('rect');
    expect(wrapper.find('rect'))
      .to.have.attr('fill'); // checks default props of fill is there
  });

  it('renders a svg rect element that represents one bar given properties', () => {
    const wrapper = shallow(
      <Bar
        x={0}
        y={0}
        rectheight={10}
        rectWidth={10}
      />
    );
    expect(wrapper).to.have.descendants('g');
    expect(wrapper).to.have.descendants('rect');
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

    it('applies style as an object', () => {
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

    it('applies style as a function', () => {
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

    it('applies selectedStyle as an object', () => {
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

    it('applies selectedStyle as a function', () => {
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

    it('applies focusedStyle as an object', () => {
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

    it('applies focusedStyle as a function', () => {
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

  describe('classnames',  () => {
    const wrapper = shallow(
      <Bar
        className="base-classname"
        focusedClassName="focused-classname"
        selectedClassName="selected-classname"
      />
    );

    it('applies a base classname', () => {
      expect(wrapper.find('rect'))
        .to.have.className('base-classname');
    });

    it('applies a selectedClassName if the shape is selected', () => {
      wrapper.setProps({ selected: true });
      expect(wrapper.find('rect'))
        .to.have.className('base-classname');
      expect(wrapper.find('rect'))
        .to.have.className('selected-classname');
    });

    it('applies a focusedClassName if the shape has focus', () => {
      wrapper.setProps({ focused: true });
      expect(wrapper.find('rect'))
        .to.have.className('base-classname');
      expect(wrapper.find('rect'))
        .to.have.className('selected-classname');
      expect(wrapper.find('rect'))
        .to.have.className('focused-classname');
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
      ['click', 'mouseLeave', 'mouseMove', 'mouseOver'].forEach((evtName) => {
        eventHandler.reset();
        wrapper.find('rect').simulate(evtName, event);
        expect(eventHandler.calledOnce).to.be.true;
        expect(eventHandler.calledWith(event, datum, inst)).to.be.true;
      });
    });
  });

});
