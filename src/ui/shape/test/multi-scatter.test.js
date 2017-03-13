import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';
import { minBy, maxBy, noop, uniqBy, map } from 'lodash';
import { scalePoint, scaleLinear, scaleOrdinal } from 'd3';

import { dataGenerator } from '../../../test-utils';

import { MultiScatter, Scatter } from '../';

chai.use(chaiEnzyme());

describe('<MultiScatter />', () => {
  const chartDimensions = {
    width: 600,
    height: 400
  };

  const dataAccessors = {
    x: 'year_id',
    y: 'population'
  };

  describe('scatter plot of a dataset', () => {
    const data = dataGenerator({
      primaryKeys: [{ name: 'location', values: ['USA', 'Canada', 'Mexico'] }],
      valueKeys: [{ name: 'population', range: [300, 600], uncertainty: false }],
      length: 10
    });

    const scatterData = [
      {
        location: 'USA',
        values: data.filter((datum) => { return datum.location === 'USA'; })
      },
      {
        location: 'Canada',
        values: data.filter((datum) => { return datum.location === 'Canada'; })
      },
      {
        location: 'Mexico',
        values: data.filter((datum) => { return datum.location === 'Mexico'; })
      }
    ];

    const yDomain = [minBy(data, 'population').population, maxBy(data, 'population').population];
    const xDomain = map(uniqBy(data, 'year_id'), (obj) => { return (obj.year_id); });

    const xScale = scalePoint().domain(xDomain).range([0, chartDimensions.width]);
    const yScale = scaleLinear().domain(yDomain).range([chartDimensions.height, 0]);

    const shapeScale = scaleOrdinal()
        .domain(['USA', 'Canada', 'Mexico'])
        .range(['circle', 'star', 'square']);
    const colorScale = scaleOrdinal()
        .domain(['USA', 'Canada', 'Mexico'])
        .range(['red', 'blue', 'green']);

    let component;

    before(() => {
      component = (
        <MultiScatter
          colorScale={colorScale}
          data={scatterData}
          dataAccessors={dataAccessors}
          fieldAccessors={{
            key: 'location',
            data: 'values',
            shape: 'location',
          }}
          focus={data[0]}
          focusedClassName="focused"
          focusedStyle={{ stroke: 'yellow' }}
          onClick={noop}
          onMouseLeave={noop}
          onMouseMove={noop}
          onMouseOver={noop}
          selection={[]}
          selectedClassName="selected"
          selectedStyle={{ stroke: 'red' }}
          scatterClassName="scatter"
          scales={{ x: xScale, y: yScale }}
          shapeClassName="symbol"
          shapeScale={shapeScale}
          shapeStyle={{ fill: 'red' }}
          size={128}
          style={{ strokeWeight: 2 }}
        />
      );
    });

    it('contains 3 scatter plots', () => {
      const wrapper = shallow(component);
      expect(wrapper.find(Scatter)).to.have.length(3);
    });

    it('does not pass specified properties to its children', () => {
      const nonInheritedProps = [
        'scatterClassName',
      ];

      const assertion = (shape) => {
        nonInheritedProps.forEach(prop => {
          expect(shape).to.not.have.prop(prop);
        });
      };

      shallow(component).find(Scatter).forEach(assertion);
    });

    it('passes specified properties to its children', () => {
      const inheritedProps = [
        'className',
        'data',
        'dataAccessors',
        'fill',
        'focus',
        'focusedClassName',
        'focusedStyle',
        'onClick',
        'onMouseLeave',
        'onMouseMove',
        'onMouseOver',
        'selectedClassName',
        'selectedStyle',
        'selection',
        'scales',
        'size',
        'style',
        'shapeClassName',
        'shapeScale',
        'shapeType',
      ];

      const assertion = (shape) => {
        inheritedProps.forEach(prop => {
          expect(shape).to.have.prop(prop);
        });
      };

      shallow(component).find(Scatter).forEach(assertion);
    });
  });
});
