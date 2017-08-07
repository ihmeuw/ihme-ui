import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';

import { colorSteps, dataGenerator } from '../../../../utils';
import { maxBy, minBy, noop } from 'lodash';
import { scaleLinear, scalePow, scaleLog } from 'd3';

import ChoroplethLegend from '../';

chai.use(chaiEnzyme());

describe('<ChoroplethLegend />', () => {
  const valueField = 'value';
  const keyField = 'loc_id';
  const data = dataGenerator({
    primaryKeys: [{ name: keyField, values: [keyField] }],
    valueKeys: [{ name: valueField, range: [100, 200], uncertainty: true }],
    length: 10
  });

  const domain = [minBy(data, 'value').value, maxBy(data, 'value').value];
  const margins = {
    top: 20,
    bottom: 20,
    left: 20,
    right: 20
  };

  it('composes a density plot, linear gradient, slider, axis and label', () => {
    const wrapper = shallow(<ChoroplethLegend
      colorScale={noop}
      colorSteps={colorSteps}
      data={data}
      domain={domain}
      keyField={keyField}
      margins={margins}
      rangeExtent={domain}
      valueField={valueField}
      width={600}
      xScale={scaleLinear()}
    />);
    ['Scatter', 'LinearGradient', 'Slider', 'OrientedAxis'].forEach(component => {
      expect(wrapper.find(component)).to.be.present();
    });
  });

  describe('xScale', () => {
    it('accepts continuous d3Scales', () => {
      [scaleLinear, scalePow, scaleLog].forEach(scale => {
        const wrapper = shallow(<ChoroplethLegend
          colorScale={noop}
          colorSteps={colorSteps}
          data={data}
          domain={domain}
          keyField={keyField}
          margins={margins}
          rangeExtent={domain}
          valueField={valueField}
          width={600}
          xScale={scale()}
        />);

        const modifiedScale = wrapper.state('scatterScaleMap').x;
        expect(modifiedScale).to.be.a('function');

        expect(modifiedScale).to.have.property('domain');
        expect(modifiedScale.domain()).to.deep.equal(domain);

        expect(modifiedScale).to.have.property('range');
        expect(modifiedScale.range()).to.deep.equal([0, wrapper.state('adjustedWidth')]);
      });
    });

    it('updates the provided scale when domain changes', () => {
      const wrapper = shallow(<ChoroplethLegend
        colorScale={noop}
        colorSteps={colorSteps}
        data={data}
        domain={domain}
        keyField={keyField}
        margins={margins}
        rangeExtent={domain}
        valueField={valueField}
        width={600}
        xScale={scaleLinear()}
      />);

      expect(wrapper.state('scatterScaleMap').x.domain()).to.deep.equal(domain);

      const newDomain = [0, 1000];
      wrapper.setProps({
        domain: newDomain,
      });

      expect(wrapper.state('scatterScaleMap').x.domain()).to.deep.equal(newDomain);
    });

    it('updates the provided scale when width changes', () => {
      const wrapper = shallow(<ChoroplethLegend
        colorScale={noop}
        colorSteps={colorSteps}
        data={data}
        domain={domain}
        keyField={keyField}
        margins={margins}
        rangeExtent={domain}
        valueField={valueField}
        width={600}
        xScale={scaleLinear()}
      />);

      const oldRange = wrapper.state('scatterScaleMap').x.range();
      expect(oldRange).to.deep.equal([0, wrapper.state('adjustedWidth')]);

      wrapper.setProps({
        width: 800,
      });

      const newRange = wrapper.state('scatterScaleMap').x.range();
      expect(newRange).to.not.deep.equal(oldRange);
      expect(newRange).to.deep.equal([0, wrapper.state('adjustedWidth')]);
    });

    it('updates this.state.scatterScaleMap when the provided scale changes', () => {
      const wrapper = shallow(<ChoroplethLegend
        colorScale={noop}
        colorSteps={colorSteps}
        data={data}
        domain={domain}
        keyField={keyField}
        margins={margins}
        rangeExtent={domain}
        valueField={valueField}
        width={600}
        xScale={scaleLinear()}
      />);

      const oldScale = wrapper.state('scatterScaleMap').x;

      wrapper.setProps({
        xScale: scaleLog(),
      });

      const newScale = wrapper.state('scatterScaleMap').x;
      expect(oldScale.domain()).to.deep.equal(newScale.domain());
      expect(oldScale.range()).to.deep.equal(newScale.range());

      const domainAverage = (oldScale.domain().reduce((accum, bound) => accum + bound, 0)) / 2;
      expect(oldScale(domainAverage)).to.not.equal(newScale(domainAverage));
    });
  });
});
