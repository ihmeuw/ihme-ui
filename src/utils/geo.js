import topojson from 'topojson';
import { reduce } from 'lodash';
import d3 from 'd3';

/**
 * extract topojson layers as geoJSON
 * @param {Object} geo -> valid topojson
 * @param {Array} layers -> layers to include
 * @return {Object} -> { mesh: {...}, feature: {...}  }
 */
export const extractGeoJSON = function extractGeoJSON(topology, layers) {
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
      case 'mesh':
        // if filterFn is undefined, the meshgrid will be unfiltered
        const filter = layer.filterFn || defaultMeshFilter;
        map.mesh[layer.name] = topojson.mesh(topology, topology.objects[layer.name], filter);
        break;
      case 'feature': // FALL THROUGH
      default:
        map.feature[layer.name] = topojson.feature(topology, topology.objects[layer.name]);
    }

    return map;
    /* eslint-enable no-param-reassign */
  }, initialMap);
};

/**
 *
 * @param {Object} extractedGeoJSON -> expect type of object returned by extractGeoJSON
 * @returns {Array} array of features
 */
export const concatGeoJSON = function concatGeoJSON(extractedGeoJSON) {
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
};

/**
 * compute projected bounding box (in pixel space) of geometry
 * @param featureCollection
 * @returns {Array} [[left, top], [right, bottom]]
 */
export const computeBounds = function computeBounds(feature) {
  return d3.geo.path().projection(null).bounds(feature);
};
