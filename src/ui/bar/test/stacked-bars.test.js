import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';
import noop from 'lodash/noop';
import { schemeCategory10, scaleOrdinal } from 'd3';
import { dataGenerator } from '../../../utils';

import {
  Bar,
  StackedBars,
} from '..';

chai.use(chaiEnzyme());

describe('<StackedBars />', () => {
  const chartDimensions = {
    width: 600,
    height: 400,
  };

  // used to compute fill color
  const colorScale = scaleOrdinal(schemeCategory10);

  // stacks
  const categoryField = 'location';
  const categories = ['Brazil', 'Russia'];
  // layers
  const subcategoryField = 'year_id';
  const subcategories = [2016, 2017, 2018];

  const valueField = 'population';

  const data = dataGenerator({
    primaryKeys: [{
      name: categoryField,
      values: categories,
    }],
    valueKeys: [{
      name: valueField,
      range: [100, 900],
      uncertainty: false,
    }],
    year: subcategories[0],
    length: subcategories.length,
  });

  const focus = data[0];
  const selection = [data[1], data[2]];

  const component = (
    <StackedBars
      categories={categories}
      subcategories={subcategories}
      data={data}
      dataAccessors={{
        category: categoryField,
        subcategory: subcategoryField,
        value: valueField,
      }}
      fill={(datum) => colorScale(datum[subcategoryField])}
      className="bars"
      style={{ strokeWeight: 2 }}
      rectClassName="bar"
      rectStyle={{ opacity: 0.9 }}
      focus={focus}
      focusedClassName="focused"
      focusedStyle={{ stroke: 'yellow' }}
      selection={selection}
      selectedClassName="selected"
      selectedStyle={{ stroke: 'red' }}
      onClick={noop}
      onMouseLeave={noop}
      onMouseMove={noop}
      onMouseOver={noop}
      {...chartDimensions}
    />
  );

  it('renders a `Bar` component for each element in `data`', () => {
    const wrapper = shallow(component);
    expect(wrapper.find(Bar)).to.have.length(data.length);
  });

  it('passes specified properties to its descendant `Bar` components', () => {
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

  it('focuses on a `Bar` whose `datum` prop matches the value of prop `focus`', () => {
    const wrapper = shallow(component);
    const focusedBar = wrapper.find(Bar).filter({
      focused: true,
      datum: focus,
    });
    expect(focusedBar).to.have.length(1);
  });

  it('selects every `Bar` whose `datum` prop is included in prop `selection`', () => {
    const wrapper = shallow(component);
    const selectedBars = wrapper.find(Bar).filter({ selected: true });
    expect(selectedBars).to.have.length(selection.length);
  });
});
