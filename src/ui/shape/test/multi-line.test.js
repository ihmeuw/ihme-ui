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
    const wrapper = shallow((
      <MultiLine
        {...sharedProps}
        dataAccessors={lineDataAccessors}
      />
    ));

    it('renders a g', () => {
      expect(wrapper.find('g')).to.have.length(1);
    });

    it('renders two <Line /> components', () => {
      expect(wrapper).to.have.exactly(2).descendants('Line');
    });

    it('passes a subset of its props to child components', () => {
      const child = wrapper.find('Line').first();
      expect(child)
        .to.have.prop('scales')
        .that.is.an('object')
        .that.has.keys(['x', 'y']);

      expect(child).to.not.have.prop('keyField');
    });

    it('alters styling passed to children when given a color scale', () => {
      const usaLine = wrapper.find('Line').first();
      const caLine = wrapper.find('Line').last();

      expect(usaLine).to.have.style('stroke', colorScale('USA'));
      expect(caLine).to.have.style('stroke', colorScale('Canada'));
    });
  });

  describe('plot of only <Area /> components', () => {
    const wrapper = shallow((
      <MultiLine
        {...sharedProps}
        dataAccessors={areaDataAccessors}
      />
    ));

    it('renders two <Area /> components', () => {
      expect(wrapper).to.have.exactly(2).descendants('Area');
    });
  });

  describe('plot of both <Line /> and <Area /> components', () => {
    const wrapper = shallow((
      <MultiLine
        {...sharedProps}
        dataAccessors={{ ...lineDataAccessors, ...areaDataAccessors }}
      />
    ));

    it('renders two <Line /> and two <Area /> components', () => {
      expect(wrapper).to.have.exactly(2).descendants('Line');
      expect(wrapper).to.have.exactly(2).descendants('Area');
    });
  });

  describe('plot of neither <Line /> nor <Area />', () => {
    const wrapper = shallow((
      <MultiLine
        {...sharedProps}
        dataAccessors={{ x: keyField }}
      />
    ));

    it('render neither <Line /> nor <Area /> components', () => {
      expect(wrapper).to.not.have.descendants('Line');
      expect(wrapper).to.not.have.descendants('Area');
    });
  });
});
