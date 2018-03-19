/* eslint-disable no-unused-expressions, max-len */
import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import {
  mount,
  shallow,
} from 'enzyme';
import { drop, forEach, minBy, maxBy, uniqBy, map } from 'lodash';
import { scaleLinear, scalePoint } from 'd3';
import sinon from 'sinon';
import { dataGenerator } from '../../../utils';

import { Scatter, Shape } from '../';

chai.use(chaiEnzyme());

describe('<Scatter />', () => {
  const chartDimensions = {
    width: 600,
    height: 400
  };

  const dataAccessors = {
    x: 'year_id',
    y: 'population',
    key: 'id'
  };

  const data = dataGenerator({
    primaryKeys: [{ name: 'location', values: ['USA'] }],
    valueKeys: [{ name: 'population', range: [300, 600], uncertainty: false }],
    length: 10
  });

  const yDomain = [minBy(data, 'population').population, maxBy(data, 'population').population];
  const xDomain = map(uniqBy(data, 'year_id'), (obj) => obj.year_id);

  const xScale = scalePoint().domain(xDomain).range([0, chartDimensions.width]);
  const yScale = scaleLinear().domain(yDomain).range([chartDimensions.height, 0]);
  const colorScale = scaleLinear().domain(yDomain).range(['#fc8d59', '#ffffbf', '#91bfdb']);

  const sharedProps = {
    data,
    dataAccessors,
    fill: 'red',
    focus: data[2],
    focusedClassName: 'focused',
    focusedStyle: { stroke: 'cornsilk' },
    scales: { x: xScale, y: yScale },
    selection: [data[1], data[3]],
    selectedClassName: 'selected',
    selectedStyle: { stroke: 'aqua' },
    shapeClassName: 'symbol',
    shapeStyle: { fill: 'bluesteel' },
    shapeType: 'circle',
  };

  const component = (
    <Scatter
      {...sharedProps}
    />
  );

  const animatedComponent = (
    <Scatter
      {...sharedProps}
      animate
    />
  );

  const components = [
    animatedComponent,
    component,
  ];

  describe('inherited & non-inherited props', () => {
    const nonInheritedProps = [
      'animate',
      'colorScale',
      'data',
      'dataAccessors',
      'enter',
      'focus',
      'leave',
      'scales',
      'selection',
      'shapeClassName',
      'shapeStyle',
      'start',
      'update',
    ];
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
      'size',
      'shapeType',
      'style',
    ];
    const nonInheritedPropsAssertion = shape => {
      nonInheritedProps.forEach(prop => {
        expect(shape).to.not.have.prop(prop);
      });
    };
    const inheritedPropsAssertion = (shape) => {
      inheritedProps.forEach(prop => {
        expect(shape).to.have.prop(prop);
      });
    };

    components.forEach(testComponent => {
      const animated = testComponent.props.animate ? 'animated' : 'non-animated';

      it(`does not pass specific properties to its children (${animated})`, () => {
        shallow(testComponent).find(Shape).forEach(nonInheritedPropsAssertion);
      });
      it(`passes specified properties to its children (${animated})`, () => {
        shallow(testComponent).find(Shape).forEach(inheritedPropsAssertion);
      });
    });
  });

  describe('child Shape components', () => {
    components.forEach(testComponent => {
      const animated = testComponent.props.animate ? 'animated' : 'non-animated';

      it(`component contains 10 shapes (${animated})`, () => {
        const wrapper = mount(testComponent);
        expect(wrapper.find(Shape)).to.have.length(10);
      });

      it(`selects a shape (${animated})`, () => {
        const wrapper = mount(testComponent);
        expect(wrapper.find({ selected: true })).to.have.length(2);
      });

      it(`focuses a shape (${animated})`, () => {
        const wrapper = mount(testComponent);
        expect(wrapper.find({ focused: true })).to.have.length(1);
      });
    });
  });

  describe('dataAccessors', () => {
    const stringAccessors = {
      fill: 'population',
      key: 'id',
      x: 'year_id',
      y: 'population',
    };

    const spyMap = {
      fill: {
        spy: sinon.spy(colorScale),
        accessor: stringAccessors.fill,
        prop: 'fill',
      },
      x: {
        spy: sinon.spy(xScale),
        accessor: stringAccessors.x,
        prop: 'translateX',
      },
      y: {
        spy: sinon.spy(yScale),
        accessor: stringAccessors.y,
        prop: 'translateY',
      }
    };

    beforeEach(() => {
      forEach(spyMap, (spyConfig) => {
        spyConfig.spy.reset();
      });
    });

    it('uses property access if a dataAccessor is not a function', () => {
      const wrapper = shallow(
        <Scatter
          colorScale={spyMap.fill.spy}
          data={data}
          dataAccessors={stringAccessors}
          scales={{
            x: spyMap.x.spy,
            y: spyMap.y.spy,
          }}
        />
      );

      const assertion = (shape, idx) => {
        expect(shape).to.have.prop('fill').that.is.a('string');
        expect(shape).to.have.prop('translateX').that.is.a('number');
        forEach(spyMap, (spyConfig, key) => {
          if (!spyConfig.spy.called) {
            throw new Error(`${key} spy not called; ${shape.prop(spyConfig.prop)}`);
          }
          const spyCall = spyConfig.spy.getCall(idx);
          const shapeDatum = shape.prop('datum');
          expect(spyCall.calledWith(shapeDatum[spyConfig.accessor])).to.be.true;
        });
      };

      wrapper.find(Shape).forEach(assertion);
    });

    it('accepts a function of plotDatum as a dataAccessor', () => {
      const wrapper = shallow(
        <Scatter
          colorScale={spyMap.fill.spy}
          data={data}
          dataAccessors={{
            fill: (d) => d.population,
            key: (d) => d.id,
            x: (d) => d.year_id,
            y: (d) => d.population,
          }}
          scales={{
            x: spyMap.x.spy,
            y: spyMap.y.spy,
          }}
        />
      );

      const assertion = (shape, idx) => {
        expect(shape).to.have.prop('fill').that.is.a('string');
        expect(shape).to.have.prop('translateX').that.is.a('number');
        forEach(spyMap, (spyConfig, key) => {
          if (!spyConfig.spy.called) {
            throw new Error(`${key} spy not called; ${shape.prop(spyConfig.prop)}`);
          }
          const spyCall = spyConfig.spy.getCall(idx);
          const shapeDatum = shape.prop('datum');
          expect(spyCall.calledWith(shapeDatum[spyConfig.accessor])).to.be.true;
        });
      };

      wrapper.find(Shape).forEach(assertion);
    });

    it('creates a one-dimensional plot if dataAccessor is not defined for y', () => {
      const wrapper = shallow(
        <Scatter
          data={data}
          dataAccessors={{ key: 'id', x: 'year_id' }}
          scales={{ x: xScale }}
        />
      );
      wrapper.find(Shape).forEach((shape) => {
        expect(shape).to.have.prop('translateX').that.is.a('number');
        expect(shape).to.have.prop('translateY', 0);
      });
    });

    it('creates a one-dimensional plot if dataAccessor is not defined for x', () => {
      const wrapper = shallow(
        <Scatter
          data={data}
          dataAccessors={{ key: 'id', y: 'population' }}
          scales={{ y: yScale }}
        />
      );
      wrapper.find(Shape).forEach((shape) => {
        expect(shape).to.have.prop('translateX', 0);
        expect(shape).to.have.prop('translateY').that.is.a('number');
      });
    });

    it('will pass x-, y-, and fillValue into their appropriate scales if they resolve to a finite, number value', () => {
      const manuallyEnteredData = [{ x: 0 }, { x: 1 }, { x: 2 }, { x: 3 }, { x: 4 }];
      const wrapper = shallow(
        <Scatter
          data={manuallyEnteredData}
          dataAccessors={{ key: 'x', x: 'x' }}
          scales={{ x: spyMap.x.spy }}
        />
      );

      const assertion = (shape, idx) => {
        expect(shape).to.have.prop('translateX').that.is.a('number');
        const spyCall = spyMap.x.spy.getCall(idx);
        const shapeDatum = shape.prop('datum');
        expect(spyCall.calledWith(shapeDatum.x)).to.be.true;
      };

      wrapper.find(Shape).forEach(assertion);
    });

    it('will not pass x-, y-, and fillValue into their appropriate scales if they resolve to a non-finite, non-number value', () => {
      const junkData = [{ x: 'foo' }, { x: (void 0) }, { x: null }, { x: Infinity }, { x: -Infinity }];
      const wrapper = shallow(
        <Scatter
          data={junkData}
          dataAccessors={{ key: (d, i) => `${i}_${d.x}`, x: 'x' }}
          scales={{ x: spyMap.x.spy }}
        />
      );

      const assertion = (shape) => {
        expect(shape).to.have.prop('translateX', 0);
      };

      wrapper.find(Shape).forEach(assertion);
      expect(spyMap.x.spy.called).to.be.false;
    });
  });

  describe('data processing instance methods', () => {
    const rawData = [
      { id: 1, population: 450, year_id: 2000 },
      { id: 2, population: 351, year_id: 2003 },
      { id: 3, population: 540, year_id: 2009 },
    ];

    const expectedProcessedDatum = [
      {
        fill: 'red',
        shapeType: 'circle',
        translateX: 0,
        translateY: 400,
      },
      {
        fill: 'red',
        shapeType: 'circle',
        translateX: 200,
        translateY: 664.1761174116077,
      },
      {
        fill: 'red',
        shapeType: 'circle',
        translateX: 600,
        translateY: 159.83989326217474,
      },
    ];

    const testComponent = (
      <Scatter
        {...sharedProps}
        data={rawData}
      />
    );

    const wrapper = shallow(testComponent);

    it('processDatum correctly calculates values as expected', () => {
      rawData.forEach((rawDatum, index) => {
        const processedDatum = Scatter.processDatum(
          {
            dataAccessors,
            fill: 'red',
            scales: { x: xScale, y: yScale },
            shapeType: 'circle',
          },
          rawDatum
        );

        expect(processedDatum).to.deep.equal(expectedProcessedDatum[index]);
      });
    });

    it('processDataSet formats and processes data', () => {
      const processedData = wrapper.instance().processDataSet(rawData);

      processedData.forEach((datum, index) => {
        // correct shape.
        expect(datum).to.have.property('key');
        expect(datum).to.have.property('data');
        expect(datum).to.have.property('state');

        // correct `key`, `data`, `state` assignments.
        expect(datum.key).to.equal(datum.data.id);
        expect(datum.data).to.equal(rawData[index]);
        expect(datum.state).to.deep.equal(expectedProcessedDatum[index]);
      });
    });
  });

  describe('selection', () => {
    it('renders selected shapes last', () => {
      const selectedDatum = data[0];

      const wrapper = shallow(
        <Scatter
          data={data}
          dataAccessors={{
            key: (d) => d.id,
            x: (d) => d.year_id,
            y: (d) => d.population,
          }}
          scales={{
            x: xScale,
            y: yScale,
          }}
        />
      );

      expect(wrapper
        .find('g')
        .find(Shape)
        .first()
        .prop('datum')
      ).to.equal(selectedDatum);
      wrapper.setProps({ selection: [selectedDatum] });
      expect(wrapper
        .find('g')
        .find(Shape)
        .first()
        .prop('datum')
      ).to.not.equal(selectedDatum);
      expect(wrapper
        .find('g')
        .find(Shape)
        .last()
        .prop('datum')
      ).to.equal(selectedDatum);
    });

    it('does a stable sort of the shapes', () => {
      const wrapper = shallow(
        <Scatter
          data={data}
          dataAccessors={{
            key: (d) => d.id,
            x: (d) => d.year_id,
            y: (d) => d.population,
          }}
          scales={{
            x: xScale,
            y: yScale,
          }}
        />
      );

      wrapper.find('g').find(Shape).forEach((node, idx) => {
        expect(node.prop('datum')).to.equal(data[idx]);
      });

      // selecting the first shape should result in the following order:
      // newIndex :|: oldIndex
      //        0 -> 1
      //        1 -> 2
      //        2 -> 0
      const selectedDatum = data[0];
      wrapper.setProps({ selection: [selectedDatum] });
      const expectedShapeOrder = drop(data);
      expectedShapeOrder.push(selectedDatum);

      wrapper.find('g').find(Shape).forEach((node, idx) => {
        expect(node.prop('datum')).to.equal(expectedShapeOrder[idx]);
      });
    });

    it(`does not update state.sortedData 
        if neither selection nor data have changed`, () => {
      const wrapper = shallow(
        <Scatter
          data={data}
          dataAccessors={{
            key: (d) => d.id,
            x: (d) => d.year_id,
            y: (d) => d.population,
          }}
          scales={{
            x: xScale,
            y: yScale,
          }}
        />
      );

      const initialState = wrapper.state('sortedData');
      expect(initialState).to.deep.equal(data);
      wrapper.update();
      expect(initialState).to.equal(wrapper.state('sortedData'));
    });
  });
});
