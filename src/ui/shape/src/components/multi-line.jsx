import React, { PropTypes } from 'react';
import { map, omit } from 'lodash';

import Line from './line';

const propTypes = {
  /* array of objects
    e.g. [ {location: 'USA',values: []}, {location: 'Canada', values: []} ]
  */
  data: PropTypes.arrayOf(PropTypes.object),

  /* key name for topic of data */
  keyField: PropTypes.string,

  /* key name for values representing individual lines */
  dataField: PropTypes.string,

  /* scales from d3Scale */
  scales: PropTypes.shape({
    x: PropTypes.func,
    y: PropTypes.func
  }).isRequired,

  /* fn that accepts keyfield, and returns stroke color for line */
  colorScale: PropTypes.func,

  /* key names containing x, y data */
  dataAccessors: PropTypes.shape({
    x: PropTypes.string,
    y: PropTypes.string
  }).isRequired,

  clickHandler: PropTypes.func,

  hoverHandler: PropTypes.func
};

const defaultProps = {
  colorScale: () => { return 'steelblue'; }
};

const MultiLine = (props) => {
  const {
    colorScale,
    keyField,
    dataField,
    data
  } = props;

  const childProps = omit(props, ['data', 'keyField', 'dataField', 'style']);

  return (
    <g>
      {
        // on each iteration, lineData is an object
        // e.g., { keyField: STRING, dataField: ARRAY }
        map(data, (lineData) => {
          return (
            <Line
              key={lineData[keyField]}
              data={lineData[dataField]}
              stroke={colorScale(lineData[keyField])}
              {...childProps}
            />);
        })
      }
    </g>
  );
};

MultiLine.propTypes = propTypes;

MultiLine.defaultProps = defaultProps;

export default MultiLine;
