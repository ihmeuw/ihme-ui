import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Set from 'collections/set';
import {
  assign,
  bindAll,
  keyBy,
  flatMap,
  filter,
  intersectionWith,
  isEqual,
  map,
  toString,
} from 'lodash';


import { scaleLinear } from 'd3';
import Button from '../../../button';
import Choropleth from '../../../choropleth';
import ChoroplethLegend from '../../choropleth-legend';
import ResponsiveContainer from '../../../responsive-container';
import {
  clampedScale,
  CommonPropTypes,
  concatTopoJSON,
  linspace,
  memoizeByLastCall,
  numFromPercent,
  propResolver,
  stateFromPropUpdates,
  shouldPureComponentUpdate,
  colorSteps as defaultColorSteps,
} from '../../../../utils';

import styles from './style.css';

console.log(styles.title);
console.log(styles);

/**
 * @param {Array} extentPct
 * @param {Array} domain
 * @return {Array}
 */
export function getRangeExtent([x1Pct, x2Pct], domain) {
  return [numFromPercent(x1Pct, domain), numFromPercent(x2Pct, domain)];
}

/**
 *
 * @param {Array} data
 * @param {Array} locationIdsOnMap - return value from `getGeometryIds`
 */
export const filterData = memoizeByLastCall((data, locationIdsOnMap, keyField) =>
  /* eslint-disable eqeqeq */
  intersectionWith(data, locationIdsOnMap, (datum, locId) => propResolver(datum, keyField) == locId)
  /* eslint-enable eqeqeq */
);

/**
 * `import { Map } from 'ihme-ui'`
 *
 * `<Map />` is a composition of `<Choropleth />` and `<ChoroplethLegend />`.
 * It provides a mesh-filter-based implementation for displaying disputed territories. In order to take advantage of this feature,
 * your topojson must conform to the following requirements:
 *  - geometries that are disputed must have an array of ids on their `properties` object on a key named `disputes`.
 *  - the above ids must be resolvable by `props.geometryKeyField`
 *
 * [See it in action!](http://vizhub.healthdata.org/mortality/age-estimation)
 *
 */
export default class Map extends React.Component {
  /**
   * @description Classifies arcs of a topojson collection.
   * This function is passed to `topojson.mesh` which calls it for every arc passing in an array of
   * features adjacent to the arc.
   *
   * @param geometryKeyField - field to resolve property on topojson feature object for geometry.
   * @param matches - array of topojson features adjacent to the arc.
   * @param selected - array of selected location ids.
   * @returns {string} one of three classifiers: ('selected-non-disputed-borders'|'disputed-borders'|'non-disputed-borders')
   */
  static classifyArc(geometryKeyField, matches, selected = []) {
    const nonDisputedLocations = new Set();
    // Locations that claim any disputed locations in the match.
    const claimants = new Set();
    // Locations that administer data for any disputed locations in the match.
    const admins = new Set();

    matches.forEach((feature) => {
      const { properties } = feature;
      const locId = propResolver(feature, geometryKeyField);

      // If a locId exists the feature is not disputed.
      if (locId) {
        nonDisputedLocations.add(locId);
      } else {
        claimants.addEach(properties.claimants);
        admins.addEach(properties.admins);
      }
    });

    // List of nonDisputedLocations that don't exist in both `admins` and `nonDisputedLocations`.
    // The resulting list will be of:
    // - non-disputed in the match that don't administer any (disputed) locations in the match.
    // - locations that administer a disputed location in the match that are not themselves in the match.
    const xorLocations = nonDisputedLocations.symmetricDifference(admins);
    // Convenience function that tests if a value is in `xorLocations`
    const isXorLocation = xorLocations.has.bind(xorLocations);
    // Convenience function that tests if a value is in `claimants`
    const isClaimant = claimants.has.bind(claimants);

    // There is only one `nonDisputedLocations`.
    const isExternal = nonDisputedLocations.size === 1;
    // All `nonDisputedLocations` are in `claimants` and `claimants` is not empty.
    const isDisputed = claimants.size && nonDisputedLocations.every(isClaimant);
    // `selected` intersects one of `xorLocations` or `claimants`, and does not intersect both.
    const isSelected = selected.some(isXorLocation) !== selected.some(isClaimant);

    if (isSelected) {
      return 'selected-non-disputed-borders';
    } else if (!isExternal && isDisputed) {
      return 'disputed-borders';
    }

    return 'non-disputed-borders';
  }

  constructor(props) {
    super(props);

    const { colorSteps, domain, extentPct } = props;
    const rangeExtent = getRangeExtent(extentPct, domain);

    bindAll(this, [
      'createLayers',
      'getGeometryIds',
      'meshFilter',
      'onSetScale',
      'onResetScale',
    ]);

    const state = {
      colorScale: clampedScale('#ccc', 0.000001)
        .base(scaleLinear())
        .domain(linspace(rangeExtent, colorSteps.length))
        .range(colorSteps),
      render: !props.loading,
    };

    this.state = stateFromPropUpdates(Map.propUpdates, {}, props, state, this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(stateFromPropUpdates(Map.propUpdates, this.props, nextProps, this.state, this));
  }

  shouldComponentUpdate(nextProps, nextState) {
    // only update if data is not being currently loaded,
    // and when props have changed,
    return !nextProps.loading
            && shouldPureComponentUpdate(this.props, this.state, nextProps, nextState);
  }

  onSetScale() {
    const { colorSteps, domain, extentPct, onSetScale } = this.props;
    const rangeExtent = getRangeExtent(extentPct, domain);
    this.setState({
      colorScale: this.state.colorScale
        .clamps(rangeExtent)
        .domain(linspace(rangeExtent, colorSteps.length))
        .copy(),
      setScaleExtentPct: extentPct,
    }, () => {
      if (typeof onSetScale === 'function') onSetScale(rangeExtent);
    });
  }

  onResetScale() {
    const { colorSteps, domain, onResetScale } = this.props;
    this.setState({
      colorScale: this.state.colorScale
        .clamps(domain)
        .domain(linspace(domain, colorSteps.length))
        .copy(),
      setScaleExtentPct: null,
    }, () => {
      if (typeof onResetScale === 'function') onResetScale(domain);
    });
  }

  /**
   * returns array of location ids of visible geometries on the choropleth
   * @param {object} topojson
   * @param {array} layers
   * @returns {array}
   */
  getGeometryIds(topojson, layers) {
    const { geometryKeyField } = this.props;
    const layerNameToConfigMap = keyBy(layers, 'name');
    const relevantObjects = filter(topojson.objects, (_, key) => layerNameToConfigMap[key]);
    return flatMap(relevantObjects, (object) =>
      object.geometries.map((geometry) =>
        propResolver(geometry, geometryKeyField)
      )
    );
  }

  meshFilter(meshType, ...matches) {
    const { geometryKeyField } = this.props;
    const { keysOfSelectedLocations } = this.state;
    return meshType === Map.classifyArc(geometryKeyField, matches, keysOfSelectedLocations);
  }

  createLayers(layers) {
    const styleReset = { stroke: 'none' };
    const features = map(layers, layer => (
      {
        name: layer,
        object: layer,
        style: styleReset,
        selectedStyle: styleReset,
        type: 'feature',
      }
    ));

    const concatenatedLayers = memoizeByLastCall(
      topoObjects => concatTopoJSON(topoObjects, layers)
    );

    const meshes = [
      {
        name: 'disputed-borders',
        object: concatenatedLayers,
        style: { stroke: 'black', strokeWidth: '1px', strokeDasharray: '5, 5' },
        type: 'mesh',
        meshFilter: this.meshFilter.bind(this, 'disputed-borders'),
      },
      {
        name: 'non-disputed-borders',
        object: concatenatedLayers,
        style: { stroke: 'black', strokeWidth: '1px' },
        type: 'mesh',
        meshFilter: this.meshFilter.bind(this, 'non-disputed-borders'),
      },
      {
        name: 'selected-non-disputed-borders',
        object: concatenatedLayers,
        style: { stroke: 'black', strokeWidth: '2px' },
        type: 'mesh',
        meshFilter: this.meshFilter.bind(this, 'selected-non-disputed-borders'),
      },
    ];

    return [...features, ...meshes];
  }

  renderTitle() {
    const { title, titleClassName, titleStyle } = this.props;
    if (!title) return null;
    return (
      <div className={classNames(styles.title, titleClassName)} style={titleStyle}>{title}</div>
    );
  }

  renderMap() {
    const {
      colorAccessor,
      data,
      focus,
      focusedClassName,
      focusedStyle,
      keyField,
      geometryKeyField,
      mapClassName,
      mapStyle,
      onClick,
      onMouseLeave,
      onMouseMove,
      onMouseOver,
      selectedLocations,
      topology,
      valueField,
      zoomControlsClassName,
      zoomControlsStyle,
    } = this.props;
    const { colorScale, layers } = this.state;

    if (!topology) return null;
    return (
      <div className={classNames(styles.map, mapClassName)} style={mapStyle}>
        <ResponsiveContainer>
          <Choropleth
            colorAccessor={colorAccessor}
            colorScale={colorScale}
            controls
            controlsClassName={zoomControlsClassName}
            controlsStyle={zoomControlsStyle}
            data={data}
            focus={focus}
            focusedClassName={focusedClassName}
            focusedStyle={focusedStyle}
            geometryKeyField={geometryKeyField}
            keyField={keyField}
            layers={layers}
            onClick={onClick}
            onMouseLeave={onMouseLeave}
            onMouseMove={onMouseMove}
            onMouseOver={onMouseOver}
            selectedLocations={selectedLocations}
            topology={topology}
            valueField={valueField}
          />
        </ResponsiveContainer>
      </div>
    );
  }

  renderLegend() {
    const {
      axisTickFormat,
      colorAccessor,
      colorSteps,
      data,
      domain,
      extentPct,
      focus,
      focusedClassName,
      focusedStyle,
      keyField,
      legendClassName,
      legendMargins,
      legendStyle,
      onClick,
      onMouseLeave,
      onMouseMove,
      onMouseOver,
      onSliderMove,
      selectedLocations,
      sliderHandleFormat,
      unit,
      valueField,
    } = this.props;

    const {
      colorScale,
      locationIdsOnMap,
      setScaleExtentPct,
    } = this.state;

    const linearGradientStops = setScaleExtentPct || [0, 1];
    const rangeExtent = getRangeExtent(extentPct, domain);

    return (
      <div className={classNames(styles.legend, legendClassName)} style={legendStyle}>
        <div className={styles['legend-wrapper']}>
          <ResponsiveContainer>
            <ChoroplethLegend
              axisTickFormat={axisTickFormat}
              colorAccessor={colorAccessor}
              colorSteps={colorSteps}
              colorScale={colorScale}
              data={filterData(data, locationIdsOnMap, keyField)}
              domain={domain}
              focus={focus}
              focusedClassName={focusedClassName}
              focusedStyle={focusedStyle}
              keyField={keyField}
              margins={legendMargins}
              onClick={onClick}
              onMouseLeave={onMouseLeave}
              onMouseMove={onMouseMove}
              onMouseOver={onMouseOver}
              onSliderMove={onSliderMove}
              rangeExtent={rangeExtent}
              selectedLocations={selectedLocations}
              sliderHandleFormat={sliderHandleFormat}
              unit={unit}
              valueField={valueField}
              x1={linearGradientStops[0] * 100}
              x2={linearGradientStops[1] * 100}
            />
          </ResponsiveContainer>
        </div>
        <div className={styles['button-wrapper']}>
          <Button
            className={styles.button}
            onClick={this.onSetScale}
            text="Set scale"
          />
          <Button
            className={styles.button}
            onClick={this.onResetScale}
            text="Reset"
          />
        </div>
      </div>
    );
  }

  render() {
    const { className, style } = this.props;
    const { render } = this.state;

    return (
      <div className={classNames(styles['map-container'], className)} style={style}>
        {render && this.renderMap()}
        {render && this.renderTitle()}
        {render && this.renderLegend()}
      </div>
    );
  }
}

Map.propTypes = {
  /**
   * [format of axis ticks](https://github.com/d3/d3-axis#axis_tickFormat)
   * implicitly defaults to [numberFormat](https://github.com/ihmeuw/ihme-ui/blob/docs/src/utils/numbers.js#L9)
   */
  axisTickFormat: PropTypes.func,

  /**
   * className applied to outermost wrapping div
   */
  className: CommonPropTypes.className,

  /**
   * accepts value of `keyfield` (str), returns stroke color for line (str)
   */
  colorAccessor: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
  ]),

  /**
   * list of hex or rbg color values
   * color scale will interpolate between these values
   * defaults to list of 11 colors with blue at the "bottom" and red at the "top"
   * this encodes IHME's "high numbers are bad" color scheme
  */
  colorSteps: PropTypes.array,

  /**
   * array of datum objects
   */
  data: PropTypes.array.isRequired,

  /**
   * domain of color scale
   */
  domain: PropTypes.array.isRequired,

  /**
   * The datum object corresponding to the `<Shape />` currently focused.
   */
  focus: PropTypes.object,

  /**
   * className applied if `<Shape />` has focus.
   */
  focusedClassName: CommonPropTypes.className,

  /**
   * inline styles applied to focused `<Shape />`
   * If an object, spread into inline styles.
   * If a function, passed underlying datum corresponding to its `<Shape />`,
   * and return value is spread into inline styles;
   * signature: (datum) => obj
   */
  focusedStyle: CommonPropTypes.style,

  /**
   * [minPercent, maxPercent] of color scale domain to place slider handles
   */
  extentPct: PropTypes.array,

  /**
   * uniquely identifying field of geometry objects;
   * if a function, will be called with the geometry object as first parameter
   * N.B.: the resolved value of this prop should match the resolved value of `props.keyField`
   * e.g., if data objects are of the following shape: { location_id: <number>, mean: <number> }
   * and if features within topojson are of the following shape: { type: <string>, properties: { location_id: <number> }, arcs: <array> }
   * `keyField` may be one of the following: 'location_id', or (datum) => datum.location_id
   * `geometryKeyField` may be one of the following: 'location_id' or (feature) => feature.properties.location_id
   */
  geometryKeyField: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
  ]).isRequired,

  /**
   * unique key of datum;
   * if a function, will be called with the datum object as first parameter
   */
  keyField: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
  ]).isRequired,

  /**
   * classname applied to div containing choropleth legend
   */
  legendClassName: CommonPropTypes.className,

  /**
   * margins passed to `<ChoroplethLegend />`
   * subtracted from width and height of `<ChoroplethLegend />`
   */
  legendMargins: PropTypes.shape({
    top: PropTypes.number,
    right: PropTypes.number,
    bottom: PropTypes.number,
    left: PropTypes.number,
  }),

  /**
   * inline style object applied to div containing choropleth legend
   */
  legendStyle: PropTypes.object,

  /**
   * is data for this component currently being fetched
   * will prevent component from updating (a la shouldComponentUpdate) if true
   */
  loading: PropTypes.bool,

  /**
   * className applied to div directly wrapping `<Choropleth />`
   */
  mapClassName: CommonPropTypes.className,

  /**
   * inline styles applied to div directly wrapping `<Choropleth />`
   */
  mapStyle: CommonPropTypes.style,

  /**
   * event handler passed to both choropleth and choropleth legend;
   * signature: (SyntheticEvent, datum, Path) => {...}
   */
  onClick: PropTypes.func,

  /**
   * event handler passed to both choropleth and choropleth legend;
   * signature: (SyntheticEvent, datum, Path) => {...}
   */
  onMouseLeave: PropTypes.func,

  /**
   * event handler passed to both choropleth and choropleth legend;
   * signature: (SyntheticEvent, datum, Path) => {...}
   */
  onMouseMove: PropTypes.func,

  /**
   * event handler passed to both choropleth and choropleth legend;
   * signature: (SyntheticEvent, datum, Path) => {...}
   */
  onMouseOver: PropTypes.func,

  /**
   * callback for "Set scale" button;
   * passed current rangeExtent (in data space) as first and only argument
   * signature: ([min, max]) => {...}
   */
  onSetScale: PropTypes.func,

  /**
   * callback function to attach to slider handles;
   * passed [min, max] (Array), the range extent as a percentage
   * signature: ([min, max]) => {...}
   */
  onSliderMove: PropTypes.func.isRequired,

  /**
   * callback for "Reset" button;
   * passed current rangeExtent (in data space) as first and only argument
   * rangeExtent in this case will always equal this.props.domain
   * signature: (domain) => {...}
   */
  onResetScale: PropTypes.func.isRequired,

  /**
   * array of selected location objects
   */
  selectedLocations: PropTypes.arrayOf(PropTypes.object),

  /**
   * format of slider handle labels
   * implicitly defaults to [numberFormat](https://github.com/ihmeuw/ihme-ui/blob/docs/src/utils/numbers.js#L9)
   */
  sliderHandleFormat: PropTypes.func,

  /**
   * inline styles applied to outermost wrapping div
   */
  style: PropTypes.object,

  /**
   * title positioned on top of choropleth
   * in semi-opaque div that spans the full width of the component
   */
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),

  /**
   * className applied to div wrapping the title
   */
  titleClassName: CommonPropTypes.className,

  /**
   * inline styles applied to div wrapping the title
   */
  titleStyle: PropTypes.object,

  /**
   * array of keys on topology.objects (e.g., ['national', 'ADM1', 'health_districts']);
   * if a key on topology.objects is omitted, it will not be rendered
   * if including disputed territories as separate layers, the disputes layer must be either
   * first or last in the array. E.g.: ['admin0', 'admin1', 'admin2', 'admin2_disputes']
   */
  topojsonObjects: PropTypes.arrayOf(PropTypes.string),

  /**
   * preprojected topojson;
   * for more information, see the [topojson wiki](https://github.com/topojson/topojson/wiki)
   */
  topology: PropTypes.shape({
    objects: PropTypes.object.isRequired,
  }).isRequired,

  /**
   * unit of data;
   * used as axis label in choropleth legend
   */
  unit: PropTypes.string,

  /**
   * key of datum that holds the value to display (e.g., 'mean')
   * if a function, signature: (data, feature) => value
   */
  valueField: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
  ]).isRequired,

  /**
   * className applied to controls container div
   */
  zoomControlsClassName: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
  ]),

  /**
   * inline styles to apply to controls buttons
   */
  zoomControlsStyle: PropTypes.object,
};

Map.defaultProps = {
  colorSteps: defaultColorSteps.slice().reverse(),
  extentPct: [0, 1],
  legendMargins: {
    top: 20,
    right: 50,
    bottom: 0,
    left: 50,
  },
  loading: false,
  selectedLocations: [],
  topojsonObjects: ['national'],
};

Map.propUpdates = {
  colorSteps: (state, _, prevProps, nextProps) => {
    if (nextProps.colorSteps === prevProps.colorSteps) return state;
    return assign({}, state, {
      colorScale: state.colorScale
        .range(nextProps.colorSteps)
        .copy(),
    });
  },
  domain: (state, _, prevProps, nextProps) => {
    if (isEqual(nextProps.domain, prevProps.domain)) return state;
    const domain = state.setScaleExtentPct
      ? getRangeExtent(state.setScaleExtentPct, nextProps.domain)
      : nextProps.domain;
    const clamp = getRangeExtent(nextProps.extentPct, nextProps.domain);
    return assign({}, state, {
      colorScale: state.colorScale
        .clamps(clamp)
        .domain(linspace(domain, nextProps.colorSteps.length))
        .copy(),
    });
  },
  extent: (state, _, prevProps, nextProps) => {
    if (isEqual(nextProps.extentPct, prevProps.extentPct)) return state;
    const rangeExtent = getRangeExtent(nextProps.extentPct, nextProps.domain);
    return assign({}, state, {
      colorScale: state.colorScale.clamps(rangeExtent).copy(),
    });
  },
  render: (state, _, prevProps, nextProps) => {
    if (!state.render && !nextProps.loading) {
      return assign({}, state, { render: true });
    }
    return state;
  },
  selections: (state, _, prevProps, nextProps, context) => {
    if (isEqual(nextProps.selectedLocations, prevProps.selectedLocations)) return state;
    const keysOfSelectedLocations = map(nextProps.selectedLocations, datum =>
      toString(propResolver(datum, nextProps.keyField))
    );
    const layers = context.createLayers(nextProps.topojsonObjects);

    return assign({}, state, {
      keysOfSelectedLocations,
      layers,
    });
  },
  topojsonObjects: (state, _, prevProps, nextProps, context) => {
    // if map detail level is changed,
    // filter layers passed to choropleth and update internal mapping of which datum have a
    // corresponding geometry displayed on the choropleth
    if (isEqual(prevProps.topojsonObjects, nextProps.topojsonObjects)) return state;

    const layers = context.createLayers(nextProps.topojsonObjects);
    return assign({}, state, {
      layers,
      locationIdsOnMap: context.getGeometryIds(nextProps.topology, layers),
    });
  },
};
