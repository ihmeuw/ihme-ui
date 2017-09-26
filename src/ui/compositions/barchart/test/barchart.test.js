import chai, { expect } from 'chai';
import React from 'react';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';
import {
  maxBy,
  minBy,
  map,
  uniqBy,
  noop,
} from 'lodash';

import { dataGenerator } from '../../../../utils';
import BarChart from '../src/barchart';
import { Legend } from './../../../';


chai.use(chaiEnzyme());

describe('<BarChart />', () => {
  const yearField = 'year_id';
  const populationField = 'population';

  const data = dataGenerator({
    primaryKeys: [
      { name: 'location', values: ['Brazil', 'Russia', 'India', 'China', 'Mexico', 'Indonesia',
        'Nigeria', 'Vietnam'] }
    ],
    valueKeys: [
      { name: populationField, range: [100, 900], uncertainty: true }
    ]
  });

// Should these be passed or calculated from given dataset within the BarChart component?
  const populationFieldDomain =
    [minBy(data, populationField)[populationField], maxBy(data, populationField)[populationField]];
  const yearFieldDomain = map(uniqBy(data, yearField), (obj) => { return (obj[yearField]); });

// create items object for the legend
  const items = [
    {
      label: 'Total Population',
      shapeColor: 'steelblue',
      shapeType: 'square'
    }
  ];

  const component = (
    <BarChart
      data={data.filter((datum) => { return datum.location === 'India'; })}
      dataAccessors={{
        fill: yearField,
        key: 'id',
        stack: yearField,
        value: populationField
      }}
      focus={noop}
      labelObject={{
        title: 'Population In India 2000-2009',
        xLabel: 'Years',
        yLabel: 'Population'
      }}
      legend
      legendKey={{
        labelKey: 'label',
        shapeColorKey: 'shapeColor',
        shapeTypeKey: 'shapeType',
      }}
      legendObject={items}
      scaleObject={{
        xDomain: yearFieldDomain,
        yDomain: populationFieldDomain,
        xScale: 'band',
        yScale: 'linear'
      }}
      onClick={noop}
      onMouseLeave={noop}
      onMouseMove={noop}
      onMouseOver={noop}
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
      .to.have.text('Population In India 2000-2009');
  });

  // Subsequent test are covered by each individual component itself
});
