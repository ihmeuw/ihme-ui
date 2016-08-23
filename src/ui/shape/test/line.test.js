import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { maxBy, minBy } from 'lodash';
import d3Scale from 'd3-scale';
import { line } from 'd3-shape';

import { dataGenerator } from '../../../test-utils';
import { Line } from '../';

chai.use(chaiEnzyme());

describe('<Line />', () => {
  const keyField = 'year_id';
  const valueField = 'value';
  const chartDimensions = {
    width: 600,
    height: 400
  };

  const data = dataGenerator({
    primaryKeys: [{ name: keyField, values: [keyField] }],
    valueKeys: [{ name: valueField, range: [100, 200], uncertainty: true }],
    length: 10
  });

  let component;

  const range = [minBy(data, valueField)[valueField], maxBy(data, valueField)[valueField]];
  const domain = [minBy(data, keyField)[keyField], maxBy(data, keyField)[keyField]];

  const xScale = d3Scale.scalePoint().domain(domain).range([0, chartDimensions.width]);
  const yScale = d3Scale.scaleLinear().domain(range).range([chartDimensions.height, 0]);

  const eventHandler = sinon.spy();

  const lineFunction = line()
    .x((datum) => xScale(datum[keyField]))
    .y((datum) => yScale(datum[valueField]));

  const expectedPath = lineFunction(data);

  before(() => {
    component = (
      <Line
        data={data}
        scales={{ x: xScale, y: yScale }}
        dataAccessors={{ x: keyField, y: valueField }}
        onClick={eventHandler}
        onMouseLeave={eventHandler}
        onMouseMove={eventHandler}
        onMouseOver={eventHandler}
      />
    );
  });

  it('renders an SVG path node with a d attribute', () => {
    const wrapper = shallow(component);
    const path = wrapper.find('path');

    expect(path).to.have.length(1);
    expect(path).to.have.attr('d', expectedPath);
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

    it('applies style as a function', () => {
      const wrapper = shallow(
        <Line
          data={data}
          scales={{ x: xScale, y: yScale }}
          dataAccessors={{ x: keyField, y: valueField }}
          style={(d) => ({ stroke: 'red', strokeWidth: d[0][valueField] })}
        />
      );

      expect(wrapper).to.have.style('stroke', 'red');
      expect(wrapper).to.have.style('stroke-width', String(data[0][valueField]));
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
    it(`calls onClick, mouseLeave, mouseMove, and mouseOver with
    the browser event, the data prop, and the React element`, () => {
      const wrapper = shallow(component);
      const event = {
        preventDefault() {}
      };
      const inst = wrapper.instance();

      ['click', 'mouseLeave', 'mouseMove', 'mouseOver'].forEach((evtName) => {
        eventHandler.reset();
        wrapper.simulate(evtName, event);
        expect(eventHandler.calledOnce).to.be.true;
        expect(eventHandler.calledWith(event, data, inst)).to.be.true;
      });
    });
  });
});
