import React, { PropTypes } from 'react';
import d3 from 'd3';
import { assign, keyBy, isEqual, mapValues } from 'lodash';
import {
  calcCenterPoint,
  calcScale,
  calcTranslate,
  concatAndComputeGeoJSONBounds,
  extractGeoJSON,
  hasCrappyValues,
  simplifyTopoJSON
} from '../../../utils';

import style from './choropleth.css';
import FeatureLayer from './feature-layer';
import Path from './path';
import Controls from './controls';

const propTypes = {
  /* layers to display */
  layers: PropTypes.arrayOf(PropTypes.shape({
    // name corresponding to key within topojson objects collection
    name: PropTypes.string,

    // whether the layer should be a feature collection or mesh grid
    type: PropTypes.oneOf(['feature', 'mesh']),

    // optional function to filter mesh grid, passed adjacent geometries
    // refer to https://github.com/mbostock/topojson/wiki/API-Reference#mesh
    filterFn: PropTypes.func
  })),

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

  scaleFactor: PropTypes.number,

  /*
    function called by d3.behavior.zoom;
    called with current _zoomBehavior scale and translate
  */
  onZoom: PropTypes.func,

  /* passed to each path; signature: function(locationId, event) {...} */
  onClick: PropTypes.func,

  /* passed to each path; signature: function(locationId, event) {...} */
  onMouseOver: PropTypes.func,

  /* passed to each path; signature: function(locationId, event) {...} */
  onMouseMove: PropTypes.func,

  /* passed to each path; signature: function(locationId, event) {...} */
  onMouseDown: PropTypes.func,

  /* passed to each path; signature: function(locationId, event) {...} */
  onMouseOut: PropTypes.func
};

const defaultProps = {
  layers: [],
  selectedLocations: [],
  width: 600,
  height: 400,
  scaleFactor: 1.5,
  onZoom() { return; }
};

export default class Choropleth extends React.Component {
  /**
   * Because <Layer /> expects data to be an object with locationIds as keys
   * Need to process data as such
   * @param {Array} data -> array of datum objects
   * @return {Object} keys are keyField (e.g., locationId), values are datum objects
   */
  static processData(data, keyField) {
    return { processedData: keyBy(data, keyField) };
  }

  constructor(props) {
    super(props);

    const simplifiedTopoJSON = simplifyTopoJSON(props.topology);
    const extractedGeoJSON = this.topoToGeo(simplifiedTopoJSON, props.layers);
    const bounds = concatAndComputeGeoJSONBounds(extractedGeoJSON);

    const initialScale = calcScale(bounds, props.width, props.height);
    const initialTranslate = calcTranslate(
      props.width,
      props.height,
      initialScale,
      bounds
    );

    // set up _zoomBehavior behavior
    const zoomBehavior = this._zoomBehavior = d3.behavior.zoom()
      .translate(initialTranslate)
      .scale(initialScale)
      .on('zoom', () => {
        this.forceUpdate(() => {
          props.onZoom.call(null, this._zoomBehavior.scale, this._zoomBehavior.translate);
        });
      });

    // create projection
    const simplify = d3.geo.transform({
      point(x, y, z) {
        const scale = zoomBehavior.scale();
        let translate = zoomBehavior.translate();
        if (hasCrappyValues(translate)) translate = [0, 0];

        // mike bostock math
        const area = 1 / scale / scale;
        const pointX = x * scale + translate[0];
        const pointY = y * scale + translate[1];

        // if the point is significant at this _zoomBehavior level
        // stream it
        if (z >= area) this.stream.point(pointX, pointY);
      }
    });

    this.state = assign(
      {
        pathGenerator: d3.geo.path().projection(simplify),
        scale: initialScale,
        translate: initialTranslate,
      },
      { simplifiedTopoJSON, bounds },
      extractedGeoJSON,
      Choropleth.processData(props.data, props.keyField)
    );

    // bind `this`
    this.storeRef = this.storeRef.bind(this);
    this.zoomIn = () => {
      this.updateZoomBehavior.call(this, {
        direction: 'in'
      });
    };
    this.zoomOut = () => {
      this.updateZoomBehavior.call(this, {
        direction: 'out'
      });
    };
    this.zoomReset = () => {
      this.updateZoomBehavior.call(this, {
        direction: 'reset'
      });
    };
  }

  componentDidMount() {
    // bind zoom behavior to the svg
    this._svgSelection.call(this._zoomBehavior);
  }

  componentWillReceiveProps(newProps) {
    /* eslint-disable prefer-const */
    // build up newState
    // eslint doesn't know that _.assign mutates obj
    let newState = {};
    /* eslint-enable prefer-const */

    const topologyHasChanged = newProps.topology !== this.props.topology;
    const layersHaveChanged = !isEqual(newProps.layers, this.props.layers);
    const dataHasChanged = newProps.data !== this.props.data;
    const resized = (newProps.width !== this.props.width) ||
      (newProps.height !== this.props.height);

    // if new topojson is passed in, presimplify, recalc bounds, and transform into geoJSON
    if (topologyHasChanged) {
      const simplifiedTopoJSON = simplifyTopoJSON(newProps.topology);
      const extractedGeoJSON = this.topoToGeo(simplifiedTopoJSON, newProps.layers);
      const bounds = concatAndComputeGeoJSONBounds(extractedGeoJSON);
      assign(
        newState,
        { simplifiedTopoJSON },
        { extractedGeoJSON },
        { bounds }
      );
    }

    // if only the layer definition has changed,
    // extract any layers from topojson that had not previously been
    if (!topologyHasChanged && layersHaveChanged) {
      const extractedGeoJSON = this.topoToGeo(this.state.simplifiedTopoJSON, newProps.layers);
      const relevantGeoJSON = this.getRelevantGeoJSON(newProps.layers, extractedGeoJSON);
      const bounds = concatAndComputeGeoJSONBounds(extractedGeoJSON);
      const allGeoJSON = mapValues(relevantGeoJSON, (geoJSONMap, type) => {
        if (!this.state.hasOwnProperty(type)) return geoJSONMap;
        return assign({}, this.state[type], geoJSONMap);
      });

      assign(
        newState,
        allGeoJSON,
        { bounds }
      );
    }

    // if the component has been resized, set a new base scale and translate
    if (resized) {
      const bounds = topologyHasChanged ? newState.bounds : this.state.bounds;
      const scale = calcScale(bounds, newProps.width, newProps.height);
      const translate = calcTranslate(
        newProps.width,
        newProps.height,
        scale,
        bounds
      );

      assign(newState, { scale, translate });
    }

    // if the data has changed, transform it to be consumable by <Layer />
    if (dataHasChanged) assign(newState, Choropleth.processData(newProps.data, newProps.keyField));

    // if newState has any own and enumerable properties, update internal state
    // afterwards, make certain _zoomBehavior is in-sync with component state

    if (Object.keys(newState).length) {
      const prevWidth = this.props.width;
      const prevHeight = this.props.height;
      this.setState(newState, () => {
        this.updateZoomBehavior({
          direction: 'constant',
          forceUpdate: false,
          width: newProps.width,
          height: newProps.height,
          prevWidth,
          prevHeight
        });
      });
    }
  }

  componentWillUnmount() {
    // remove zoom behavior
    this._svgSelection.on('.zoom', null);
  }

  getRelevantGeoJSON(layers, unCachedGeoJSON) {
    /* eslint-disable no-param-reassign */
    return layers.reduce((accum, layer) => {
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
    /* eslint-enable no-param-reassign */
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

  updateZoomBehavior({
    direction,
    forceUpdate = true,
    width = this.props.width,
    height = this.props.height,
    prevWidth,
    prevHeight
  }) {
    const { scaleFactor } = this.props;
    const { scale: originalScale, translate: originalTranslate } = this.state;
    const currentScale = this._zoomBehavior.scale();

    let newScale;
    let newTranslate;
    const center = calcCenterPoint(width, height, currentScale, this._zoomBehavior.translate());

    switch (direction) {
      case 'in':
        newScale = currentScale * scaleFactor;
        newTranslate = calcTranslate(width, height, newScale, null, center);
        break;
      case 'out':
        newScale = currentScale / scaleFactor;
        newTranslate = calcTranslate(width, height, newScale, null, center);
        break;
      case 'reset':
        newScale = originalScale;
        newTranslate = originalTranslate;
        break;
      case 'constant':
      default:
        // takes the ratio of the new area and the old area of the windows.
        // if the new area is smaller than the old area then the new scale
        // will be proporitinally smaller than the old scale cause a zoom out
        // and vice versa when the new area is larger than the old area.
        newScale = currentScale * (width * height) / (prevWidth * prevHeight);
        newTranslate = calcTranslate(width, height, newScale, null, center);

    }

    // scale and translate the zoomBehavior behavior
    this._zoomBehavior
      .translate(newTranslate)
      .scale(newScale);

    this._svgSelection.call(this._zoomBehavior.event);
    if (forceUpdate) this.forceUpdate();
  }

  storeRef(ref) {
    this._svgSelection = ref ? d3.select(ref) : null;
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

      if (layer.type === 'mesh') {
        return (
          <Path
            key={key}
            feature={this.state.mesh[layer.name]}
            pathGenerator={pathGenerator}
            fill="none"
          />
        );
      }
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
        <Controls
          onZoomIn={this.zoomIn}
          onZoomReset={this.zoomReset}
          onZoomOut={this.zoomOut}
        />
        <svg
          ref={this.storeRef}
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
