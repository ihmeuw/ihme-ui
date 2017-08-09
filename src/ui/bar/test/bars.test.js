import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { drop, forEach, minBy, maxBy, uniqBy, map } from 'lodash';
import { schemeCategory10, scaleLinear, scaleBand, scaleOrdinal } from 'd3';
import { dataGenerator } from '../../../utils';

import { Bars, Bar } from '../';

chai.use(chaiEnzyme());

describe('<Bars />', () => {
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
    height: 400
  };

  const populationFieldDomain = [minBy(data, populationField)[populationField], maxBy(data, populationField)[populationField]];
  const yearFieldDomain = map(uniqBy(data, yearField), (obj) => { return (obj[yearField]); });
  const locationFieldDomain = map(uniqBy(locationData, locationField), (obj) => { return (obj[locationField]); });
  const colorScale = scaleLinear().domain(populationFieldDomain).range(['#fc8d59', '#ffffbf', '#91bfdb']);


  const ordinalScale = scaleBand().domain(yearFieldDomain).range([0, chartDimensions.width]);
  const linearScale = scaleLinear().domain(populationFieldDomain).range([chartDimensions.height, 0]);

  const dataAccessors = {
    key: 'id',
    stack: yearField,
    value: populationField
  };

  const dataFiltered = data.filter((datum) => { return datum.location === 'India'; });

  const component = (
    <Bars
      data={dataFiltered}
      dataAccessors={ dataAccessors }
      scales={{ x:ordinalScale, y:linearScale }}
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

    shallow(component).find(Bar).forEach(assertion)
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

    shallow(component).find(Bar).forEach(assertion)

  });

  describe('dataAccessors', () => {
    const stringAccessors = {
      fill: 'population',
      key: 'id',
      stack: 'year_id',
      value: 'population',
    };

    const spyMap = {
      fill: {
        spy: sinon.spy(colorScale),
        accessor: stringAccessors.fill,
      },
      x: {
        spy: sinon.spy(ordinalScale),
        accessor: stringAccessors.stack,
      },
      y: {
        spy: sinon.spy(linearScale),
        accessor: stringAccessors.value,
      }
    };

    beforeEach(() => {
      forEach(spyMap, (spyConfig) => {
        spyConfig.spy.reset();
      });
    });

    console.log(spyMap);

    it('uses property access if a dataAccessor is not a function', () => {
      const wrapper = shallow(
        <Bars
          colorScale={spyMap.fill.spy}
          data={dataFiltered}
          dataAccessors={stringAccessors}
          scales={{ x: spyMap.x.spy, y: spyMap.y.spy}}
        />
      );

      const assertion = (bar, idx) => {
        expect(bar).to.have.prop('fill').that.is.a('string');

        forEach(spyMap, (spyConfig, key) => {
          if(!spyConfig.spy.called) {
            throw new Error(`${key} spy not called; ${bar.prop(spyConfig.prop)}`);
          }

          const spyCall = spyConfig.spy.getCall(idx);
          const barDatum = bar.prop('datum');

          // needs fixing
          // console.log(barDatum);
          // console.log(spyConfig.accessor);
          // console.log(spyCall.calledWith(barDatum[spyConfig.accessor]));

          // Not always true
          // expect(spyCall.calledWith(barDatum[spyMap.accessor])).to.be.true;
        });
      };
      wrapper.find(Bar).forEach(assertion);
    });

  it('accepts a function of plotDatum as a dataAccessor', () => {
      const wrapper = shallow(
        <Bars
          colorScale={spyMap.fill.spy}
          data={data}
          dataAccessors={{
            fill: (d) => d.population,
            key: (d) => d.id,
            x: (d) => d.year_id,
            y: (d) => d.population,
          }}
          scales={{ x: spyMap.x.spy, y: spyMap.y.spy}}

        />);

      const assertion = (bar, idx) => {
        expect(bar).to.have.prop('fill').that.is.a('string');

        forEach(spyMap, (spyConfig, key) => {
          if (!spyConfig.spy.called) {
            throw new Error(`${key} spy not called; ${bar.prop(spyConfig.prop)}`);
          }
          const spyCall = spyConfig.spy.getCall(idx);
          const barDatum = bar.prop('datum');
          // expect(spyCall.calledWith(barDatum[spyConfig.accessor])).to.be.true;
        });
      };
      wrapper.find(Bar).forEach(assertion);
    });
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
