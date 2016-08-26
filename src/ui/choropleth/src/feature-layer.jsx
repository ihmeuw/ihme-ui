import React, { PropTypes } from 'react';
import {
  assign,
  get as getValue,
  includes,
  findIndex,
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
      keyField,
      onClick,
      onMouseDown,
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
            const key = propResolver(feature, keyField);

            // if key didn't resolve to anything, return null
            if (!key) return null;

            // if valueField is a function, call it with the datum associated with
            // current feature, as well as curent feature
            const datum = getValue(data, [key]);
            const value = typeof valueField === 'function'
              ? valueField(datum, feature)
              : getValue(datum, valueField);

            const fill = value ? colorScale(value) : '#ccc';

            return (
              <Path
                className={pathClassName}
                key={key}
                datum={datum}
                feature={feature}
                fill={fill}
                onClick={onClick}
                onMouseDown={onMouseDown}
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

  /* mapping of datum key field to geoJSON feature key. default: 'id' */
  keyField: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func, // if a function, is called with current feature as arg
  ]),

  /* passed to each path; signature: function(event, datum, Path) {...} */
  onClick: PropTypes.func,

  /* passed to each path; signature: function(event, datum, Path) {...} */
  onMouseDown: PropTypes.func,

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

  /* key of datum that holds the value to display */
  valueField: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func, // if a function, is called with current feature as arg
  ]),
};

FeatureLayer.defaultProps = {
  dataField: 'mean',
  keyField: 'id',
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
