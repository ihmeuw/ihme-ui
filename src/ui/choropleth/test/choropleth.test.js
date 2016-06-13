import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';

import { dataGenerator, getTopoJSON, getLocationIds } from '../../../test-utils';

import Choropleth from '../src/choropleth';

chai.use(chaiEnzyme());

describe('<Choropleth />', () => {
  const keyField = 'locationId';
  const valueField = 'mean';
  const layers = [
    { name: 'country', object: 'country', type: 'feature' },
    { name: 'states', object: 'states', type: 'mesh', filterFn(a, b) { return a !== b; } }
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
        .to.be.an('object')
        .with.property('processedData')
        .that.is.an('object');

      // each unique data::keyField should have a corresponding key in result.processedData
      const expectedKeys = data.map((datum) => { return datum[keyField]; });
      expectedKeys.forEach((key) => {
        expect(result.processedData)
          .to.have.property(key)
          .that.is.an('object');
      });
    });
  });

  describe('component', () => {
    let wrapper;
    const noop = () => { return; };

    beforeEach(() => {
      wrapper = shallow(
        <Choropleth
          layers={layers}
          topology={geo}
          data={data}
          keyField={keyField}
          valueField={valueField}
          colorScale={noop}
          width={960}
          height={500}
        />
      );
    });

    it.skip('should have an svg and some controls', () => {
      expect(wrapper).to.have.tagName('div');
      expect(wrapper).to.have.descendants('svg');
      expect(wrapper).to.have.descendants('Controls');
    });

    it.skip('renders both mesh and feature layers', () => {
      // mesh layer
      expect(wrapper).to.have.exactly(1).descendants('Path');

      // feature layer
      expect(wrapper).to.have.exactly(1).descendants('FeatureLayer');
    });
  });
});
