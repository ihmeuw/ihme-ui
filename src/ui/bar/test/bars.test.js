import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';
import noop from 'lodash/noop';
import { dataGenerator } from '../../../utils';

import {
  Bar,
  Bars,
} from '../';

chai.use(chaiEnzyme());

describe('<Bars />', () => {
  const yearField = 'year_id';
  const populationField = 'population';

  const years = [2016, 2017, 2018];

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

  const focus = data[0];
  const selection = [data[1], data[2]];

  const component = (
    <Bars
      categories={years}
      data={data}
      dataAccessors={{
        category: yearField,
        value: populationField,
      }}
      fill="steelblue"
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
    const inheritedProps = [
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

    const assertion = (bar) => {
      inheritedProps.forEach(prop => {
        expect(bar).to.have.prop(prop);
      });
    };

    shallow(component).find(Bar).forEach(assertion);
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
