import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';
import { drop, minBy, maxBy, uniqBy, map } from 'lodash';
import { scaleLinear, scaleBand } from 'd3';
import { dataGenerator } from '../../../utils';

import { Bars, Bar } from '../';

chai.use(chaiEnzyme());

describe('<Bars />', () => {
  const yearField = 'year_id';
  const populationField = 'population';

  const data = dataGenerator({
    primaryKeys: [
      { name: 'location', values: ['Brazil', 'Russia', 'India', 'China', 'Mexico',
        'Indonesia', 'Nigeria', 'Vietnam'] }
    ],
    valueKeys: [
      { name: populationField, range: [100, 900], uncertainty: true }
    ]
  });

  const chartDimensions = {
    width: 600,
    height: 400
  };

  const populationFieldDomain =
    [minBy(data, populationField)[populationField], maxBy(data, populationField)[populationField]];
  const yearFieldDomain = map(uniqBy(data, yearField), (obj) => { return (obj[yearField]); });

  const ordinalScale = scaleBand().domain(yearFieldDomain).range([0, chartDimensions.width]);
  const linearScale =
    scaleLinear().domain(populationFieldDomain).range([chartDimensions.height, 0]);

  const dataAccessors = {
    key: 'id',
    stack: yearField,
    value: populationField
  };

  const dataFiltered = data.filter((datum) => { return datum.location === 'India'; });

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

  it('renders 10 bar', () => {
    const wrapper = shallow(component);
    expect(wrapper.find(Bar)).to.have.length(10);
  });

  it('does not pass specific properties to its children', () => {
    const nonInheritedProps = [
      'bandPadding',
      'bandPaddingInner',
      'bandPaddingOuter',
      'categoryTranslate',
      'colorScale',
      'clipPathId',
      'data',
      'dataAccessors',
      'focus',
      'height',
      'layerOrdinal',
      'orientation',
      'scales',
      'selection',
      'rectClassName',
      'rectStyle',
      'stacked',
      'grouped',
    ];

    const assertion = (bar) => {
      nonInheritedProps.forEach(prop => {
        expect(bar).to.not.have.prop(prop);
      });
    };

    shallow(component).find(Bar).forEach(assertion);
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

  it('selects a bar', () => {
    const wrapper = shallow(component);
    expect(wrapper.find({ selected: true })).to.have.length(2);
  });

  it('focuses a bar', () => {
    const wrapper = shallow(component);
    expect(wrapper.find({ focused: true })).to.have.length(1);
  });

  it('has correct values for the rendering props', () => {
    const assertion = (bar) => {
      expect(bar).to.have.prop('fill').that.is.a('string');
      expect(bar).to.have.prop('x').that.is.a('number');
      expect(bar).to.have.prop('y').that.is.a('number');
      expect(bar).to.have.prop('rectHeight').that.is.a('number');
      expect(bar).to.have.prop('rectWidth').that.is.a('number');
    };
    shallow(component).find(Bar).forEach(assertion);
  });

  describe('selection', () => {
    it('renders selected bar last', () => {
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
        .first()
        .prop('datum')
      ).to.not.equal(selectedDatum);
      expect(wrapper
        .find('g')
        .find(Bar)
        .last()
        .prop('datum')
      ).to.equal(selectedDatum);
    });

    it('does a stable sort of the bar', () => {
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

      wrapper.find('g').find(Bar).forEach((node, idx) => {
        expect(node.prop('datum')).to.equal(dataFiltered[idx]);
      });

      const selectedDatum = dataFiltered[0];
      wrapper.setProps({ selection: [selectedDatum] });
      const expectedBarOrder = drop(dataFiltered);
      expectedBarOrder.push(selectedDatum);

      wrapper.find('g').find(Bar).forEach((node, idx) => {
        expect(node.prop('datum')).to.equal(expectedBarOrder[idx]);
      });
    });

    it(`does not update state.sortedData
        if neither selection nor data have changed`, () => {
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
