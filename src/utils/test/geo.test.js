import { expect } from 'chai';
import reduce from 'lodash/reduce';
import head from 'lodash/head';
import last from 'lodash/last';

import {
  extractGeoJSON,
  computeBounds,
  concatTopoJSON,
  concatGeoJSON,
} from '../geo';

describe('Geo utils', () => {
  const geo = {
    arcs: [
      [[0, 1], [-1, 0], [0, -1], [1, 0]],
      [[0, 1], [1, 0]],
      [[0, 1], [1, 2]],
      [[1, 0], [2, 1]],
      [[1, 2], [2, 1]],
      [[1, 2], [2, 3], [3, 2], [2, 1]],
    ],
    type: 'Topology',
    objects: {
      states: {
        type: 'GeometryCollection',
        geometries: [
          {
            arcs: [[0], [1]],
            id: 1,
            properties: {
              loc_id: 1,
            },
            type: 'MultiLineString',
          },
          {
            arcs: [[1], [2], [3], [4]],
            id: 2,
            properties: {
              loc_id: 2,
            },
            type: 'MultiLineString',
          },
          {
            arcs: [[4], [5]],
            id: 3,
            properties: {
              loc_id: 3,
            },
            type: 'MultiLineString',
          },
        ]
      },
      country: {
        type: 'GeometryCollection',
        geometries: [
          {
            type: 'LineString',
            arcs: [[0]],
          },
          {
            type: 'LineString',
            arcs: [[2]],
          },
          {
            type: 'LineString',
            arcs: [[5]],
          },
          {
            type: 'LineString',
            arcs: [[3]],
          },
        ],
        id: 4,
        properties: {
          loc_id: 4,
        },
      }
    },
  };

  const layers = [
    { name: 'country', object: 'country', type: 'feature' },
    { name: 'countryWithFunc', object: topoObjects => topoObjects.country, type: 'feature' },
    { name: 'states', object: 'states', type: 'mesh', filterFn(a, b) { return a !== b; } },
    { name: 'nonExistent' },
  ];
  const extractedGeoJSON = extractGeoJSON(geo, layers);
  const concatenatedGeoJSON = concatGeoJSON(extractedGeoJSON);

  it('concatenates topojson objects together, in order', () => {
    const expectedNumGeometries = reduce(geo.objects, (accum, object) => (
      accum + object.geometries.length
    ), 0);

    const concatenated = concatTopoJSON(geo.objects, ['country', 'states']);
    expect(concatenated).to.be.an('object')
      .with.property('geometries')
      .that.is.an('array')
      .of.length(expectedNumGeometries);

    expect(head(concatenated.geometries)).to.equal(head(geo.objects.country.geometries));
    expect(last(concatenated.geometries)).to.equal(last(geo.objects.states.geometries));
  });

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

    expect(extractedGeoJSON.feature.countryWithFunc).to.be.an('object')
      .that.has.property('type', 'FeatureCollection');

    // neither mesh nor feature should have key 'nonExistent'
    expect(extractedGeoJSON.mesh).to.not.have.property('nonExistent');
    expect(extractedGeoJSON.feature).to.not.have.property('nonExistent');
  });

  it('concatenates the results of extractGeoJSON into a single array', () => {
    // only Features are supported by `d3.geo.path` functions.
    expect(concatenatedGeoJSON).to.be.an('array');
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
