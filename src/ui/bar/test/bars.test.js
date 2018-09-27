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

  const chartDimensions = {
    width: 600,
    height: 400
  };

  const populationFieldDomain = [
    minBy(data, populationField)[populationField],
    maxBy(data, populationField)[populationField]
  ];
  const yearFieldDomain = map(uniqBy(data, yearField), obj => obj[yearField]);

  const ordinalScale = scaleBand()
    .domain(yearFieldDomain)
    .range([0, chartDimensions.width]);
  const linearScale = scaleLinear()
    .domain(populationFieldDomain)
    .range([chartDimensions.height, 0]);

  const dataAccessors = {
    key: 'id',
    stack: yearField,
    value: populationField
  };

  const dataFiltered = data.filter(datum => datum.location === 'India');

  const component = (
    <Bars
      data={dataFiltered}
      dataAccessors={dataAccessors}
      scales={{ x: ordinalScale, y: linearScale }}
      fill="steelblue"
      focus={dataFiltered[2]}
      focusedClassName="focused"
      selection={[dataFiltered[1], dataFiltered[3]]}
      selectedClassName="selected"
      selectedStyle={{ stroke: 'aqua' }}
      rectClassName="symbol"
      rectStyle={{ fill: 'bluesteel' }}
      {...chartDimensions}
    />
  );

  it('renders number of bars based on array length of prop `data`', () => {
    const wrapper = shallow(component);
    expect(wrapper.find(Bar)).to.have.length(10);
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

  it('selects on a bar when prop `selection` is passed', () => {
    const wrapper = shallow(component);
    expect(wrapper.find({ selected: true })).to.have.length(2);
  });

  it('focuses on a bar when prop `focused` is passed', () => {
    const wrapper = shallow(component);
    expect(wrapper.find({ focused: true })).to.have.length(1);
  });

  describe('selection', () => {
    it('when the prop `selection` is passed to Bars its associated bar is the final bar to render', () => {
      const selectedDatum = dataFiltered[0];

      const wrapper = shallow(
        <Bars
          data={dataFiltered}
          dataAccessors={{
            key: (d) => d.id,
            stack: (d) => d.year_id,
            value: (d) => d.population,
          }}
          scales={{
            x: ordinalScale,
            y: linearScale,
          }}
        />
      );

      expect(wrapper
        .find('g')
        .find(Bar)
        .first()
        .prop('datum')
      ).to.equal(selectedDatum);
      wrapper.setProps({ selection: [selectedDatum] });
      expect(wrapper
        .find('g')
        .find(Bar)
        .last()
        .prop('datum')
      ).to.equal(selectedDatum);
    });

    it('when the prop `selection` is passed, Bars does a stable sort of the bars', () => {
      const wrapper = shallow(
        <Bars
          data={dataFiltered}
          dataAccessors={{
            key: (d) => d.id,
            stack: (d) => d.year_id,
            layer: (d) => d.population,
          }}
          scales={{
            x: ordinalScale,
            y: linearScale,
          }}
        />
      );

      const selectedDatum = dataFiltered[0];
      const postSelectionExpectedBarOrder = drop(dataFiltered);
      postSelectionExpectedBarOrder.push(selectedDatum);

      wrapper.find('g').find(Bar).forEach((node, idx) => {
        expect(node.prop('datum')).to.equal(dataFiltered[idx]);
      });

      wrapper.setProps({ selection: [selectedDatum] });

      wrapper.find('g').find(Bar).forEach((node, idx) => {
        expect(node.prop('datum')).to.equal(postSelectionExpectedBarOrder[idx]);
      });
    });

    it('does not update state.sortedData if neither selection nor data have changed', () => {
      const wrapper = shallow(
        <Bars

          data={dataFiltered}
          dataAccessors={{
            key: (d) => d.id,
            stack: (d) => d.year_id,
            value: (d) => d.population,
          }}
          scales={{
            x: ordinalScale,
            y: linearScale,
          }}
        />
      );

      const initialState = wrapper.state('sortedData');
      expect(initialState).to.deep.equal(dataFiltered);
      wrapper.update();
      expect(initialState).to.equal(wrapper.state('sortedData'));
    });
  });
});
