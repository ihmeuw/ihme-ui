import React, { PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import classNames from 'classnames';
import {
  assign,
  bindAll,
  keyBy,
  flatMap,
  filter,
  get as getValue,
  includes,
  intersectionWith,
  isEqual,
  map,
  toString,
} from 'lodash';
import { scaleLinear } from 'd3';
import Button from '../../../button';
import Choropleth from '../../../choropleth';
import ChoroplethLegend from '../../../choropleth-legend';
import ResponsiveContainer from '../../../responsive-container';
import {
  clampedScale,
  CommonPropTypes,
  linspace,
  numFromPercent,
  propResolver,
  stateFromPropUpdates,
  colorSteps as defaultColorSteps,
} from '../../../../utils';

import styles from './style.css';

/**
 * this function is a direct copy of `defaultMemoize` from reselect (https://github.com/reactjs/reselect)
 * copied here to avoid dependency for the benefit of a single utility function
 * memoize a function based on most recently passed-in arguments
 * @param {function} func
 * @return {function(...[*])}
 */
function memoizeByLastCall(func) {
  let lastArgs = null;
  let lastResult = null;
  return (...args) => {
    if (
      lastArgs !== null &&
      lastArgs.length === args.length &&
      args.every((value, index) => value === lastArgs[index])
    ) {
      return lastResult;
    }
    lastResult = func(...args);
    lastArgs = args;
    return lastResult;
  };
}

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
  constructor(props) {
    super(props);

    const { colorSteps, domain, extentPct, topojsonObjects } = props;
    const rangeExtent = getRangeExtent(extentPct, domain);

    bindAll(this, [
      'createLayers',
      'disputedBordersMeshFilter',
      'getGeometryIds',
      'nonDisputedBordersMeshFilter',
      'selectedBordersMeshFilter',
      'onSetScale',
      'onResetScale',
    ]);

    const layers = flatMap(topojsonObjects, this.createLayers);

    const state = {
      colorScale: clampedScale('#ccc', 0.000001)
        .base(scaleLinear())
        .domain(linspace(rangeExtent, colorSteps.length))
        .range(colorSteps),
      layers,
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
            && PureRenderMixin.shouldComponentUpdate.call(this, nextProps, nextState);
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

  disputedBordersMeshFilter(geometry, neighborGeometry) {
    /* eslint-disable max-len */
    const { geometryKeyField } = this.props;
    return geometry !== neighborGeometry && (
      includes(getValue(geometry, ['properties', 'disputes'], []), propResolver(neighborGeometry, geometryKeyField)) ||
      includes(getValue(neighborGeometry, ['properties', 'disputes'], []), propResolver(geometry, geometryKeyField))
    );
    /* eslint-enable max-len */
  }

  nonDisputedBordersMeshFilter(geometry, neighborGeometry) {
    /* eslint-disable max-len */
    const { geometryKeyField } = this.props;
    return geometry === neighborGeometry || !(
      includes(getValue(geometry, ['properties', 'disputes'], []), propResolver(neighborGeometry, geometryKeyField)) ||
      includes(getValue(neighborGeometry, ['properties', 'disputes'], []), propResolver(geometry, geometryKeyField))
    );
    /* eslint-enable max-len */
  }

  selectedBordersMeshFilter(geometry, neighborGeometry) {
    const { geometryKeyField } = this.props;
    const { keysOfSelectedLocations } = this.state;

    const geometryKey = toString(propResolver(geometry, geometryKeyField));
    const geometryDisputes = getValue(geometry, ['properties', 'disputes'], []).map(toString);
    const neighborGeometryKey = toString(propResolver(neighborGeometry, geometryKeyField));
    const neighborGeometryDisputes = getValue(neighborGeometry, [
      'properties',
      'disputes',
    ], []).map(toString);

    return (
        // geometry is one of the geometries selected
        includes(keysOfSelectedLocations, geometryKey)

        // neighborGeometry is one of the geometries selected
        || includes(keysOfSelectedLocations, neighborGeometryKey)

        // or one of the selections disputed by geometry or neighborGeometry
        || keysOfSelectedLocations.some(locId =>
          includes(geometryDisputes, locId) || includes(neighborGeometryDisputes, locId)
        )
      )

      && !(
        includes(keysOfSelectedLocations, geometryKey)
        && includes(neighborGeometryDisputes, geometryKey)

        || includes(keysOfSelectedLocations, neighborGeometryKey)
        && includes(geometryDisputes, neighborGeometryKey)
      );
  }

  createLayers(name) {
    // guard against creating layers that don't in fact correspond to a topojson object
    if (!this.props.topology.objects.hasOwnProperty(name)) return [];

    const styleReset = { stroke: 'none' };

    // array is used to maintain layer order
    return [
      {
        name,
        object: name,
        style: styleReset,
        selectedStyle: styleReset,
        type: 'feature',
      },
      {
        name: `${name}-disputed-borders`,
        object: name,
        style: { stroke: 'black', strokeWidth: '1px', strokeDasharray: '5, 5' },
        type: 'mesh',
        filterFn: this.disputedBordersMeshFilter,
      },
      {
        name: `${name}-non-disputed-borders`,
        object: name,
        style: { stroke: 'black', strokeWidth: '1px' },
        type: 'mesh',
        filterFn: this.nonDisputedBordersMeshFilter,
      },
      {
        name: `${name}-selected-non-disputed-borders`,
        object: name,
        style: { stroke: 'black', strokeWidth: '2px' },
        type: 'mesh',
        filterFn: this.selectedBordersMeshFilter,
      },
    ];
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
          <ResponsiveContainer disableHeight>
            <ChoroplethLegend
              axisTickFormat={axisTickFormat}
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
  title: PropTypes.string,

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
  selections: (state, _, prevProps, nextProps) => {
    if (isEqual(nextProps.selectedLocations, prevProps.selectedLocations)) return state;
    return assign({}, state, {
      keysOfSelectedLocations: map(nextProps.selectedLocations, datum =>
        toString(propResolver(datum, nextProps.keyField))
      ),
      // spread state.layers array into new array to ensure they are not referentially equal
      // this is for the benefit of ensuring that the layers are re-rendered by <Choropleth />
      // see Choropleth::componentWillReceiveProps
      layers: [...state.layers],
    });
  },
  topojsonObjects: (state, _, prevProps, nextProps, context) => {
    // if map detail level is changed,
    // filter layers passed to choropleth and update internal mapping of which datum have a
    // corresponding geometry displayed on the choropleth
    if (isEqual(prevProps.topojsonObjects, nextProps.topojsonObjects)) return state;

    // evaluate visibility of each layer
    const layers = flatMap(nextProps.topojsonObjects, context.createLayers);
    return assign({}, state, {
      layers,
      locationIdsOnMap: context.getGeometryIds(nextProps.topology, layers),
    });
  },
};
