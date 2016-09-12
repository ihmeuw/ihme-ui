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

export default class Map extends React.Component {
  constructor(props) {
    super(props);

    const { colorSteps, domain, extentPct, selectedLocations } = props;
    const rangeExtent = getRangeExtent(extentPct, domain);

    bindAll(this, [
      'disputedBordersMeshFilter',
      'getGeometryIds',
      'nonDisputedBordersMeshFilter',
      'selectedBordersMeshFilter',
      'onSetScale',
      'onResetScale',
    ]);

    const styleReset = { stroke: 'none' };
    // Array is used to maintain layer order.
    const layers = [
      {
        name: 'national',
        object: 'national',
        style: styleReset,
        selectedStyle: styleReset,
        type: 'feature',
        visible: true,
      },
      {
        name: 'subnational',
        object: 'subnational',
        style: styleReset,
        selectedStyle: styleReset,
        type: 'feature',
        visible: !!props.subnational,
      },
      {
        name: 'disputed-national-borders',
        object: 'national',
        style: { stroke: 'black', strokeWidth: '1px', strokeDasharray: '5, 5' },
        type: 'mesh',
        filterFn: this.disputedBordersMeshFilter,
        visible: true,
      },
      {
        name: 'disputed-subnational-borders',
        object: 'subnational',
        style: { stroke: 'black', strokeWidth: '1px', strokeDasharray: '5, 5' },
        type: 'mesh',
        filterFn: this.disputedBordersMeshFilter,
        visible: !!props.subnational,
      },
      {
        name: 'non-disputed-national-borders',
        object: 'national',
        style: { stroke: 'black', strokeWidth: '1px' },
        type: 'mesh',
        filterFn: this.nonDisputedBordersMeshFilter,
        visible: true,
      },
      {
        name: 'non-disputed-subnational-borders',
        object: 'subnational',
        style: { stroke: 'black', strokeWidth: '1px' },
        type: 'mesh',
        filterFn: this.nonDisputedBordersMeshFilter,
        visible: !!props.subnational,
      },
      {
        name: 'selected-non-disputed-national-borders',
        object: 'national',
        style: { stroke: 'black', strokeWidth: '2px' },
        type: 'mesh',
        filterFn: this.selectedBordersMeshFilter(selectedLocations),
        visible: true,
      },
      {
        name: 'selected-non-disputed-subnational-borders',
        object: 'subnational',
        style: { stroke: 'black', strokeWidth: '2px' },
        type: 'mesh',
        filterFn: this.selectedBordersMeshFilter(selectedLocations),
        visible: !!props.subnational,
      },
    ];

    const state = {
      colorScale: clampedScale('#ccc', 0.000001)
        .base(scaleLinear())
        .domain(linspace(rangeExtent, colorSteps.length))
        .range(colorSteps),
      layers,
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
    const visibleLayers = keyBy(layers.filter((layer) => layer.visible), 'name');
    const relevantObjects = filter(topojson.objects, (_, key) => visibleLayers[key]);
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

  selectedBordersMeshFilter(selections) {
    const { geometryKeyField, keyField } = this.props;
    const keysOfSelectedLocations = selections.map(datum =>
      toString(propResolver(datum, keyField))
    );

    return (geometry, neighborGeometry) => {
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
          || keysOfSelectedLocations.some(locId => {
            return includes(geometryDisputes, locId) ||
              includes(neighborGeometryDisputes, locId);
          })
        )

        && !(
          includes(keysOfSelectedLocations, geometryKey)
          && includes(neighborGeometryDisputes, geometryKey)

          || includes(keysOfSelectedLocations, neighborGeometryKey)
          && includes(geometryDisputes, neighborGeometryKey)
        );
    };
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
      keyField,
      geometryKeyField,
      onClick,
      onMouseLeave,
      onMouseMove,
      onMouseOver,
      topology,
      valueField,
      zoomControlsClassName,
      zoomControlsStyle,
    } = this.props;
    const { colorScale, layers } = this.state;

    if (!topology) return null;
    return (
      <div className={styles.map}>
        <ResponsiveContainer>
          <Choropleth
            colorScale={colorScale}
            controls
            controlsClassName={zoomControlsClassName}
            controlsStyle={zoomControlsStyle}
            data={data}
            geometryKeyField={geometryKeyField}
            keyField={keyField}
            layers={layers}
            onClick={onClick}
            onMouseLeave={onMouseLeave}
            onMouseMove={onMouseMove}
            onMouseOver={onMouseOver}
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
      keyField,
      legendMargins,
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
      <div className={styles.legend}>
        <div className={styles['legend-wrapper']}>
          <ResponsiveContainer disableHeight>
            <ChoroplethLegend
              axisTickFormat={axisTickFormat}
              colorSteps={colorSteps}
              colorScale={colorScale}
              data={filterData(data, locationIdsOnMap, keyField)}
              domain={domain}
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
    return (
      <div className={classNames(styles['map-container'], this.props.className)}>
        {this.renderMap()}
        {this.renderTitle()}
        {this.renderLegend()}
      </div>
    );
  }
}

Map.propTypes = {
  axisTickFormat: PropTypes.func,

  className: PropTypes.string,

  /*
    list of hex or rbg color values
    color scale will interpolate between these values
    defaults to list of 11 colors with blue at the "bottom" and red at the "top"
    this encodes IHME's "high numbers are bad" color scheme
  */
  colorSteps: PropTypes.array,

  /* array of datum objects */
  data: PropTypes.array.isRequired,

  /* domain of color scale */
  domain: PropTypes.array.isRequired,

  /* [minPercent, maxPercent] of color scale domain to place slider handles */
  extentPct: PropTypes.array,

  /*
    uniquely identifying field of geometry objects;
    see <Choropleth /> propTypes for more detail
  */
  geometryKeyField: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
  ]).isRequired,

  /*
    unique key of datum;
    see <Choropleth /> propTypes for more detail
  */
  keyField: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
  ]).isRequired,

  /* margins passed to ChoroplethLegend */
  legendMargins: PropTypes.shape({
    top: PropTypes.number,
    right: PropTypes.number,
    bottom: PropTypes.number,
    left: PropTypes.number,
  }),

  /* is data for this component currently being fetched */
  loading: PropTypes.bool,

  /*
    event handler passed to both choropleth and choropleth legend;
    signature: function(event, locationId, Path) {...}
  */
  onClick: PropTypes.func,

  /*
   event handler passed to both choropleth and choropleth legend;
   signature: function(event, locationId, Path) {...}
   */
  onMouseLeave: PropTypes.func,

  /*
   event handler passed to both choropleth and choropleth legend;
   signature: function(event, locationId, Path) {...}
   */
  onMouseMove: PropTypes.func,

  /*
     event handler passed to both choropleth and choropleth legend;
     signature: function(event, locationId, Path) {...}
   */
  onMouseOver: PropTypes.func,

  /*
    callback for "Set scale" button;
    passed current rangeExtent (in data space) as first and only argument
  */
  onSetScale: PropTypes.func,

  /* callback for slider handles attached to choropleth legend */
  onSliderMove: PropTypes.func.isRequired,

  /*
    callback for "Reset" button;
    passed current rangeExtent (in data space) as first and only argument
    rangeExtent in this case will always equal this.props.domain
  */
  onResetScale: PropTypes.func.isRequired,

  /* array of data objects */
  selectedLocations: PropTypes.array,

  sliderHandleFormat: PropTypes.func,

  /* whether to include subnational layer */
  subnational: PropTypes.bool,

  title: PropTypes.string,

  titleClassName: CommonPropTypes.className,

  titleStyle: PropTypes.object,

  /*
    preprojected topojson to render;
    given inclusion of mesh filters, there is a hard dependency on particular topojson
  */
  topology: PropTypes.shape({
    objects: PropTypes.shape({
      national: PropTypes.object.isRequired,
      subnational: PropTypes.object,
    }).isRequired,
  }).isRequired,

  /* unit of data, used as axis label in choropleth legend */
  unit: PropTypes.string,

  /* key of datum that holds the value to display */
  valueField: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
  ]).isRequired,

  zoomControlsClassName: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
  ]),

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
  subnational: false,
};

Map.propUpdates = {
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
  selections: (state, _, prevProps, nextProps, context) => {
    if (isEqual(nextProps.selectedLocations, prevProps.selectedLocations)) return state;
    return assign({}, state, {
      layers: state.layers.map(layer => {
        let meshFilter = layer.filterFn;
        if (layer.name === 'selected-non-disputed-national-borders'
            || layer.name === 'selected-non-disputed-subnational-borders') {
          meshFilter = context.selectedBordersMeshFilter(nextProps.selectedLocations);
        }
        return assign({}, layer, { filterFn: meshFilter });
      }),
    });
  },
  subnational: (state, _, prevProps, nextProps, context) => {
    // if subnational layers are being toggled on or off,
    // filter layers passed to choropleth and update internal mapping of which datum have a
    // corresponding geometry displayed on the choropleth
    if (prevProps.subnational === nextProps.subnational) return state;
    const layers = state.layers.map(layer => {
      if (layer.object !== 'subnational') return layer;
      return assign({}, layer, {
        visible: !!nextProps.subnational,
      });
    });
    return assign({}, state, {
      layers,
      locationIdsOnMap: context.getGeometryIds(nextProps.topology, layers),
    });
  },
};
