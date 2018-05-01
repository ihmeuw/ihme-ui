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
