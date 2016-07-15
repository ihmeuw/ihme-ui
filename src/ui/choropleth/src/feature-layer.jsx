import React, { PropTypes } from 'react';
import {
  assign,
  get as getValue,
  indexOf,
  keyBy,
  map,
  sortBy,
} from 'lodash';

import {
  CommonPropTypes,
  propsChanged,
  PureComponent,
  stateFromPropUpdates,
} from '../../../utils';

import Path from './path';

export default class FeatureLayer extends PureComponent {
  /**
   * Pull unique key of GeoJSON feature off feature object
   * @param resolver {String|Function}
   * @param feature {GeoJSON feature}
   * @returns {*}
   */
  static getFeatureKey(resolver, feature) {
    // if keyField is a function, call it with the current feature
    // otherwise, try to full it off feature, then feature.properties
    return typeof resolver === 'function'
      ? resolver(feature)
      : feature[resolver] || feature.properties[resolver];
  }

  constructor(props) {
    super(props);

    this.state = stateFromPropUpdates(FeatureLayer.propUpdates, {}, props, {});
  }

  componentWillReceiveProps(nextProps) {
    this.setState(stateFromPropUpdates(FeatureLayer.propUpdates, this.props, nextProps, {}));
  }

  render() {
    const {
      colorScale,
      data,
      keyField,
      onClick,
      onMouseOver,
      onMouseMove,
      onMouseDown,
      onMouseOut,
      pathGenerator,
      pathClassName,
      pathSelectedClassName,
      pathSelectedStyle,
      pathStyle,
      selectedLocations,
      valueField,
    } = this.props;

    // optimization: turn array of ids into map keyed by those ids
    // faster to check if object has property than if array includes some value
    const selectedLocationsMappedById = keyBy(selectedLocations, (locId) => locId);

    return (
      <g>
        {
          map(this.state.sortedFeatures, (feature) => {
            const key = FeatureLayer.getFeatureKey(keyField, feature);

            // if key didn't resolve to anything, return null
            if (!key) return null;

            // if valueField is a function, call it with the datum associated with
            // current feature, as well as curent feature
            const datum = getValue(data, [key]);
            const value = typeof valueField === 'function'
              ? valueField(datum, feature)
              : getValue(datum, [valueField]);

            const fill = value ? colorScale(value) : '#ccc';

            return (
              <Path
                className={pathClassName}
                key={key}
                feature={feature}
                fill={fill}
                locationId={key}
                onClick={onClick}
                onMouseOver={onMouseOver}
                onMouseMove={onMouseMove}
                onMouseDown={onMouseDown}
                onMouseOut={onMouseOut}
                pathGenerator={pathGenerator}
                selected={!!selectedLocationsMappedById[key]}
                selectedClassName={pathSelectedClassName}
                selectedStyle={pathSelectedStyle}
                style={pathStyle}
              />
            );
          })
        }
      </g>
    );
  }
}

FeatureLayer.propTypes = {
  /* fn that accepts keyfield, and returns fill color for Path */
  colorScale: PropTypes.func.isRequired,

  /*
   unlike in other components, data should be an object keyed by location id
   this allows quick lookup of a location's value
   e.g. { 6: { mean: 2, lb: 1, ub: 3, ... }, 570: { mean: 4, lb: 3, ub: 5, ... } }
   */
  data: PropTypes.object.isRequired,

  /* array of geoJSON feature objects, e.g.: [{ geometry: [Object], properties: [Object] }] */
  features: PropTypes.arrayOf(PropTypes.object).isRequired,

  /* mapping of datum key field to geoJSON feature key. default: 'id' */
  keyField: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func, // if a function, is called with current feature as arg
  ]),

  /* passed to each path; signature: function(event, locationId, Path) {...} */
  onClick: PropTypes.func,

  /* passed to each path; signature: function(event, locationId, Path) {...} */
  onMouseOver: PropTypes.func,

  /* passed to each path; signature: function(event, locationId, Path) {...} */
  onMouseMove: PropTypes.func,

  /* passed to each path; signature: function(event, locationId, Path) {...} */
  onMouseDown: PropTypes.func,

  /* passed to each path; signature: function(event, locationId, Path) {...} */
  onMouseOut: PropTypes.func,

  pathClassName: CommonPropTypes.className,

  /* function to generate `d` attribute of <path> elements */
  pathGenerator: PropTypes.func.isRequired,

  pathSelectedClassName: CommonPropTypes.className,

  /* selected style object or function to pass to each path; if a function, receives feature as arg */
  pathSelectedStyle: CommonPropTypes.style,

  /* base style object or function to pass to each path; if a function, receives feature as arg */
  pathStyle: CommonPropTypes.style,

  /* array of datum[keyField], e.g., location ids */
  selectedLocations: PropTypes.arrayOf(PropTypes.number),

  /* key of datum that holds the value to display */
  valueField: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func, // if a function, is called with current feature as arg
  ]),
};

FeatureLayer.defaultProps = {
  dataField: 'mean',
  keyField: 'id',
  selectedLocations: []
};

FeatureLayer.propUpdates = {
  sortedFeatures: (accum, propName, prevProps, nextProps) => {
    if (!propsChanged(prevProps, nextProps, ['selectedLocations', 'features'])) return accum;
    return assign(accum, {
      // sort features by whether or not they are selected
      // this is a way of ensuring that selected paths are rendered last
      // similar to, in a path click handler, doing a this.parentNode.appendChild(this)
      sortedFeatures: sortBy(nextProps.features, (feature) =>
        indexOf(
          nextProps.selectedLocations,
          FeatureLayer.getFeatureKey(nextProps.keyField, feature)
        )
      ),
    });
  },
};
