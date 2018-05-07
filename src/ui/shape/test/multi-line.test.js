import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';
import { maxBy, minBy, map, uniqBy } from 'lodash';
import { scalePoint, scaleLinear, scaleOrdinal } from 'd3';

import { dataGenerator } from '../../../utils';
import { MultiLine } from '../';

chai.use(chaiEnzyme());

const keyField = 'year_id';
const valueField = 'value';

describe('<MultiLine />', () => {
  const data = dataGenerator({
    primaryKeys: [{ name: keyField, values: [keyField] }],
    valueKeys: [{ name: valueField, range: [100, 200], uncertainty: true }],
    length: 10
  });

  const yDomain = [minBy(data, valueField)[valueField], maxBy(data, valueField)[valueField]];
  const xDomain = map(uniqBy(data, keyField), (obj) => { return (obj[keyField]); });

  const scales = {
    x: scalePoint().domain(xDomain).range([0, 100]),
    y: scaleLinear().domain(yDomain).range([100, 0])
  };

  const colorScale = scaleOrdinal().domain(['USA', 'Canada']).range(['red', 'blue']);

  const lineData = [{ location: 'USA', values: data }, { location: 'Canada', values: data }];

  const lineDataAccessors = { x: keyField, y: valueField };
  const areaDataAccessors = { x: keyField, y0: 'value_lb', y1: 'value_ub' };

  const sharedProps = {
    data: lineData,
    fieldAccessors: {
      key: 'location',
      data: 'values',
    },
    scales,
    colorScale,
  };

  describe('plot of only <Line /> components', () => {
    const testProps = {
      ...sharedProps,
      dataAccessors: lineDataAccessors,
    };

    const components = [
      <MultiLine {...testProps} />,
      <MultiLine animate {...testProps} />,
    ];

    components.forEach((testComponent) => {
      const animated = testComponent.props.animate ? 'animated' : 'non-animated';
      const wrapper = shallow(testComponent);

      it(`renders a g (${animated})`, () => {
        expect(wrapper.find('g')).to.have.length(1);
      });

      it(`renders two <Line /> components (${animated})`, () => {
        expect(wrapper).to.have.exactly(2).descendants('Line');
      });

      it(`passes a subset of its props to child components (${animated})`, () => {
        const child = wrapper.find('Line').first();
        expect(child)
          .to.have.prop('scales')
          .that.is.an('object')
          .that.has.keys(['x', 'y']);

        expect(child).to.not.have.prop('keyField');
      });

      it(`alters styling passed to children when given a color scale (${animated})`, () => {
        const usaLine = wrapper.find('Line').first();
        const caLine = wrapper.find('Line').last();

        expect(usaLine).to.have.style('stroke', colorScale('USA'));
        expect(caLine).to.have.style('stroke', colorScale('Canada'));
      });
    });
  });

  describe('plot of only <Area /> components', () => {
    const testProps = {
      ...sharedProps,
      dataAccessors: areaDataAccessors,
    };

    const components = [
      <MultiLine {...testProps} />,
      <MultiLine animate {...testProps} />,
    ];

    components.forEach((testComponent) => {
      const animated = testComponent.props.animate ? 'animated' : 'non-animated';
      const wrapper = shallow(testComponent);

      it(`renders two <Area /> components (${animated})`, () => {
        expect(wrapper).to.have.exactly(2).descendants('Area');
      });
    });
  });

  describe('plot of both <Line /> and <Area /> components', () => {
    const testProps = {
      ...sharedProps,
      dataAccessors: { ...lineDataAccessors, ...areaDataAccessors },
    };

    const components = [
      <MultiLine {...testProps} />,
      <MultiLine animate {...testProps} />,
    ];

    components.forEach((testComponent) => {
      const animated = testComponent.props.animate ? 'animated' : 'non-animated';
      const wrapper = shallow(testComponent);

      it(`renders two <Line /> and two <Area /> components (${animated})`, () => {
        expect(wrapper).to.have.exactly(2).descendants('Line');
        expect(wrapper).to.have.exactly(2).descendants('Area');
      });
    });
  });

  describe('plot of neither <Line /> nor <Area />', () => {
    const testProps = {
      ...sharedProps,
      dataAccessors: { x: keyField },
    };

    const components = [
      <MultiLine {...testProps} />,
      <MultiLine animate {...testProps} />,
    ];

    components.forEach((testComponent) => {
      const animated = testComponent.props.animate ? 'animated' : 'non-animated';
      const wrapper = shallow(testComponent);

      it(`render neither <Line /> nor <Area /> components (${animated})`, () => {
        expect(wrapper).to.not.have.descendants('Line');
        expect(wrapper).to.not.have.descendants('Area');
      });
    });
  });

  describe('passes specified properties to its children', () => {
    it('passes specified properties to its children', () => {
      const inheritedProps = [
        'animate',
        'onClick',
        'onMouseLeave',
        'onMouseMove',
        'onMouseOver',
      ];

      const wrapper = shallow((
        <MultiLine
          {...sharedProps}
          dataAccessors={{ ...lineDataAccessors, ...areaDataAccessors }}
        />
      ));

      wrapper.find('line').forEach((shape) => {
        inheritedProps.forEach((prop) => {
          expect(shape).to.have.prop(prop);
        });
      });
    });
  });
});
