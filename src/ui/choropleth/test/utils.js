import * as topojson from 'topojson';

export const topology = {
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
      arcs: [[0], [2], [5], [3]],
      id: 4,
      properties: {
        loc_id: 4,
      },
      type: 'MultiLineString',
    }
  },
};

export const getGeoJSON = (feature, type = 'feature') => {
  if (!topology.objects[feature]) {
    throw new Error(
      `${feature} is not within the objects collection of the test topojson`
    );
  }

  if (type === 'mesh') return topojson.mesh(topology, topology.objects[feature]);
  return topojson.feature(topology, topology.objects[feature]);
};

export const getLocationIds = (features) => features.map(feature => feature.id);
