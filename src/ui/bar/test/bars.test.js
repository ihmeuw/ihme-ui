import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';
import drop from 'lodash/drop';
import maxBy from 'lodash/maxBy';
import minBy from 'lodash/minBy';
import map from 'lodash/map';
import uniqBy from 'lodash/uniqBy';
import { scaleLinear, scaleBand } from 'd3';
import { dataGenerator } from '../../../utils';

import { Bars, Bar } from '../';

chai.use(chaiEnzyme());

describe('<Bars />', () => {
  const yearField = 'year_id';
  const populationField = 'population';

  const years = [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009];

  const data = dataGenerator({
    primaryKeys: [{
      name: 'location',
      values: ['India'],
    }],
    valueKeys: [{
      name: populationField,
      range: [100, 900],
      uncertainty: false,
    }],
    year: years[0],
    length: years.length,
  });

  const chartDimensions = {
    width: 600,
    height: 400
  };

  const focus = data[2];
  const selection = [data[1], data[3]];

  const component = (
    <Bars
      categories={years}
      data={data}
      dataAccessors={{
        category: yearField,
        value: populationField,
      }}
      fill="steelblue"
      focus={focus}
      focusedClassName="focused"
      selection={selection}
      selectedClassName="selected"
      selectedStyle={{ stroke: 'aqua' }}
      rectClassName="symbol"
      rectStyle={{ fill: 'bluesteel' }}
      {...chartDimensions}
    />
  );

  it('renders number of bars based on array length of prop `data`', () => {
    const wrapper = shallow(component);
    expect(wrapper.find(Bar)).to.have.length(data.length);
  });

  it('passes specified properties to its children', () => {
    const inheritedProps = [
      'className',
      'focusedClassName',
      'focusedStyle',
      'onClick',
      'onMouseLeave',
      'onMouseMove',
      'onMouseOver',
      'selectedClassName',
      'selectedStyle',
      'style',
    ];

    const assertion = (bar) => {
      inheritedProps.forEach(prop => {
        expect(bar).to.have.prop(prop);
      });
    };

    shallow(component).find(Bar).forEach(assertion);
  });

  it('selects a bar when prop `selection` is passed', () => {
    const wrapper = shallow(component);
    expect(wrapper.find({ selected: true })).to.have.length(selection.length);
  });

  it('focuses on a bar when prop `focused` is passed', () => {
    const wrapper = shallow(component);
    expect(wrapper.find({ focused: true })).to.have.length(1);
  });
});
