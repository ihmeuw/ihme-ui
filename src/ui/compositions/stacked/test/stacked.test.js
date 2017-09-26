import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';
import { schemeCategory10, scaleOrdinal } from 'd3';
import {
  maxBy,
  minBy,
  map,
  uniqBy,
  noop,
} from 'lodash';

import StackedBarChart from './../src/stacked';
import { Legend } from './../../../';

import { dataGenerator } from '../../../../utils';


chai.use(chaiEnzyme());

describe('<StackedBarChart />', () => {
  const yearField = 'year_id';
  const populationField = 'population';
  const locationField = 'location';

  const data = dataGenerator({
    primaryKeys: [
      { name: 'location', values: ['Brazil', 'Russia', 'India', 'China', 'Mexico'] }
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
    { location: 'Mexico', values: data.filter((datum) => { return datum.location === 'Mexico'; }) }
  ];

// Should these be passed or calculated from given dataset within the BarChart component?
  const populationFieldDomain =
    [minBy(data, populationField)[populationField], maxBy(data, populationField)[populationField]];
  const yearFieldDomain = map(uniqBy(data, yearField), (obj) => { return (obj[yearField]); });
  const locationFieldDomain =
    map(uniqBy(locationData, locationField), (obj) => { return (obj[locationField]); });
  const colorScale = scaleOrdinal(schemeCategory10);

// create items given the data and the fields specified
  const items = [
    {
      label: '2000',
      shapeColor: colorScale('2000'),
      shapeType: 'square'
    },
    {
      label: '2001',
      shapeColor: colorScale('2001'),
      shapeType: 'square'
    },
    {
      label: '2002',
      shapeColor: colorScale('2002'),
      shapeType: 'square'
    },
    {
      label: '2003',
      shapeColor: colorScale('2003'),
      shapeType: 'square'
    },
    {
      label: '2004',
      shapeColor: colorScale('2004'),
      shapeType: 'square'
    },
    {
      label: '2005',
      shapeColor: colorScale('2005'),
      shapeType: 'square'
    },
    {
      label: '2006',
      shapeColor: colorScale('2006'),
      shapeType: 'square'
    },
    {
      label: '2007',
      shapeColor: colorScale('2007'),
      shapeType: 'square'
    },
    {
      label: '2008',
      shapeColor: colorScale('2008'),
      shapeType: 'square'
    },
    {
      label: '2009',
      shapeColor: colorScale('2009'),
      shapeType: 'square'
    }
  ];

  const component = (
    <StackedBarChart
      data={locationData}
      dataAccessors={{
        fill: yearField,
        key: 'id',
        stack: locationField,
        layer: yearField,
        value: populationField,
      }}
      colorScale={colorScale}
      fieldAccessors={{
        data: 'values',
        key: 'key',
      }}
      focus={noop}
      labelObject={{
        title: 'Population Between 2000-2009',
        yLabel: 'Country',
        xLabel: 'Population'
      }}
      layerDomain={yearFieldDomain}
      legend
      legendObject={items}
      legendKey={{
        labelKey: 'label',
        shapeColorKey: 'shapeColor',
        shapeTypeKey: 'shapeType',
      }}
      onClick={noop}
      onMouseLeave={noop}
      onMouseMove={noop}
      onMouseOver={noop}
      orientation="horizontal"
      scaleObject={{
        xScale: 'linear',
        yScale: 'band',
        xDomain: populationFieldDomain,
        yDomain: locationFieldDomain
      }}
      selection={noop}
      titleClassName={'title-class'}
    />
  );

  it('renders a legend', () => {
    const wrapper = shallow(component);
    expect(wrapper.find(Legend)).to.have.length(1);
  });

  it('renders appropriate chart title', () => {
    const wrapper = shallow(component);
    expect(wrapper.find('.title-class'))
      .to.have.text('Population Between 2000-2009');
  });

  // Subsequent test are covered by each individual component itself
});
