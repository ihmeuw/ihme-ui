import React, { PropTypes } from 'react';
import { map, includes } from 'lodash';

import Path from './path';

const propTypes = {
  /* array of geoJSON feature objects, e.g.: [{ geometry: [Object], properties: [Object] }] */
  features: PropTypes.arrayOf(PropTypes.object).isRequired,

  /*
    unlike in other components, data should be an object keyed by location id
    this allows constant-time lookup of a location's value
    e.g. { 6: { mean: 2, lb: 1, ub: 3, ... }, 570: { mean: 4, lb: 3, ub: 5, ... } }
  */
  data: PropTypes.object.isRequired,

  /* unique key of datum */
  keyField: PropTypes.string,

  /* key of datum that holds the value to display */
  valueField: PropTypes.string,

  /* function to generate `d` attribute of <path> elements */
  pathGenerator: PropTypes.func.isRequired,

  /* fn that accepts keyfield, and returns fill color for Path */
  colorScale: PropTypes.func.isRequired,

  /* array of datum[keyField], e.g., location ids */
  selectedLocations: PropTypes.arrayOf(PropTypes.number),

  /* passed to path; partially applied fn that takes in datum and returns fn */
  clickHandler: PropTypes.func,

  /* passed to path; partially applied fn that takes in datum and returns fn */
  hoverHandler: PropTypes.func
};

const defaultProps = {
  keyField: 'location_id',
  dataField: 'mean',
  selectedLocations: []
};

const FeatureLayer = (props) => {
  const {
    features,
    pathGenerator,
    colorScale,
    data,
    keyField,
    valueField,
    selectedLocations,
    clickHandler,
    hoverHandler
  } = props;

  return (
    <g>
      {
        map(features, (feature) => {
          const key = feature.hasOwnProperty(keyField)
            ? feature[keyField]
            : feature.properties[keyField];
          if (!key) return null;

          const fill = data.hasOwnProperty(key) && data[key].hasOwnProperty(valueField)
            ? colorScale(data[key][valueField])
            : '#ccc';

          return (
            <Path
              key={key}
              d={pathGenerator(feature.geometry)}
              locationId={key}
              fill={fill}
              selected={includes(selectedLocations, key)}
              clickHandler={clickHandler}
              hoverHandler={hoverHandler}
            />
          );
        })
      }
    </g>
  );
};

FeatureLayer.propTypes = propTypes;
FeatureLayer.defaultProps = defaultProps;

export default FeatureLayer;
