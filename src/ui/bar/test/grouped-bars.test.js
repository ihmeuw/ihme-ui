import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';
import maxBy from 'lodash/maxBy';
import noop from 'lodash/noop';
import { schemeCategory10, scaleLinear, scaleBand, scaleOrdinal } from 'd3';
import { dataGenerator } from '../../../utils';

import {
  Bar,
  GroupedBars,
} from '..';

chai.use(chaiEnzyme());

describe('<GroupedBars />', () => {
  const yearField = 'year_id';
  const populationField = 'population';
  const locationField = 'location';

  const years = [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007];
  const locations = [
    'Brazil',
    'Russia',
    'India',
    'China',
    'Mexico',
    'Indonesia',
    'Nigeria',
    'Vietnam',
  ];

  const data = dataGenerator({
    primaryKeys: [{
      name: 'location',
      values: locations,
    }],
    valueKeys: [{
      name: populationField,
      range: [100, 900],
      uncertainty: true
    }],
    year: years[0],
    length: years.length,
  });

  const chartDimensions = {
    width: 600,
    height: 400,
  };

  const dataRange = [0, maxBy(data, populationField)[populationField]];
  const colorScale = scaleOrdinal(schemeCategory10);

  const domainScale = scaleBand()
    .domain(locations)
    .range([0, chartDimensions.width]);
  const rangeScale = scaleLinear()
    .domain(dataRange)
    .range([chartDimensions.height, 0]);

  const component = (
    <GroupedBars
      categories={locations}
      subcategories={years}
      data={data}
      dataAccessors={{
        category: locationField,
        subcategory: yearField,
        value: populationField,
      }}
      rectClassName="grouped-bars"
      fill={(datum) => colorScale(datum[yearField])}
      focusedClassName="focused"
      focusedStyle={{ stroke: 'yellow' }}
      focus={data[0]}
      onClick={noop}
      onMouseLeave={noop}
      onMouseMove={noop}
      onMouseOver={noop}
      selectedClassName="selected"
      selectedStyle={{ stroke: 'red' }}
      style={{ strokeWeight: 2 }}
      {...chartDimensions}
    />
  );

  // TODO :
  //   Q: If scales are passed, what props can we do without? If scales aren't passed, what additional props are required?
  //   test that it can render with scales
  //   test that it determines positioning correctly

  it('renders number of a `Bar` for each element in `data`', () => {
    const wrapper = shallow(component);
    expect(wrapper.find(Bar)).to.have.length(data.length);
  });

  it('passes specified properties to its children', () => {
    const childProps = [
      'x',
      'y',
      'height',
      'width',
      'datum',
      'className',
      'fill',
      'style',
      'focused',
      'focusedClassName',
      'focusedStyle',
      'selected',
      'selectedClassName',
      'selectedStyle',
      'onClick',
      'onMouseLeave',
      'onMouseMove',
      'onMouseOver',
    ];

    shallow(component).find(Bar).forEach((bar) => {
      childProps.forEach(prop => {
        expect(bar).to.have.prop(prop);
      });
    });
  });
});
