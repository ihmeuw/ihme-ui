import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';
import { schemeCategory10, scaleOrdinal } from 'd3';
import groupBy from 'lodash/groupBy';
import maxBy from 'lodash/maxBy';
import minBy from 'lodash/minBy';
import map from 'lodash/map';
import uniqBy from 'lodash/uniqBy';
import noop from 'lodash/noop';
import StackedBarChart from './../src/stacked';
import { Legend } from './../../../';
import { dataGenerator } from '../../../../utils';


chai.use(chaiEnzyme());

describe('<StackedBarChart />', () => {
  const yearField = 'year_id';
  const populationField = 'population';
  const locationField = 'location';
  const title = 'Population Between 2000-2009';

  const data = dataGenerator({
    primaryKeys: [{
      name: 'location',
      values: ['Brazil', 'Russia', 'India', 'China', 'Mexico']
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
    { location: 'Mexico', values: dataGroupedByLocation.Mexico }
  ];

  const populationFieldDomain = [
    minBy(data, populationField)[populationField],
    maxBy(data, populationField)[populationField]
  ];
  const yearFieldDomain = map(uniqBy(data, yearField), obj => obj[yearField]);
  const locationFieldDomain = map(uniqBy(locationData, locationField), obj => obj[locationField]);
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
      displayLegend
      colorScale={colorScale}
      fieldAccessors={{
        data: 'values',
        key: 'key',
      }}
      focus={noop}
      labelAccessors={{
        title,
        yLabel: 'Country',
        xLabel: 'Population'
      }}
      layerDomain={yearFieldDomain}
      legendAccessors={items}
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
      scaleAccessors={{
        xScale: 'linear',
        yScale: 'band',
        xDomain: populationFieldDomain,
        yDomain: locationFieldDomain
      }}
      selection={noop}
      titleClassName={'title-class'}
      type={'stacked'}
    />
  );

  it('renders a legend', () => {
    const wrapper = shallow(component);
    expect(wrapper.find(Legend)).to.have.length(1);
  });

  it('renders appropriate chart title', () => {
    const wrapper = shallow(component);
    expect(wrapper.find('.title-class'))
      .to.have.text(title);
  });

  // Subsequent test are covered by each individual component itself
});
