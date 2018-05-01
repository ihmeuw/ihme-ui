import React from 'react';
import Animate from 'react-move/Animate';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { mount, shallow } from 'enzyme';
import sinon from 'sinon';
import { maxBy, minBy } from 'lodash';
import { line, scalePoint, scaleLinear } from 'd3';

import { dataGenerator } from '../../../utils';
import { Line } from '../';

chai.use(chaiEnzyme());

describe('<Line />', () => {
  const keyField = 'year_id';
  const valueField = 'value';
  const chartDimensions = {
    width: 600,
    height: 400,
  };

  const data = dataGenerator({
    primaryKeys: [{ name: keyField, values: [keyField] }],
    valueKeys: [{ name: valueField, range: [100, 200], uncertainty: true }],
    length: 10,
  });

  const range = [minBy(data, valueField)[valueField], maxBy(data, valueField)[valueField]];
  const domain = [minBy(data, keyField)[keyField], maxBy(data, keyField)[keyField]];

  const xScale = scalePoint().domain(domain).range([0, chartDimensions.width]);
  const yScale = scaleLinear().domain(range).range([chartDimensions.height, 0]);

  const eventHandler = sinon.spy();

  const lineFunction = line()
    .x((datum) => xScale(datum[keyField]))
    .y((datum) => yScale(datum[valueField]));

  const expectedPath = lineFunction(data);

  const sharedProps = {
    className: 'base-classname',
    data,
    scales: { x: xScale, y: yScale },
    dataAccessors: { x: keyField, y: valueField },
    onClick: eventHandler,
    onMouseLeave: eventHandler,
    onMouseMove: eventHandler,
    onMouseOver: eventHandler,
    style: {
      stroke: 'red',
      strokeWidth: '10',
    },
  };

  const additionalProps = {
    stroke: 'blue',
    strokeWidth: 1000,
  };

  const components = [
    <Line {...sharedProps} />,
    <Line animate {...sharedProps} />,
  ];

  describe('renders', () => {
    components.forEach((testComponent) => {
      const animated = testComponent.props.animate ? 'animated' : 'non-animated';
      const wrapper = mount(testComponent);

      it(`SVG path node with a d attribute (${animated})`, () => {
        const path = wrapper.find('path');

        expect(path).to.have.length(1);
        expect(path).to.have.attr('d', expectedPath);
      });

      it(`applies a base classname (${animated})`, () => {
        expect(wrapper).to.have.className(sharedProps.className);
      });

      it(`applies style as an object (${animated})`, () => {
        expect(wrapper).to.have.style('stroke', sharedProps.style.stroke);
        expect(wrapper).to.have.style('stroke-width', sharedProps.style.strokeWidth);
      });
    });
  });

  describe('dataProcessor', () => {
    const result1 = Line.dataProcessor(sharedProps, sharedProps.data);

    const result2 = Line.dataProcessor(
      { ...sharedProps, ...additionalProps },
      sharedProps.data
    );

    it('returns calculated d attribute based on data accessors', () => {
      // Close to above test, but intended to target `Line.dataProcessor` as a unit.
      expect(result1.d).to.equal(expectedPath);
    });

    it('returns processed `stroke`, `strokeWidth` properties', () => {
      // Nested in prop `style`
      expect(result1.stroke).to.equal(sharedProps.style.stroke);
      expect(result1.strokeWidth).to.equal(sharedProps.style.strokeWidth);
      // From flat props `stroke`, `strokeWidth`
      expect(result2.stroke).to.equal(additionalProps.stroke);
      expect(result2.strokeWidth).to.equal(additionalProps.strokeWidth);
    });
  });

  describe('processStyle', () => {
    it('combines props `style`, `stroke`, `strokeWidth`', () => {
      const result1 = Line.processStyle(sharedProps.style, additionalProps);
      const result2 = Line.processStyle(
        sharedProps.style,
        { stroke: additionalProps.stroke },
      );

      // Flat props of `additionalProps` override those of `style`
      expect(result1.stroke).to.equal(additionalProps.stroke);
      expect(result1.strokeWidth).to.equal(additionalProps.strokeWidth);

      // `stroke` overrides, while `strokeWidth` remains from `style`
      expect(result2.stroke).to.equal(additionalProps.stroke);
      expect(result2.strokeWidth).to.equal(sharedProps.style.strokeWidth);
    });
  });

  describe('events', () => {
    components.forEach((testComponent) => {
      const animated = testComponent.props.animate ? 'animated' : 'non-animated';

      it(`calls onClick, mouseLeave, mouseMove, and mouseOver with
      the browser event, the data prop, and the React element (${animated})`, () => {
        let wrapper = shallow(testComponent);
        const inst = wrapper.instance();

        // If wrapped in <Animate /> it's necessary to `dive` an additional
        // layer in order to test simulated events consistently.
        if (testComponent.props.animate) {
          wrapper = wrapper.find(Animate).dive();
        }

        const event = {
          preventDefault() {},
        };

        ['click', 'mouseLeave', 'mouseMove', 'mouseOver'].forEach((evtName) => {
          eventHandler.reset();
          wrapper.simulate(evtName, event);
          expect(eventHandler.calledOnce).to.be.true;
          expect(eventHandler.calledWith(event, data, inst)).to.be.true;
        });
      });
    });
  });
});
