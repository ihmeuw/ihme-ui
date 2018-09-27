import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';
import groupBy from 'lodash/groupBy';
import maxBy from 'lodash/maxBy';
import minBy from 'lodash/minBy';
import map from 'lodash/map';
import noop from 'lodash/noop';
import uniqBy from 'lodash/uniqBy';
import { schemeCategory10, scaleLinear, scaleBand, scaleOrdinal } from 'd3';
import { dataGenerator } from '../../../utils';

import { MultiBars, Bars } from '../';

chai.use(chaiEnzyme());

describe('<MultiBars />', () => {
  const yearField = 'year_id';
  const populationField = 'population';
  const locationField = 'location';

  const data = dataGenerator({
    primaryKeys: [{
      name: 'location',
      values: ['Brazil', 'Russia', 'India', 'China', 'Mexico', 'Indonesia', 'Nigeria', 'Vietnam']
    }],
    valueKeys: [{
      name: populationField,
      range: [100, 900],
      uncertainty: true
    }]
  });

  const dataGroupedByLocation = groupBy(data, 'location');

  const locationData = [
    { location: 'Brazil', values: dataGroupedByLocation.Brazil },
    { location: 'Russia', values: dataGroupedByLocation.Russia },
    { location: 'India', values: dataGroupedByLocation.India },
    { location: 'China', values: dataGroupedByLocation.China },
    { location: 'Mexico', values: dataGroupedByLocation.Mexico },
    { location: 'Indonesia', values: dataGroupedByLocation.Indonesia },
    { location: 'Nigeria', values: dataGroupedByLocation.Nigeria },
    { location: 'Vietnam', values: dataGroupedByLocation.Vietnam },
  ];

  const chartDimensions = {
    width: 600,
    height: 400,
  };

  const populationFieldDomain = [
    minBy(data, populationField)[populationField],
    maxBy(data, populationField)[populationField]
  ];
  const yearFieldDomain = map(uniqBy(data, yearField), obj => obj[yearField]);
  const locationFieldDomain = map(uniqBy(locationData, locationField), obj => obj[locationField]);
  const colorScale = scaleOrdinal(schemeCategory10);


  const ordinalScale = scaleBand()
    .domain(locationFieldDomain)
    .range([0, chartDimensions.width]);
  const linearScale = scaleLinear()
    .domain(populationFieldDomain)
    .range([chartDimensions.height, 0]);

  const component = (
    <MultiBars
      colorScale={colorScale}
      data={locationData}
      dataAccessors={{
        fill: yearField,
        key: 'id',
        stack: locationField,
        layer: yearField,
        value: populationField,
      }}
      fieldAccessors={{
        data: 'values',
        key: 'key',
      }}
      focusedClassName="focused"
      focusedStyle={{ stroke: 'yellow' }}
      focus={noop}
      onClick={noop}
      onMouseLeave={noop}
      onMouseMove={noop}
      onMouseOver={noop}
      selectedClassName="selected"
      selectedStyle={{ stroke: 'red' }}
      scatterClassName="scatter"
      scatterStyle={{ pointerEvents: 'none' }}
      layerDomain={yearFieldDomain}
      scales={{ x: ordinalScale, y: linearScale }}
      shapeClassName="symbol"
      style={{ strokeWeight: 2 }}
      stacked
      {...chartDimensions}
    />
  );

  it('renders number of bars based on array length of prop `data`', () => {
    const wrapper = shallow(component);
    expect(wrapper.find(Bars)).to.have.length(10);
  });

  it('passes specified properties to its children', () => {
    const inheritedProps = [
      'colorScale',
      'dataAccessors',
      'focus',
      'focusedClassName',
      'focusedStyle',
      'height',
      'layerOrdinal',
      'layerDomain',
      'onClick',
      'onMouseLeave',
      'onMouseMove',
      'onMouseOver',
      'orientation',
      'selectedClassName',
      'selectedStyle',
      'scales',
    ];

    const assertion = (bars) => {
      inheritedProps.forEach(prop => {
        expect(bars).to.have.prop(prop);
      });
    };

    shallow(component).find(Bars).forEach(assertion);
  });
});
