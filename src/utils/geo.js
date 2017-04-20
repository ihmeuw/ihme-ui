import * as topojson from 'topojson';
import { reduce } from 'lodash';
import { geoPath } from 'd3';

const defaultMeshFilter = () => { return true; };

/**
 * extract topojson layers as geoJSON
 * @param {Object} topology -> valid topojson
 * @param {Array} layers -> layers to include
 *   each layer is an object with keys 'name', 'type', and, optionally, 'filter'
 *   'name' must map to a key in topology.objects
 *   'type' is one of 'feature' or 'mesh', defaults to 'feature'
 * @return {Object} -> { mesh: {...}, feature: {...}  }
 */
export function extractGeoJSON(topology, layers) {
  return reduce(layers, (acc, layer) => {
    // make certain the layer exists on the topojson
    if (!topology.objects.hasOwnProperty(layer.object)) return acc;

    switch (layer.type) {
      case 'mesh':
        // if filter is undefined, the mesh grid will be unfiltered
        return {
          ...acc,
          mesh: {
            ...acc.mesh,
            [layer.name]: topojson.mesh(topology,
                                        topology.objects[layer.object],
                                        layer.filter || defaultMeshFilter),
          },
        };
      case 'feature': // FALL THROUGH
      default:
        return {
          ...acc,
          feature: {
            ...acc.feature,
            [layer.name]: topojson.feature(topology, topology.objects[layer.object]),
          },
        };
    }
  }, {});
}

/**
 * Combine and return all GeoJSON 'features' in one array.
 * @param {Object} extractedGeoJSON -> expect type of object returned by extractGeoJSON
 * @returns {Array} array of features
 */
export function concatGeoJSON(extractedGeoJSON) {
  // iterate over each property of extractedGeoJSON ('mesh' & 'feature')
  // reduce to single array of features
  return reduce(extractedGeoJSON, (collection, type) => {
    // extractedGeoJSON[type] will be one of [extractedGeoJSON.mesh, extractedGeoJSON.feature]
    // each is an object with geoJSON features or geometric objects
    return [...collection, ...reduce(type, (intermediateCollection, geoJSON) => {
      switch (geoJSON.type) {
        // topojson::feature will only return GeoJSON Feature or FeatureCollection
        // topojson::mesh is excluded because it is not used in bounds calculations
        case 'FeatureCollection':
          return [...intermediateCollection, ...geoJSON.features];
        case 'Feature':
          return [...intermediateCollection, geoJSON];
        default:
          return intermediateCollection;
      }
    }, [])];
  }, []);
}

/**
 * compute projected bounding box (in pixel space) of geometry
 * @param featureCollection
 * @returns {Array} [[left, top], [right, bottom]]
 */
export function computeBounds(featureCollection) {
  return geoPath().projection(null).bounds(featureCollection);
}

/**
 * calculate center point of geometry given
 * current translation, scale, and container dimensions
 * @returns {Array}
 */
export function calcCenterPoint(width, height, scale, translate) {
  // mike bostock math
  return [(width - 2 * translate[0]) / scale, (height - 2 * translate[1]) / scale];
}

/**
 * calculate scale at which the topology will fit centered in its container
 * @param {Number} width
 * @param {Number} height
 * @param {Array} bounds
 * @param {Number} proportion
 * @returns {Number}
 */
export function calcScale(width, height, bounds, proportion = 1) {
  // mike bostock math
  // aspectX = rightEdge - leftEdge / width
  const aspectX = (Math.abs(bounds[1][0] - bounds[0][0])) / width;

  // aspectY = bottomEdge - topEdge / height
  const aspectY = (Math.abs(bounds[1][1] - bounds[0][1])) / height;

  return (proportion / Math.max(aspectX, aspectY));
}

/**
 * calculate translations at which the topology will fit centered in its container
 * @param {number} width
 * @param {number} height
 * @param {number} scale
 * @param {array} [bounds] -> optional bounds of topology;
 *                          if not passed in, must pass in center
 * @param {array} [center] -> optional center point of topology;
 *                          if not passed in, must pass in bounds
 * @returns {array}
 */
export function calcTranslate(width, height, scale, bounds = [[], []], center = []) {
  const [[x0, y0], [x1, y1]] = bounds;
  const [xC, yC] = center;
  const geometryX = xC || x1 + x0;
  const geometryY = yC || y1 + y0;

  // mike bostock math
  return [
    (width - (scale * geometryX)) / 2,
    (height - (scale * geometryY)) / 2,
  ];
}

/**
 * @param geoJSON {Object} -> expect object as returned by ihme-ui/utils/geo/extractGeoJSON
 * @returns {Array}
 */
export function concatAndComputeGeoJSONBounds(geoJSON) {
  // returns projected bounding box (in pixel space)
  // of entire geometry
  // returns [[left, top], [right, bottom]]
  return computeBounds({
    type: 'FeatureCollection',
    features: concatGeoJSON(geoJSON),
  });
}
