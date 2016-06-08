import React, { PropTypes } from 'react';
import d3 from 'd3';
import { keyBy, isEqual, mapValues } from 'lodash';
import {
  calcScale,
  calcTranslate,
  concatAndComputeGeoJSONBounds,
  extractGeoJSON
} from '../../../utils';

import style from './choropleth.css';
import FeatureLayer from './feature-layer';

const propTypes = {
  /* layers to display */
  layers: PropTypes.arrayOf(PropTypes.shape({
    // name corresponding to key within topojson objects collection
    name: PropTypes.string.isRequired,

    // whether the layer should be a feature collection or mesh grid
    // TODO mesh layer support implementation
    type: PropTypes.oneOf(['feature', 'mesh']).isRequired,

    // TODO mesh layer support implementation
    // optional function to filter mesh grid, passed adjacent geometries
    // refer to https://github.com/mbostock/topojson/wiki/API-Reference#mesh
    filterFn: PropTypes.func
  })).isRequired,

  /* full topojson */
  topology: PropTypes.shape({
    arcs: PropTypes.array,
    objects: PropTypes.object,
    transform: PropTypes.object,
    type: PropTypes.string
  }).isRequired,

  /* array of datum objects */
  data: PropTypes.arrayOf(PropTypes.object).isRequired,

  /* unique key of datum */
  keyField: PropTypes.string.isRequired,

  /* key of datum that holds the value to display */
  valueField: PropTypes.string.isRequired,

  /* fn that accepts keyfield, and returns stroke color for line */
  colorScale: PropTypes.func.isRequired,

  /* array of datum[keyField], e.g., location ids */
  selectedLocations: PropTypes.arrayOf(PropTypes.number),

  /* width of containing element, in px */
  width: PropTypes.number,

  /* height of containing element, in px */
  height: PropTypes.number,

  /* passed to each path; signature: function(event, locationId) {...} */
  onClick: PropTypes.func,

  /* passed to each path; signature: function(event, locationId) {...} */
  onMouseOver: PropTypes.func,

  /* passed to each path; signature: function(event, locationId) {...} */
  onMouseMove: PropTypes.func,

  /* passed to each path; signature: function(event, locationId) {...} */
  onMouseDown: PropTypes.func,

  /* passed to each path; signature: function(event, locationId) {...} */
  onMouseOut: PropTypes.func
};

const defaultProps = {
  layers: [],
  selectedLocations: [],
  width: 600,
  height: 400
};

/**
 * Because <Layer /> expects data to be an object with locationIds as keys
 * Need to process data as such
 * @param {Array} data -> array of datum objects
 * @param {String} keyField -> name of key field
 * @return {Object} keys are keyField (e.g., locationId), values are datum objects
 */
function processData(data, keyField) {
  return { processedData: keyBy(data, keyField) };
}

export default class Choropleth extends React.Component {
  constructor(props) {
    super(props);

    const extractedGeoJSON = this.topoToGeo(props.topology, props.layers);
    const bounds = concatAndComputeGeoJSONBounds(extractedGeoJSON);

    const scale = calcScale(props.width, props.height, bounds);
    const translate = calcTranslate(
      props.width,
      props.height,
      scale,
      bounds
    );

    this.state = {
      pathGenerator: this.createPathGenerator(scale, translate),
      scale,
      translate,
      bounds,
      ...extractedGeoJSON,
      ...processData(props.data, props.keyField)
    };
  }

  componentWillReceiveProps(newProps) {
    // build up newState
    let newState = {};

    const topologyHasChanged = newProps.topology !== this.props.topology;
    const layersHaveChanged = !isEqual(newProps.layers, this.props.layers);
    const dataHasChanged = newProps.data !== this.props.data;
    const resized = (newProps.width !== this.props.width) ||
      (newProps.height !== this.props.height);

    // if new topojson is passed in, presimplify, recalc bounds, and transform into geoJSON
    if (topologyHasChanged) {
      const extractedGeoJSON = this.topoToGeo(newProps.topology, newProps.layers);
      const bounds = concatAndComputeGeoJSONBounds(extractedGeoJSON);
      newState = {
        ...extractedGeoJSON,
        bounds
      };
    }

    // if only the layer definition has changed,
    // extract any layers from topojson that had not previously been
    if (!topologyHasChanged && layersHaveChanged) {
      const extractedGeoJSON = this.topoToGeo(newProps.topology, newProps.layers);
      const relevantGeoJSON = this.getRelevantGeoJSON(newProps.layers, extractedGeoJSON);
      const bounds = concatAndComputeGeoJSONBounds(extractedGeoJSON);
      const allGeoJSON = mapValues(relevantGeoJSON, (geoJSONMap, type) => {
        if (!this.state.hasOwnProperty(type)) return geoJSONMap;
        return { ...this.state[type], ...geoJSONMap };
      });

      newState = {
        ...newState,
        ...allGeoJSON,
        bounds
      };
    }

    // if the component has been resized, set a new base scale and translate
    if (resized) {
      const bounds = topologyHasChanged ? newState.bounds : this.state.bounds;
      const scale = calcScale(newProps.width, newProps.height, bounds);
      const translate = calcTranslate(
        newProps.width,
        newProps.height,
        scale,
        bounds
      );

      const pathGenerator = this.createPathGenerator(scale, translate);

      newState = {
        ...newState,
        scale,
        translate,
        pathGenerator
      };
    }

    // if the data has changed, transform it to be consumable by <Layer />
    if (dataHasChanged) {
      newState = {
        ...newState,
        ...processData(nextProps.data, nextProps.keyField)
      };
    }

    // if newState has any own and enumerable properties, update internal state
    if (Object.keys(newState).length) this.setState(newState);
  }

  getRelevantGeoJSON(layers, unCachedGeoJSON) {
    return layers.reduce((accum, layer) => {
      /* eslint-disable no-param-reassign */

      if (!accum.hasOwnProperty(layer.type)) accum[layer.type] = {};
      if (unCachedGeoJSON &&
        unCachedGeoJSON.hasOwnProperty(layer.type) &&
        unCachedGeoJSON[layer.type].hasOwnProperty(layer.name)) {
        accum[layer.type][layer.name] = unCachedGeoJSON[layer.type][layer.name];
      } else {
        accum[layer.type][layer.name] = this.state[layer.type][layer.name];
      }
      return accum;
    }, {});
  }

  /**
   * @param scale
   * @param translate
   * @returns {Function}
   */
  createPathGenerator(scale, translate) {
    // in a future release, this simplification projection can use the z-attribute
    // from topojson.presimplify to *actually* simplify
    const transform = d3.geo.transform({
      point(x, y) {
        // mike bostock math
        const pointX = x * scale + translate[0];
        const pointY = y * scale + translate[1];

        this.stream.point(pointX, pointY);
      }
    });

    return d3.geo.path().projection(transform);
  }

  /**
   * extract topoJSON layers as geoJSON
   * @param {Object} topology -> valid topojson
   * @param {Array} layers -> layers to include
   * @return {Object}
   */
  topoToGeo(topology, layers) {
    const unConvertedLayers = layers.filter((layer) => {
      // failsafe, check that `this` has state set up already (e.g., called within constructor)
      // and that it has a key for each type
      if (!this.hasOwnProperty('state') || !this.state.hasOwnProperty(layer.type)) return true;
      return !this.state[layer.type].hasOwnProperty(layer.name);
    });

    return extractGeoJSON(topology, unConvertedLayers);
  }

  renderLayers() {
    const {
      width,
      height,
      layers,
      keyField,
      valueField,
      colorScale,
      selectedLocations,
      onClick,
      onMouseOver,
      onMouseMove,
      onMouseDown,
      onMouseOut
    } = this.props;

    const { processedData, pathGenerator } = this.state;

    if (!width || !height) return null;

    return layers.map((layer) => {
      const key = `${layer.type}-${layer.name}`;

      return (
        <FeatureLayer
          key={key}
          features={this.state[layer.type][layer.name].features}
          data={processedData}
          keyField={keyField}
          valueField={valueField}
          pathGenerator={pathGenerator}
          colorScale={colorScale}
          selectedLocations={selectedLocations}
          onClick={onClick}
          onMouseOver={onMouseOver}
          onMouseMove={onMouseMove}
          onMouseDown={onMouseDown}
          onMouseOut={onMouseOut}
        />
      );
    });
  }

  render() {
    const { width, height } = this.props;

    return (
      <div style={{ width: `${width}px`, height: `${height}px` }} className={style.common}>
        <svg
          width={`${width}px`}
          height={`${height}px`}
          overflow="hidden"
          style={{ pointerEvents: 'all' }}
        >
          {this.renderLayers()}
        </svg>
      </div>
    );
  }
}

Choropleth.propTypes = propTypes;
Choropleth.defaultProps = defaultProps;
