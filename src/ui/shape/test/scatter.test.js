/* eslint-disable no-unused-expressions, max-len */
import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';
import { drop, forEach, minBy, maxBy, uniqBy, map } from 'lodash';
import { scaleLinear, scalePoint } from 'd3';
import sinon from 'sinon';
import { dataGenerator } from '../../../test-utils';

import { Scatter, Symbol } from '../';

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
  const xDomain = map(uniqBy(data, 'year_id'), obj => obj.year_id);

  const xScale = scalePoint().domain(xDomain).range([0, chartDimensions.width]);
  const yScale = scaleLinear().domain(yDomain).range([chartDimensions.height, 0]);
  const colorScale = scaleLinear().domain(yDomain).range(['#fc8d59', '#ffffbf', '#91bfdb']);

  const component = (
    <Scatter
      data={data}
      dataAccessors={dataAccessors}
      fill="red"
      focus={data[2]}
      focusedClassName="focused"
      focusedStyle={{ stroke: 'cornsilk' }}
      scales={{ x: xScale, y: yScale }}
      selection={[data[1], data[3]]}
      selectedClassName="selected"
      selectedStyle={{ stroke: 'aqua' }}
      symbolClassName="symbol"
      symbolType="circle"
    />
  );

  it('contains 10 shapes', () => {
    const wrapper = shallow(component);
    expect(wrapper.find(Symbol)).to.have.length(10);
  });

  it('does not pass specific properties to its children', () => {
    const nonInheritedProps = [
      'colorScale',
      'data',
      'dataAccessors',
      'focus',
      'scales',
      'selection',
      'symbolClassName',
    ];
    const assertion = (symbol) => {
      nonInheritedProps.forEach((prop) => {
        expect(symbol).to.not.have.prop(prop);
      });
    };

    shallow(component).find(Symbol).forEach(assertion);
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
      'size',
      'symbolType',
    ];
    const assertion = (symbol) => {
      inheritedProps.forEach((prop) => {
        expect(symbol).to.have.prop(prop);
      });
    };

    shallow(component).find(Symbol).forEach(assertion);
  });

  it('selects a symbol', () => {
    const wrapper = shallow(component);
    expect(wrapper.find({ selected: true })).to.have.length(2);
  });

  it('focuses a symbol', () => {
    const wrapper = shallow(component);
    expect(wrapper.find({ focused: true })).to.have.length(1);
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

      const assertion = (symbol, idx) => {
        expect(symbol).to.have.prop('fill').that.is.a('string');
        expect(symbol).to.have.prop('translateX').that.is.a('number');
        forEach(spyMap, (spyConfig, key) => {
          if (!spyConfig.spy.called) {
            throw new Error(`${key} spy not called; ${symbol.prop(spyConfig.prop)}`);
          }
          const spyCall = spyConfig.spy.getCall(idx);
          const symbolDatum = symbol.prop('datum');
          expect(spyCall.calledWith(symbolDatum[spyConfig.accessor])).to.be.true;
        });
      };

      wrapper.find(Symbol).forEach(assertion);
    });

    it('accepts a function of plotDatum as a dataAccessor', () => {
      const wrapper = shallow(
        <Scatter
          colorScale={spyMap.fill.spy}
          data={data}
          dataAccessors={{
            fill: d => d.population,
            key: d => d.id,
            x: d => d.year_id,
            y: d => d.population,
          }}
          scales={{
            x: spyMap.x.spy,
            y: spyMap.y.spy,
          }}
        />
      );

      const assertion = (symbol, idx) => {
        expect(symbol).to.have.prop('fill').that.is.a('string');
        expect(symbol).to.have.prop('translateX').that.is.a('number');
        forEach(spyMap, (spyConfig, key) => {
          if (!spyConfig.spy.called) {
            throw new Error(`${key} spy not called; ${symbol.prop(spyConfig.prop)}`);
          }
          const spyCall = spyConfig.spy.getCall(idx);
          const symbolDatum = symbol.prop('datum');
          expect(spyCall.calledWith(symbolDatum[spyConfig.accessor])).to.be.true;
        });
      };

      wrapper.find(Symbol).forEach(assertion);
    });

    it('creates a one-dimensional plot if dataAccessor is not defined for y', () => {
      const wrapper = shallow(
        <Scatter
          data={data}
          dataAccessors={{ key: 'id', x: 'year_id' }}
          scales={{ x: xScale }}
        />
      );
      wrapper.find(Symbol).forEach((symbol) => {
        expect(symbol).to.have.prop('translateX').that.is.a('number');
        expect(symbol).to.have.prop('translateY', 0);
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
      wrapper.find(Symbol).forEach((symbol) => {
        expect(symbol).to.have.prop('translateX', 0);
        expect(symbol).to.have.prop('translateY').that.is.a('number');
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

      const assertion = (symbol, idx) => {
        expect(symbol).to.have.prop('translateX').that.is.a('number');
        const spyCall = spyMap.x.spy.getCall(idx);
        const symbolDatum = symbol.prop('datum');
        expect(spyCall.calledWith(symbolDatum.x)).to.be.true;
      };

      wrapper.find(Symbol).forEach(assertion);
    });

    it('will not pass x-, y-, and fillValue into their appropriate scales if they resolve to a non-finite, non-number value', () => {
      const junkData = [{ x: 'foo' }, { x: (void 0) }, { x: null }, { x: Infinity }, { x: -Infinity }];
      const wrapper = shallow(
        <Scatter
          data={junkData}
          dataAccessors={{ key: 'x', x: 'x' }}
          scales={{ x: spyMap.x.spy }}
        />
      );

      const assertion = (symbol) => {
        expect(symbol).to.have.prop('translateX', 0);
      };

      wrapper.find(Symbol).forEach(assertion);
      expect(spyMap.x.spy.called).to.be.false;
    });
  });

  describe('selection', () => {
    it('renders selected symbols last', () => {
      const selectedDatum = data[0];

      const wrapper = shallow(
        <Scatter
          data={data}
          dataAccessors={{
            key: d => d.id,
            x: d => d.year_id,
            y: d => d.population,
          }}
          scales={{
            x: xScale,
            y: yScale,
          }}
        />
      );

      expect(wrapper
        .find('g')
        .find(Symbol)
        .first()
        .prop('datum')
      ).to.equal(selectedDatum);
      wrapper.setProps({ selection: [selectedDatum] });
      expect(wrapper
        .find('g')
        .find(Symbol)
        .first()
        .prop('datum')
      ).to.not.equal(selectedDatum);
      expect(wrapper
        .find('g')
        .find(Symbol)
        .last()
        .prop('datum')
      ).to.equal(selectedDatum);
    });

    it('does a stable sort of the symbols', () => {
      const wrapper = shallow(
        <Scatter
          data={data}
          dataAccessors={{
            key: d => d.id,
            x: d => d.year_id,
            y: d => d.population,
          }}
          scales={{
            x: xScale,
            y: yScale,
          }}
        />
      );

      wrapper.find('g').find(Symbol).forEach((node, idx) => {
        expect(node.prop('datum')).to.equal(data[idx]);
      });

      // selecting the first symbol should result in the following order:
      // newIndex :|: oldIndex
      //        0 -> 1
      //        1 -> 2
      //        2 -> 0
      const selectedDatum = data[0];
      wrapper.setProps({ selection: [selectedDatum] });
      const expectedSymbolOrder = drop(data);
      expectedSymbolOrder.push(selectedDatum);

      wrapper.find('g').find(Symbol).forEach((node, idx) => {
        expect(node.prop('datum')).to.equal(expectedSymbolOrder[idx]);
      });
    });

    it(`does not update state.sortedData 
        if neither selection nor data have changed`, () => {
      const wrapper = shallow(
        <Scatter
          data={data}
          dataAccessors={{
            key: d => d.id,
            x: d => d.year_id,
            y: d => d.population,
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
