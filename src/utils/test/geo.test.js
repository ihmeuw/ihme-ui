import { expect } from 'chai';

import { getTopoJSON } from '../../test-utils';

import {
  extractGeoJSON,
  concatGeoJSON,
  computeBounds
} from '../geo';

describe('Geo utils', () => {
  const layers = [
    { name: 'country', type: 'feature' },
    { name: 'states', type: 'mesh', filterFn(a, b) { return a !== b; } },
    { name: 'nonExistent' }
  ];
  const geo = getTopoJSON();
  const extractedGeoJSON = extractGeoJSON(geo, layers);
  const concatenatedGeoJSON = concatGeoJSON(extractedGeoJSON);

  it('extracts topojson objects into geoJSON', () => {
    // mesh and feature are objects that hold geoJSON
    expect(extractedGeoJSON.mesh).to.be.an('object')
      .that.has.property('states')
      .that.is.an('object')
      .that.has.property('type', 'MultiLineString');

    expect(extractedGeoJSON.feature).to.be.an('object')
      .that.has.property('country')
      .that.is.an('object')
      .that.has.property('type', 'FeatureCollection');

    // neither mesh nor feature should have key 'nonExistent'
    expect(extractedGeoJSON.mesh).to.not.have.property('nonExistent');
    expect(extractedGeoJSON.feature).to.not.have.property('nonExistent');
  });

  it('concatenates the results of extractGeoJSON into a single array', () => {
    expect(concatenatedGeoJSON).to.be.an('array').of.length(2);
    concatenatedGeoJSON.forEach((obj) => {
      expect(obj).to.be.an('object')
        .and.to.have.property('type');
    });
  });

  it('computes bounds of a geoJSON feature', () => {
    // in order to avoid testing a d3 internal just assert on the return value
    const bounds = computeBounds(concatenatedGeoJSON);

    expect(bounds).to.be.an('array');
    bounds.forEach((corner) => {
      expect(corner).to.be.an('array');
      corner.forEach((bound) => {
        expect(bound).to.be.a('number');
      });
    });
  });
});
