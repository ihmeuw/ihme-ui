import React, { PropTypes } from 'react';
import { keyBy, map } from 'lodash';

import Path from './path';

export default function FeatureLayer(props) {
  const {
    features,
    pathGenerator,
    colorScale,
    data,
    keyField,
    valueField,
    selectedLocations,
    onClick,
    onMouseOver,
    onMouseMove,
    onMouseDown,
    onMouseOut
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
              key={key}
              feature={feature}
              pathGenerator={pathGenerator}
              locationId={key}
              fill={fill}
              selected={!!selectedLocationsMappedById[key]}
              onClick={onClick}
              onMouseOver={onMouseOver}
              onMouseMove={onMouseMove}
              onMouseDown={onMouseDown}
              onMouseOut={onMouseOut}
              className={props.pathClassName}
              selectedClassName={props.pathSelectedClassName}
              style={props.pathStyle}
              selectedStyle={props.pathSelectedStyle}
            />
          );
        })
      }
    </g>
  );
}

FeatureLayer.propTypes = {
  /* array of geoJSON feature objects, e.g.: [{ geometry: [Object], properties: [Object] }] */
  features: PropTypes.arrayOf(PropTypes.object).isRequired,

  /*
    unlike in other components, data should be an object keyed by location id
    this allows quick lookup of a location's value
    e.g. { 6: { mean: 2, lb: 1, ub: 3, ... }, 570: { mean: 4, lb: 3, ub: 5, ... } }
  */
  data: PropTypes.object.isRequired,

  /* mapping of datum key field to geoJSON feature key. default: 'id' */
  keyField: PropTypes.string,

  /* key of datum that holds the value to display */
  valueField: PropTypes.string,

  /* function to generate `d` attribute of <path> elements */
  pathGenerator: PropTypes.func.isRequired,

  /* fn that accepts keyfield, and returns fill color for Path */
  colorScale: PropTypes.func.isRequired,

  /* array of datum[keyField], e.g., location ids */
  selectedLocations: PropTypes.arrayOf(PropTypes.number),

  /* passed to each path; signature: function(event, locationId) {...} */
  onClick: PropTypes.func,

  /* passed to each path; signature: function(event, locationId) {...} */
  onMouseOver: PropTypes.func,

  /* passed to each path; signature: function(event, locationId) {...} */
  onMouseMove: PropTypes.func,

  /* passed to each path; signature: function(event, locationId) {...} */
  onMouseDown: PropTypes.func,

  /* passed to each path; signature: function(event, locationId) {...} */
  onMouseOut: PropTypes.func,

  pathClassName: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  pathSelectedClassName: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  pathStyle: PropTypes.object,
  pathSelectedStyle: PropTypes.object,
};

FeatureLayer.defaultProps = {
  keyField: 'id',
  dataField: 'mean',
  selectedLocations: []
};
