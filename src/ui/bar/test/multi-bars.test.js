import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';
import { minBy, maxBy, uniqBy, map, noop } from 'lodash';
import { schemeCategory10, scaleLinear, scaleBand, scaleOrdinal } from 'd3';
import { dataGenerator } from '../../../utils';

import { MultiBars, Bars } from '../';

chai.use(chaiEnzyme());

describe('<MultiBars />', () => {
  const yearField = 'year_id';
  const populationField = 'population';
  const locationField = 'location';

  const data = dataGenerator({
    primaryKeys: [
      { name: 'location', values: ['Brazil', 'Russia', 'India', 'China', 'Mexico', 'Indonesia', 'Nigeria', 'Vietnam'] }
    ],
    valueKeys: [
      { name: populationField, range: [100, 900], uncertainty: true }
    ]
  });

  const locationData = [
    { location: 'Brazil', values: data.filter((datum) => { return datum.location === 'Brazil'; }) },
    { location: 'Russia', values: data.filter((datum) => { return datum.location === 'Russia'; }) },
    { location: 'India', values: data.filter((datum) => { return datum.location === 'India'; }) },
    { location: 'China', values: data.filter((datum) => { return datum.location === 'China'; }) },
    { location: 'Mexico', values: data.filter((datum) => { return datum.location === 'Mexico'; }) },
    { location: 'Indonesia', values: data.filter((datum) => { return datum.location === 'Indonesia'; }) },
    { location: 'Nigeria', values: data.filter((datum) => { return datum.location === 'Nigeria'; }) },
    { location: 'Vietnam', values: data.filter((datum) => { return datum.location === 'Vietnam'; }) }
  ];

  const chartDimensions = {
    width: 600,
    height: 400,
  };

  const populationFieldDomain = [minBy(data, populationField)[populationField], maxBy(data, populationField)[populationField]];
  const yearFieldDomain = map(uniqBy(data, yearField), (obj) => { return (obj[yearField]); });
  const locationFieldDomain = map(uniqBy(locationData, locationField), (obj) => { return (obj[locationField]); });
  const colorScale = scaleOrdinal(schemeCategory10);


  const ordinalScale = scaleBand().domain(locationFieldDomain).range([0, chartDimensions.width]);
  const linearScale = scaleLinear().domain(populationFieldDomain).range([chartDimensions.height, 0]);

  const dataAccessors = {
    fill: yearField,
    key: 'id',
    stack: locationField,
    layer: yearField,
    value: populationField,
  };

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
      scales={{ x: ordinalScale, y: linearScale}}
      shapeClassName="symbol"
      style={{ strokeWeight: 2 }}
      stacked
      {...chartDimensions}
    />
  );

  it('renders 10 bars', () => {
    const wrapper = shallow(component);
    expect(wrapper.find(Bars)).to.have.length(10);
  });

  it('does not pass specified properties to its children', () => {
    const nonInheritedProps = [
      'barsClassName',
      'barsStyle',
      'className',
      'clipPathId',
      'fieldAccessors',
    ];

    const assertion = (bars) => {
      nonInheritedProps.forEach(prop => {
        expect(bars).to.not.have.prop(prop);
      });
    };

    shallow(component).find(Bars).forEach(assertion);
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
