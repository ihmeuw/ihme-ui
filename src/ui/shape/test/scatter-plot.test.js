import React from 'react';

import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';

import { minBy, maxBy, uniqBy, map } from 'lodash';

import d3Scale from 'd3-scale';

import { dataGenerator } from '../../../test-utils';
import { ScatterPlot, Symbol } from '../';

chai.use(chaiEnzyme());

describe('<ScatterPlot />', () => {
  const keyField = 'year_id';
  const valueField = 'value';
  const chartDimensions = {
    width: 600,
    height: 400
  };

  const usaData = dataGenerator({
    keyField,
    valueField,
    length: 10,
    dataQuality: 'best',
    useDates: true
  });

  const canadaData = dataGenerator({
    keyField,
    valueField,
    length: 10,
    dataQuality: 'best',
    useDates: true
  });

  const scatterData = [
    { location: 'USA', values: usaData },
    { location: 'Canada', values: canadaData }
  ];

  const data = [...usaData, ...canadaData];
  const yDomain = [minBy(data, valueField)[valueField], maxBy(data, valueField)[valueField]];
  const xDomain = map(uniqBy(data, keyField), (obj) => { return (obj[keyField]); });

  const xScale = d3Scale.scalePoint().domain(xDomain).range([0, chartDimensions.width]);
  const yScale = d3Scale.scaleLinear().domain(yDomain).range([chartDimensions.height, 0]);

  const symbolScale = d3Scale.scaleOrdinal().domain(['USA', 'Canada']).range(['circle', 'star']);
  const colorScale = d3Scale.scaleOrdinal().domain(['USA', 'Canada']).range(['red', 'blue']);

  const dataAccessors = {
    x: keyField,
    y: valueField
  };

  let component;

  before(() => {
    component = (
      <ScatterPlot
        data={scatterData}
        scales={{ x: xScale, y: yScale }}
        colorScale={colorScale}
        dataAccessors={dataAccessors}
        keyField={'location'}
        dataField={'values'}
        symbolField={'location'}
        symbolScale={symbolScale}
      />
    );
  });

  it('returns a g', () => {
    const wrapper = shallow(component);

    expect(wrapper).to.have.tagName('g');
  });

  it('contains about 20 shapes', () => {
    const wrapper = shallow(component);

    expect(wrapper.find(Symbol)).to.have.length(20);
  });

  it('does not pass specific properties to its children', () => {
    const symbol = shallow(component).find(Symbol).first();
    const assertion = (prop) => {
      expect(symbol).to.not.have.prop(prop);
    };

    ['keyField', 'dataField', 'symbolField', 'symbolScale', 'dataAccessors'].forEach(assertion);
  });

  it('does pass some properties to its children', () => {
    const symbol = shallow(component).find(Symbol).first();
    const assertion = (prop) => {
      expect(symbol).to.have.prop(prop);
    };

    ['data', 'type', 'position', 'color'].forEach(assertion);
  });

  it('passes a color to its children', () => {
    const wrapper = shallow(component);
    const usaPoint = wrapper.find(Symbol).first();
    const caPoint = wrapper.find(Symbol).last();

    expect(usaPoint)
      .to.have.prop('color', colorScale('USA'));

    expect(caPoint)
      .to.have.prop('color', colorScale('Canada'));
  });
});
