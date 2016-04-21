import React, { PropTypes } from 'react';
import d3 from 'd3';
import topojson from 'topojson';
import { mapValues, assign, keyBy, reduce } from 'lodash';

import style from './choropleth.css';
import Layer from './layer';
import Controls from './controls';

const propTypes = {
  /* layers to display */
  layers: PropTypes.arrayOf(PropTypes.string),

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

  /*
    function called by d3.behavior.zoom;
    called with current _zoomBehavior scale and translate
  */
  zoomHandler: PropTypes.func,

  /* passed to path; partially applied fn that takes in datum and returns fn */
  clickHandler: PropTypes.func,

  /* passed to path; partially applied fn that takes in datum and returns fn */
  hoverHandler: PropTypes.func
};

const defaultProps = {
  layers: [],
  selectedLocations: [],
  width: 600,
  height: 400,
  zoomHandler() { return; }
};

export default class Choropleth extends React.Component {
  constructor(props) {
    super(props);

    const processedJSON = this.processJSON(props.topology);
    const initialScale = this.calcScale(processedJSON.bounds, props.width, props.height);
    const initialTranslate = this.calcTranslate(
      props.width,
      props.height,
      initialScale,
      processedJSON.bounds
    );

    // set up _zoomBehavior behavior
    const zoomBehavior = this._zoomBehavior = d3.behavior.zoom()
      .translate(initialTranslate)
      .scale(initialScale)
      .on('zoom', () => {
        const { scale, translate } = this.state;

        // keep track of difference between current zoomBehavior scale and
        // the scale of the geometries that would roughly fit the bounds of the container
        const deltaScale = this._zoomBehavior.scale() - scale;

        // keep track of difference between current zoomBehavior translate and
        // the translation of the geometries that would center the map within the container
        const deltaTranslate = [
          this._zoomBehavior.translate()[0] - translate[0],
          this._zoomBehavior.translate()[1] - translate[1]
        ];

        this.setState({
          deltaScale,
          deltaTranslate
        }, () => {
          props.zoomHandler.call(null, this._zoomBehavior.scale, this._zoomBehavior.translate);
        });
      });

    // create projection
    const simplify = d3.geo.transform({
      point(x, y, z) {
        const scale = zoomBehavior.scale();
        const translate = zoomBehavior.translate();

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
        deltaScale: 0,
        translate: initialTranslate,
        deltaTranslate: [0, 0]
      },
      processedJSON,
      this.processData(props.data, props.keyField)
    );

    // bind `this`
    this.storeRef = this.storeRef.bind(this);
    this.zoomIn = () => {
      this.zoom.call(this, 'in');
    };
    this.zoomOut = () => {
      this.zoom.call(this, 'out');
    };
    this.zoomReset = () => {
      this.zoom.call(this, 'reset');
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
    const dataHasChanged = newProps.data !== this.props.data;
    const resized = (newProps.width !== this.props.width) ||
      (newProps.height !== this.props.height);

    // if new topojson is passed in, presimplify, recalc bounds, and transform into geoJSON
    if (topologyHasChanged) assign(newState, this.processJSON(newProps.topology));

    // if the component has been resized, set a new base scale and translate
    if (resized) {
      const bounds = topologyHasChanged ? newState.bounds : this.state.bounds;
      const scale = this.calcScale(bounds, newProps.width, newProps.height);
      const translate = this.calcTranslate(
        newProps.width,
        newProps.height,
        scale,
        bounds
      );

      assign(newState, { scale, translate });
    }

    // if the data has changed, transform it to be consumable by <Layer />
    if (dataHasChanged) assign(newState, this.processData(newProps.data, newProps.keyField));

    // if newState has any own and enumerable properties, update internal state
    // afterwards, make certain _zoomBehavior is in-sync with component state
    if (Object.keys(newState).length) this.setState(newState, this.updateZoomBehavior);
  }

  componentWillUnmount() {
    // remove zoom behavior
    this._svgSelection.on('.zoom', null);
  }

  /**
   * calculate center point of geometry given
   * current translation, scale, and container dimensions
   * @returns {Array}
   */
  calcCenterPoint() {
    const { width, height } = this.props;
    const scale = this._zoomBehavior.scale();
    const translate = this._zoomBehavior.translate();

    // mike bostock math
    return [(width - 2 * translate[0]) / scale, (height - 2 * translate[1]) / scale];
  }

  /**
   * calculate scale at which the topology will fit centered in its container
   * @param {Array} bounds
   * @param {Number} width
   * @param {Number} height
   * @returns {Number}
   */
  calcScale(bounds, width, height) {
    // mike bostock math
    // aspectX = rightEdge - leftEdge / width
    const aspectX = (Math.abs(bounds[1][0] - bounds[0][0])) / width;

    // aspectY = bottomEdge - topEdge / height
    const aspectY = (Math.abs(bounds[1][1] - bounds[0][1])) / height;

    return (0.95 / Math.max(aspectX, aspectY));
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
  calcTranslate(width, height, scale, bounds, center) {
    const geometryX = center ? center[0] : bounds[1][0] + bounds[0][0];
    const geometryY = center ? center[1] : bounds[1][1] + bounds[0][1];

    // mike bostock math
    return [
      (width - (scale * geometryX)) / 2,
      (height - (scale * geometryY)) / 2
    ];
  }

  updateZoomBehavior() {
    const { scale, deltaScale, translate, deltaTranslate } = this.state;

    // scale and translate the zoomBehavior behavior
    this._zoomBehavior
      .translate([
        translate[0] + deltaTranslate[0],
        translate[1] + deltaTranslate[1]
      ])
      .scale(scale * deltaScale);

    this._svgSelection.call(this._zoomBehavior.event);
  }

  zoom(direction) {
    const { width, height } = this.props;
    const { scale, translate } = this.state;
    let deltaScale = Math.abs(this.state.deltaScale);

    // if deltaScale is below -1e4, set to zero
    deltaScale = deltaScale < 0.01 ? 0 : deltaScale;

    const center = this.calcCenterPoint();
    const newState = {};
    let adjustedScale;
    let adjustedTranslate;

    switch (direction) {
      case 'in':
        // initially, deltaScale = 0
        if (!deltaScale) deltaScale = scale * 0.05;

        newState.deltaScale = deltaScale * 1.5;
        adjustedScale = scale + newState.deltaScale;
        adjustedTranslate = this.calcTranslate(width, height, adjustedScale, null, center);
        newState.deltaTranslate = [
          adjustedTranslate[0] - translate[0],
          adjustedTranslate[1] - translate[1]
        ];
        break;
      case 'out':
        // initially, deltaScale = 0
        if (!deltaScale) deltaScale = -(scale * 0.05);

        newState.deltaScale = deltaScale / 1.5;
        adjustedScale = scale + newState.deltaScale;
        adjustedTranslate = this.calcTranslate(width, height, adjustedScale, null, center);
        newState.deltaTranslate = [
          adjustedTranslate[0] - translate[0],
          adjustedTranslate[1] - translate[1]
        ];
        break;
      case 'reset': // FALL THROUGH
      default:
        newState.deltaScale = 0;
        newState.deltaTranslate = [0, 0];
    }

    // store new state
    // afterwards sync zoomBehavior with component state
    this.setState(newState, this.updateZoomBehavior);
  }

  /**
   * process topojson for dynamic simplification
   * measure it's full bounds
   * and extract its layers as geoJSON
   * @param {Object} geo -> valid topojson
   * @return {Object}
   */
  processJSON(topology) {
    // topojson::presimplify adds z dimension to arcs
    // used for dynamic simplification
    const simplifiedTopoJSON = topojson.presimplify(topology);

    // transform each object in TopoJSON into GeoJSON
    const extractedGeoJSON = mapValues(simplifiedTopoJSON.objects, (layer) => {
      return topojson.feature(simplifiedTopoJSON, layer);
    });

    return {
      simplifiedTopoJSON,
      // store projected bounding box (in pixel space)
      // of entire geometry
      // returns [[left, top], [right, bottom]]
      bounds: d3.geo.path().projection(null).bounds({
        type: 'FeatureCollection',
        features: reduce(extractedGeoJSON, (collection, obj) => {
          // topojson::feature will only return GeoJSON Feature or FeatureCollection
          switch (obj.type) {
            case 'FeatureCollection':
              return collection.concat(obj.features);
            case 'Feature':
              collection.push(obj);
              return collection;
            default:
              return collection;
          }
        }, [])
      }),
      ...extractedGeoJSON
    };
  }

  /**
   * Because <Layer /> expects data to be an object with locationIds as keys
   * Need to process data as such
   * @param {Array} data -> array of datum objects
   * @return {Object} keys are keyField (e.g., locationId), values are datum objects
   */
  processData(data, keyField) {
    return { processedData: keyBy(data, keyField) };
  }

  storeRef(ref) {
    this._svgSelection = ref ? d3.select(ref) : null;
  }

  renderLayers() {
    const {
      layers,
      keyField,
      valueField,
      colorScale,
      selectedLocations,
      clickHandler,
      hoverHandler
    } = this.props;

    const { processedData, pathGenerator } = this.state;

    return layers.map(layer => {
      return (
        <Layer
          key={layer}
          features={this.state[layer].features}
          data={processedData}
          keyField={keyField}
          valueField={valueField}
          pathGenerator={pathGenerator}
          colorScale={colorScale}
          selectedLocations={selectedLocations}
          clickHandler={clickHandler}
          hoverHandler={hoverHandler}
        />
      );
    });
  }

  render() {
    const { width, height } = this.props;

    return (
      <div width={`${width}px`} height={`${height}px`} className={style.common}>
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
          style={{ pointEvents: 'all' }}
        >
          {this.renderLayers()}
        </svg>
      </div>
    );
  }
}

Choropleth.propTypes = propTypes;
Choropleth.defaultProps = defaultProps;
