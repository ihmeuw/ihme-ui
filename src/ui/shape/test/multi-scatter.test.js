import React from 'react';

import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';

import { minBy, maxBy, uniqBy, map } from 'lodash';

import d3Scale from 'd3-scale';

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

    const xScale = d3Scale.scalePoint().domain(xDomain).range([0, chartDimensions.width]);
    const yScale = d3Scale.scaleLinear().domain(yDomain).range([chartDimensions.height, 0]);

    const symbolScale = d3Scale.scaleOrdinal()
        .domain(['USA', 'Canada', 'Mexico'])
        .range(['circle', 'star', 'square']);
    const colorScale = d3Scale.scaleOrdinal()
        .domain(['USA', 'Canada', 'Mexico'])
        .range(['red', 'blue', 'green']);

    let component;

    before(() => {
      component = (
        <MultiScatter
          data={scatterData}
          keyField={'location'}
          dataField={'values'}
          symbolField={'location'}
          symbolScale={symbolScale}
          colorScale={colorScale}
          scales={{ x: xScale, y: yScale }}
          dataAccessors={dataAccessors}
        />
      );
    });

    it('contains 3 scatter plots', () => {
      const wrapper = shallow(component);
      expect(wrapper.find(Scatter)).to.have.length(3);
    });

    it('does not pass specific properties to its children', () => {
      const scatter = shallow(component).find(Scatter).first();
      const assertion = (prop) => {
        expect(scatter).to.not.have.prop(prop);
      };

      ['keyField', 'dataField', 'symbolField', 'symbolScale', 'colorScale'].forEach(assertion);
    });

    it('does pass some properties to its children', () => {
      const scatter = shallow(component).find(Scatter).first();
      const assertion = (prop) => {
        expect(scatter).to.have.prop(prop);
      };

      ['data', 'scales', 'dataAccessors'].forEach(assertion);
    });
  });
});
