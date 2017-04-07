import React, { PropTypes } from 'react';
import {
  assign,
  get as getValue,
  includes,
  findIndex,
  isNil,
  map,
  sortBy,
} from 'lodash';

import {
  CommonPropTypes,
  propResolver,
  propsChanged,
  PureComponent,
  stateFromPropUpdates,
} from '../../../utils';

import Path from './path';

export default class FeatureLayer extends PureComponent {
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
      focus,
      focusedClassName,
      focusedStyle,
      geometryKeyField,
      keyField,
      onClick,
      onMouseLeave,
      onMouseMove,
      onMouseOver,
      pathGenerator,
      pathClassName,
      pathSelectedClassName,
      pathSelectedStyle,
      pathStyle,
      selectedLocations,
      valueField,
    } = this.props;

    return (
      <g>
        {
          map(this.state.sortedFeatures, (feature) => {
            const geometryKey = propResolver(feature, geometryKeyField);

            // if geometryKey didn't resolve to anything, return null
            if (!geometryKey) return null;


            const datum = getValue(data, [geometryKey]);

            const focusedDatumKey = focus ? propResolver(focus, keyField) : null;

            // if valueField is a function, call it with all data as well as current feature
            // this enables being able to associate datum with features that don't necessarily map to
            // those features' key.
            // e.g., associate an administering location's datum with a disputed area feature:
            //  - geometryKeyField: 'location_id'
            //  - valueField: (data, feature) => data[feature.properties.admin_id]
            // if valueField is a string, assume we just want to index into whatever datum resolves from data[geometryKey]
            // TODO make difference in how valueField is applied more transparent
            const value = typeof valueField === 'function'
              ? valueField(data, feature)
              : getValue(datum, valueField);

            const fill = isNil(value) ? '#ccc' : colorScale(value);

            return (
              <Path
                className={pathClassName}
                datum={datum}
                key={geometryKey}
                feature={feature}
                focused={focusedDatumKey === geometryKey}
                focusedClassName={focusedClassName}
                focusedStyle={focusedStyle}
                fill={fill}
                onClick={onClick}
                onMouseLeave={onMouseLeave}
                onMouseMove={onMouseMove}
                onMouseOver={onMouseOver}
                pathGenerator={pathGenerator}
                selected={includes(selectedLocations, datum)}
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

  /**
   * The datum object corresponding to the `<Path />` currently focused.
   */
  focus: PropTypes.object,

  /**
   * className applied if `<path />` has focus.
   */
  focusedClassName: CommonPropTypes.className,

  /**
   * inline styles applied to focused `<Path />`
   * If an object, spread into inline styles.
   * If a function, passed underlying datum corresponding to its `<Path />`,
   * and return value is spread into inline styles;
   * signature: (datum) => obj
   */
  focusedStyle: CommonPropTypes.style,

  /*
    uniquely identifying field of geometry objects
    if a function, will be called with the geometry object as first parameter
    N.B.: the resolved value of this prop should match the resolved value of `keyField`
   */
  geometryKeyField: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func, // if a function, is called with current feature as arg
  ]).isRequired,

  /*
   unique key of datum
   if a function, will be called with the datum object as first parameter
   */
  keyField: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
  ]).isRequired,

  /* passed to each path; signature: function(event, datum, Path) {...} */
  onClick: PropTypes.func,

  /* passed to each path; signature: function(event, datum, Path) {...} */
  onMouseLeave: PropTypes.func,

  /* passed to each path; signature: function(event, datum, Path) {...} */
  onMouseMove: PropTypes.func,

  /* passed to each path; signature: function(event, datum, Path) {...} */
  onMouseOver: PropTypes.func,

  pathClassName: CommonPropTypes.className,

  /* function to generate `d` attribute of <path> elements */
  pathGenerator: PropTypes.func.isRequired,

  pathSelectedClassName: CommonPropTypes.className,

  /* selected style object or function to pass to each path; if a function, receives feature as arg */
  pathSelectedStyle: CommonPropTypes.style,

  /* base style object or function to pass to each path; if a function, receives feature as arg */
  pathStyle: CommonPropTypes.style,

  /* array of data */
  selectedLocations: PropTypes.arrayOf(PropTypes.object),

  /*
    key of datum that holds the value to display
    if a string, used as property access for data[feature[geometryKeyField]][valueField]
    if a function, passed all data (object keyed by keyField) and current feature
  */
  valueField: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
  ]).isRequired,
};

FeatureLayer.defaultProps = {
  selectedLocations: [],
};

FeatureLayer.propUpdates = {
  sortedFeatures: (accum, key, prevProps, nextProps) => {
    /* eslint-disable max-len, eqeqeq */
    if (!propsChanged(prevProps, nextProps, ['selectedLocations', 'features'])) return accum;
    return assign(accum, {
      // sort features by whether or not they are selected
      // this is a way of ensuring that selected paths are rendered last
      // similar to, in a path click handler, doing a this.parentNode.appendChild(this)
      sortedFeatures: sortBy(nextProps.features, (feature) =>
        findIndex(nextProps.selectedLocations, (locationDatum) =>
          propResolver(locationDatum, nextProps.keyField) == propResolver(feature, nextProps.geometryKeyField)
        )
      ),
    });
  },
};
