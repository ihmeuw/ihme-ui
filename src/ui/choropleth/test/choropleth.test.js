import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';

import { dataGenerator, getTopoJSON } from '../../../test-utils';

import Choropleth from '../src/choropleth';

chai.use(chaiEnzyme());

describe('<Choropleth />', () => {
  const keyField = 'locationId';
  const data = dataGenerator({ length: 10, keyField });
  const geo = getTopoJSON();

  describe('class helper methods', () => {
    it('transforms data from array to object keyed by keyField', () => {
      const result = Choropleth.prototype.processData(data, keyField);

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

    it('extracts topojson objects into geoJSON', () => {
      const result = Choropleth.prototype.processJSON(geo);

      // basic expectation of wrapper
      expect(result)
        .to.be.an('object')
        .and.to.have.all.keys(['simplifiedTopoJSON', 'bounds', 'country', 'states']);

      // bounds are nested array of [[left, top], [right, bottom]]
      expect(result.bounds).to.be.an('array')
        .that.has.deep.property('[0]')
        .that.is.an('array')
        .that.has.deep.property('[0]')
        .that.is.a('number');
    });
  });
});
