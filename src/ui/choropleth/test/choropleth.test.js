/* eslint-disable no-unused-expressions, max-len */
import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';
import { tail } from 'lodash';

import { dataGenerator, getTopoJSON, getLocationIds } from '../../../test-utils';

import Choropleth from '../src/choropleth';

chai.use(chaiEnzyme());

describe('<Choropleth />', () => {
  const keyField = 'locationId';
  const valueField = 'mean';
  const layers = [
    { name: 'country', object: 'country', type: 'feature' },
    { name: 'states', object: 'states', type: 'mesh', filter: (a, b) => a !== b },
  ];
  const geo = getTopoJSON();
  const locIds = [102, ...getLocationIds(geo.objects.states.geometries)];
  const data = dataGenerator({
    primaryKeys: [{ name: keyField, values: locIds }],
    valueKeys: [
      { name: valueField, range: [200, 500] }
    ],
    length: 1
  });

  describe('class helper methods', () => {
    it('transforms data from array to object keyed by keyField', () => {
      const result = Choropleth.processData(data, keyField);

      // basic expectation of wrapper object
      expect(result)
        .to.be.an('object');

      // each unique data::keyField should have a corresponding key in result.processedData
      const expectedKeys = data.map((datum) => datum[keyField]);
      expectedKeys.forEach((key) => {
        expect(result)
          .to.have.property(key)
          .that.is.an('object');
      });
    });

    describe('mesh layer style', () => {
      const feature = { id: 5, properties: { color: 'red' } };
      const expectedStyle = { pointerEvents: 'none', stroke: 'red' };

      it('accepts an object as layer style', () => {
        const layerStyle = { stroke: 'red' };
        const calculatedStyle = Choropleth.prototype.calcMeshLayerStyle(Symbol(), layerStyle, feature);
        expect(calculatedStyle).to.deep.equal(expectedStyle);
      });

      it('accepts a function as layer style', () => {
        const layerStyle = (geoJSONFeature) => ({ stroke: geoJSONFeature.properties.color });
        const calculatedStyle = Choropleth.prototype.calcMeshLayerStyle(Symbol(), layerStyle, feature);
        expect(calculatedStyle).to.deep.equal(expectedStyle);
      });
    });
  });

  describe('component', () => {
    const noop = () => {};

    it('renders controls when controls === truthy', () => {
      const wrapper = shallow(
        <Choropleth
          colorScale={noop}
          controls
          data={data}
          height={500}
          keyField={keyField}
          layers={layers}
          topology={geo}
          valueField={valueField}
          width={960}
        />
      );
      expect(wrapper).to.have.tagName('div');
      expect(wrapper).to.have.descendants('svg');
      expect(wrapper).to.have.descendants('Controls');
    });

    it('does not render controls when controls !== truthy', () => {
      const wrapper = shallow(
        <Choropleth
          colorScale={noop}
          data={data}
          height={500}
          keyField={keyField}
          layers={layers}
          topology={geo}
          valueField={valueField}
          width={960}
        />
      );
      expect(wrapper).to.have.tagName('div');
      expect(wrapper).to.have.descendants('svg');
      expect(wrapper).to.not.have.descendants('Controls');
    });

    it('renders provided layers', () => {
      const wrapper = shallow(
        <Choropleth
          colorScale={noop}
          data={data}
          height={500}
          keyField={keyField}
          layers={tail(layers)}
          topology={geo}
          valueField={valueField}
          width={960}
        />
      );

      expect(wrapper.find('svg')).to.not.have.descendants('FeatureLayer');
      expect(wrapper.find('svg')).to.have.exactly(1).descendants('Path');

      wrapper.setProps({ layers });
      expect(wrapper.find('svg')).to.have.exactly(1).descendants('FeatureLayer');
      expect(wrapper.find('svg')).to.have.exactly(1).descendants('Path');
    });

    it('only renders feature and mesh layers', () => {
      const wrapper = shallow(
        <Choropleth
          colorScale={noop}
          data={data}
          height={500}
          keyField={keyField}
          layers={[{ name: 'fake', object: 'nonexistent' }, ...layers]}
          topology={geo}
          valueField={valueField}
          width={960}
        />
      );

      expect(wrapper.find('svg')).to.have.exactly(1).descendants('FeatureLayer');
      expect(wrapper.find('svg')).to.have.exactly(1).descendants('Path');
    });
  });
});
