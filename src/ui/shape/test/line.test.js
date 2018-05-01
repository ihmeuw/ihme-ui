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
    data,
    scales: { x: xScale, y: yScale },
    dataAccessors: { x: keyField, y: valueField },
    onClick: eventHandler,
    onMouseLeave: eventHandler,
    onMouseMove: eventHandler,
    onMouseOver: eventHandler,
  };


  const components = [
    <Line {...sharedProps} />,
    <Line animate {...sharedProps} />,
  ];

  describe('renders', () => {
    components.forEach((testComponent) => {
      const animated = testComponent.props.animate ? 'animated' : 'non-animated';

      it(`an SVG path node with a d attribute (${animated})`, () => {
        const wrapper = mount(testComponent);
        const path = wrapper.find('path');

        expect(path).to.have.length(1);
        expect(path).to.have.attr('d', expectedPath);
      });
    });
  });

  describe('styling', () => {
    const baseStyle = {
      stroke: 'red',
      strokeWidth: 10,
    };

    it('applies style as an object', () => {
      const wrapper = shallow(
        <Line
          data={data}
          scales={{ x: xScale, y: yScale }}
          dataAccessors={{ x: keyField, y: valueField }}
          style={baseStyle}
        />
      );

      expect(wrapper).to.have.style('stroke', 'red');
      expect(wrapper).to.have.style('stroke-width', '10');
    });
  });

  describe('classnames', () => {
    const wrapper = shallow(
      <Line
        className="base-classname"
        data={data}
        scales={{ x: xScale, y: yScale }}
        dataAccessors={{ x: keyField, y: valueField }}
      />
    );

    it('applies a base classname', () => {
      expect(wrapper).to.have.className('base-classname');
    });
  });

  describe('events', () => {
    components.forEach((testComponent) => {
      const animated = testComponent.props.animate ? 'animated' : 'non-animated';

      it(`calls onClick, mouseLeave, mouseMove, and mouseOver with
      the browser event, the data prop, and the React element (${animated})`, () => {
        let wrapper = shallow(testComponent);
        const inst = wrapper.instance();
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
