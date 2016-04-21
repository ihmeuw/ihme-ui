import { expect } from 'chai';

import {
  getTopoJSON,
  getGeoJSON,
  getLocationIds
} from '../geography';

describe('geography', () => {
  it('returns topojson', () => {
    expect(getTopoJSON()).to.be.an('object')
      .and.to.include.keys(['arcs', 'objects', 'transform'])
      .and.to.have.property('type').that.equals('Topology');
  });

  it('returns geoJSON for a specified feature', () => {
    const geoJSON = getGeoJSON('country');
    expect(geoJSON).to.be.an('object');
    expect(geoJSON).to.have.property('type').that.equals('FeatureCollection');
    expect(geoJSON).to.have.property('features').that.is.an('array');
  });

  it('returns an array of loc ids of the features in the geoJSON', () => {
    const geoJSON = getGeoJSON('states');
    const locIds = getLocationIds(geoJSON.features);
    expect(locIds).to.be.an('array').of.length(geoJSON.features.length);
    expect(locIds)
      .to.have.deep.property('[0]')
      .that.is.a('number');
  });
});
