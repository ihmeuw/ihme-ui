import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';
import { minBy, maxBy, uniqBy, map } from 'lodash';
import d3Scale from 'd3-scale';
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
  };

  const data = dataGenerator({
    primaryKeys: [{ name: 'location', values: ['USA'] }],
    valueKeys: [{ name: 'population', range: [300, 600], uncertainty: false }],
    length: 10
  });

  const yDomain = [minBy(data, 'population').population, maxBy(data, 'population').population];
  const xDomain = map(uniqBy(data, 'year_id'), (obj) => { return (obj.year_id); });

  const xScale = d3Scale.scalePoint().domain(xDomain).range([0, chartDimensions.width]);
  const yScale = d3Scale.scaleLinear().domain(yDomain).range([chartDimensions.height, 0]);

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
      nonInheritedProps.forEach(prop => {
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
      inheritedProps.forEach(prop => {
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
    const scaleSpy = sinon.spy(xScale);

    afterEach(() => { scaleSpy.reset(); });

    it('uses property access if a dataAccessor is not a function', () => {
      const wrapper = shallow(
        <Scatter
          data={data}
          dataAccessors={{ x: 'year_id' }}
          scales={{ x: scaleSpy }}
        />
      );

      const assertion = (symbol, idx) => {
        expect(symbol).to.have.prop('translateX');

        const spyCall = scaleSpy.getCall(idx);
        const symbolDatum = symbol.prop('datum');
        expect(spyCall.calledWith(symbolDatum.year_id)).to.be.true;
      };

      wrapper.find(Symbol).forEach(assertion);
    });

    it('accepts a function of plotDatum as a dataAccessor', () => {
      const wrapper = shallow(
        <Scatter
          data={data}
          dataAccessors={{
            x: (plotDatum) => {
              return plotDatum.year_id;
            }
          }}
          scales={{ x: scaleSpy }}
        />
      );

      const assertion = (symbol, idx) => {
        expect(symbol).to.have.prop('translateX');

        const spyCall = scaleSpy.getCall(idx);
        const symbolDatum = symbol.prop('datum');
        expect(spyCall.calledWith(symbolDatum.year_id)).to.be.true;
      };

      wrapper.find(Symbol).forEach(assertion);
    });

    it('creates a one-dimensional plot if dataAccessor is not defined for y', () => {
      const wrapper = shallow(
        <Scatter
          data={data}
          dataAccessors={{ x: 'year_id' }}
          scales={{ x: xScale }}
        />
      );
      wrapper.find(Symbol).forEach((symbol) => {
        expect(symbol).to.have.prop('translateY', 0);
      });
    });

    it('creates a one-dimensional plot if dataAccessor is not defined for x', () => {
      const wrapper = shallow(
        <Scatter
          data={data}
          dataAccessors={{ y: 'population' }}
          scales={{ y: yScale }}
        />
      );
      wrapper.find(Symbol).forEach((symbol) => {
        expect(symbol).to.have.prop('translateX', 0);
      });
    });

    it('will pass x-, y-, and fillValue into their appropriate scales if they resolve to a finite, number value', () => {
      const manuallyEnteredData = [{ x: 0 }, { x: 1 }, { x: 2 }, { x: 3 }, { x: 4 }];
      const wrapper = shallow(
        <Scatter
          data={manuallyEnteredData}
          dataAccessors={{ x: 'x' }}
          scales={{ x: scaleSpy }}
        />
      );

      const assertion = (symbol, idx) => {
        expect(symbol).to.have.prop('translateX').that.is.a('number');
        const spyCall = scaleSpy.getCall(idx);
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
          dataAccessors={{ x: 'x' }}
          scales={{ x: scaleSpy }}
        />
      );

      const assertion = (symbol) => {
        expect(symbol).to.have.prop('translateX', 0);
      };

      wrapper.find(Symbol).forEach(assertion);
      expect(scaleSpy.called).to.be.false;
    });
  });
});
