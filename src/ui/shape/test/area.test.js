import React from 'react';
import Animate from 'react-move/Animate';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { maxBy, minBy } from 'lodash';
import { area, scaleLinear, scalePoint } from 'd3';

import { dataGenerator } from '../../../utils';
import { Area } from '../';

chai.use(chaiEnzyme());

describe('<Area />', () => {
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

  const range = [minBy(data, 'value_lb')[valueField], maxBy(data, 'value_ub')[valueField]];
  const domain = [minBy(data, keyField)[keyField], maxBy(data, keyField)[keyField]];

  const xScale = scalePoint().domain(domain).range([0, chartDimensions.width]);
  const yScale = scaleLinear().domain(range).range([chartDimensions.height, 0]);

  const areaFunction = area()
    .x((datum) => xScale(datum[keyField]))
    .y0((datum) => yScale(datum.value_lb))
    .y1((datum) => yScale(datum.value_ub));

  const expectedPath = areaFunction(data);

  const eventHandler = sinon.spy();

  const sharedProps = {
    data,
    dataAccessors: {
      x: keyField,
      y0: 'value_lb',
      y1: 'value_ub',
    },
    scales: { x: xScale, y: yScale },
    onClick: eventHandler,
    onMouseLeave: eventHandler,
    onMouseMove: eventHandler,
    onMouseOver: eventHandler,
  };

  const components = [
    <Area {...sharedProps} />,
    <Area animate {...sharedProps} />,
  ];

  components.forEach((testComponent) => {
    const animated = testComponent.props.animate ? 'animated' : 'non-animated';

    it(`renders an SVG path node with a d attribute (${animated})`, () => {
      let wrapper = shallow(testComponent);

      // If wrapped in <Animate /> it's necessary to `dive` an additional
      // layer in order to test simulated events consistently.
      if (testComponent.props.animate) {
        wrapper = wrapper.find(Animate).dive();
      }

      const path = wrapper.find('path');
      expect(path).to.have.length(1);
      expect(path).to.have.attr('d', expectedPath);
    });
  });

  describe('events', () => {
    components.forEach((testComponent) => {
      const animated = testComponent.props.animate ? 'animated' : 'non-animated';

      it(`calls onClick, mouseDown, mouseMove, mouseOut, and mouseOver 
      with event, data, and the React element (${animated})`, () => {
        let wrapper = shallow(testComponent);
        const inst = wrapper.instance();
        const event = {
          preventDefault() {
          },
        };

        // If wrapped in <Animate /> it's necessary to `dive` an additional
        // layer in order to test simulated events consistently.
        if (testComponent.props.animate) {
          wrapper = wrapper.find(Animate).dive();
        }

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
