import topojson from 'topojson';
import { reduce } from 'lodash';
import d3 from 'd3';

/**
 * extract topojson layers as geoJSON
 * @param {Object} geo -> valid topojson
 * @param {Array} layers -> layers to include
 * @return {Object} -> { mesh: {...}, feature: {...}  }
 */
export function extractGeoJSON(topology, layers) {
  const initialMap = {
    mesh: {},
    feature: {}
  };

  const defaultMeshFilter = () => { return true; };

  return reduce(layers, (map, layer) => {
    /* eslint-disable no-param-reassign */
    // each layer is an object with keys 'name', 'type', and, optionally, 'filterFn'
    // 'name' should map to a key in topology.objects
    // 'type' is one of 'feature' or 'mesh', defaults to 'feature'

    // make certain the layer exists on the topojson
    if (!topology.objects.hasOwnProperty(layer.name)) return map;

    switch (layer.type) {
      // wrap case in braces to create local scope
      case 'mesh': {
        // if filterFn is undefined, the meshgrid will be unfiltered
        const filter = layer.filterFn || defaultMeshFilter;
        map.mesh[layer.name] = topojson.mesh(topology, topology.objects[layer.name], filter);
        break;
      }
      case 'feature': // FALL THROUGH
      default:
        map.feature[layer.name] = topojson.feature(topology, topology.objects[layer.name]);
    }

    return map;
  }, initialMap);
}

/**
 *
 * @param {Object} extractedGeoJSON -> expect type of object returned by extractGeoJSON
 * @returns {Array} array of features
 */
export function concatGeoJSON(extractedGeoJSON) {
  // iterate over each property of extractedGeoJSON ('mesh' & 'feature')
  // reduce to single array of features
  return reduce(extractedGeoJSON, (collection, type) => {
    // extractedGeoJSON[type] will be one of [extractedGeoJSON.mesh, extractedGeoJSON.feature]
    // each is an object with geoJSON features or geometric objects
    const combinedFeatures = reduce(type, (intermediateCollection, geoJSON) => {
      switch (geoJSON.type) {
        // topojson::feature will only return GeoJSON Feature or FeatureCollection
        // topojson::mesh will return GeoJSON MultiLineString
        case 'FeatureCollection':
          return intermediateCollection.concat(geoJSON.features);
        case 'MultiLineString': // FALL THROUGH
        case 'Feature':
          intermediateCollection.push(geoJSON);
          return intermediateCollection;
        default:
          return intermediateCollection;
      }
    }, []);

    return collection.concat(combinedFeatures);
  }, []);
}

/**
 * compute projected bounding box (in pixel space) of geometry
 * @param featureCollection
 * @returns {Array} [[left, top], [right, bottom]]
 */
export function computeBounds(feature) {
  return d3.geo.path().projection(null).bounds(feature);
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
 * @param {Array} bounds
 * @param {Number} width
 * @param {Number} height
 * @param {Number} proportion
 * @returns {Number}
 */
export function calcScale(bounds, width, height, proportion = 0.95) {
  // mike bostock math
  // aspectX = rightEdge - leftEdge / width
  const aspectX = (Math.abs(bounds[1][0] - bounds[0][0])) / width;

  // aspectY = bottomEdge - topEdge / height
  const aspectY = (Math.abs(bounds[1][1] - bounds[0][1])) / height;

  return (proportion / Math.max(aspectX, aspectY));
}

/**
 * calculate translations at which the topology will fit centered in its container
 * @param {Number} width
 * @param {Number} height
 * @param {Number} scale
 * @param {Array} bounds -> optional bounds of topology;
 *                          if not passed in, must pass in center
 * @param {Array} center -> optional center point of topology;
 *                          if not passed in, must pass in bounds
 * @returns {Array}
 */
export function calcTranslate(width, height, scale, bounds, center) {
  const geometryX = center ? center[0] : bounds[1][0] + bounds[0][0];
  const geometryY = center ? center[1] : bounds[1][1] + bounds[0][1];

  // mike bostock math
  return [
    (width - (scale * geometryX)) / 2,
    (height - (scale * geometryY)) / 2
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
    features: concatGeoJSON(geoJSON)
  });
}

/**
 * simple wrapper around topojson.presimplify
 * @param topology {Object} topojon
 * @returns {Object} toposjon
 */
export function simplifyTopoJSON(topology) {
  // topojson::presimplify adds z dimension to arcs
  // used for dynamic simplification
  return topojson.presimplify(topology);
}
