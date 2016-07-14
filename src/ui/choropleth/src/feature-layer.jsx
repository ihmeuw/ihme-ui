import React, { PropTypes } from 'react';
import { keyBy, map } from 'lodash';

import {
  CommonPropTypes,
} from '../../../utils';

import Path from './path';

export default function FeatureLayer(props) {
  const {
    colorScale,
    data,
    features,
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
  } = props;

  // optimization: turn array of ids into map keyed by those ids
  // faster to check if object has property than if array includes some value
  const selectedLocationsMappedById = keyBy(selectedLocations, (locId) => locId);

  return (
    <g>
      {
        map(features, (feature) => {
          const key = feature[keyField] || feature.properties[keyField];
          if (!key) return null;

          const fill = data.hasOwnProperty(key) && data[key].hasOwnProperty(valueField)
            ? colorScale(data[key][valueField])
            : '#ccc';

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
  keyField: PropTypes.string,

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
  valueField: PropTypes.string,
};

FeatureLayer.defaultProps = {
  dataField: 'mean',
  keyField: 'id',
  selectedLocations: []
};
