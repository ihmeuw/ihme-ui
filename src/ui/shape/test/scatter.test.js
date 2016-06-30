import React from 'react';

import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';

import { minBy, maxBy, uniqBy, map } from 'lodash';

import d3Scale from 'd3-scale';

import { dataGenerator } from '../../../test-utils';

import { Scatter, Symbol } from '../';

chai.use(chaiEnzyme());

describe('<Scatter />', () => {
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
      primaryKeys: [{ name: 'location', values: ['USA'] }],
      valueKeys: [{ name: 'population', range: [300, 600], uncertainty: false }],
      length: 10
    });

    const yDomain = [minBy(data, 'population').population, maxBy(data, 'population').population];
    const xDomain = map(uniqBy(data, 'year_id'), (obj) => { return (obj.year_id); });

    const xScale = d3Scale.scalePoint().domain(xDomain).range([0, chartDimensions.width]);
    const yScale = d3Scale.scaleLinear().domain(yDomain).range([chartDimensions.height, 0]);

    let component;

    before(() => {
      component = (
        <Scatter
          data={data}
          focus={data[2]}
          scales={{ x: xScale, y: yScale }}
          selection={[data[1], data[3]]}
          symbolType={'circle'}
          color={'red'}
          dataAccessors={dataAccessors}
        />
      );
    });

    it('contains 10 shapes', () => {
      const wrapper = shallow(component);
      expect(wrapper.find(Symbol)).to.have.length(10);
    });

    it('does not pass specific properties to its children', () => {
      const symbol = shallow(component).find(Symbol).first();
      const assertion = (prop) => {
        expect(symbol).to.not.have.prop(prop);
      };

      ['scales', 'symbolType', 'dataAccessors'].forEach(assertion);
    });

    it('does pass some properties to its children', () => {
      const symbol = shallow(component).find(Symbol).first();
      const assertion = (prop) => {
        expect(symbol).to.have.prop(prop);
      };

      ['data', 'type', 'translateX', 'translateY', 'color'].forEach(assertion);
    });

    it('selects a symbol', () => {
      const wrapper = shallow(component);
      expect(wrapper.find({ selected: true })).to.have.length(2);
    });

    it('focuses a symbol', () => {
      const wrapper = shallow(component);
      expect(wrapper.find({ focused: true })).to.have.length(1);
    });
  });
});
