import React, { PropTypes } from 'react';
import { scaleLinear } from 'd3-scale';
import { map, omit } from 'lodash';

import Line from './line';
import Area from './area';

const propTypes = {
  /* array of objects
    e.g. [ {location: 'USA',values: []}, {location: 'Canada', values: []} ]
  */
  data: PropTypes.arrayOf(PropTypes.object),

  /* whether or not to draw uncertainty areas for lines */
  showUncertainty: PropTypes.bool,

  /* whether or not to draw lines (e.g., mean estimate lines) */
  showLine: PropTypes.bool,

  /* key that uniquely identifies dataset within array of datasets */
  keyField: PropTypes.string,

  /* key that holds values to be represented by individual lines */
  dataField: PropTypes.string,

  /* scales from d3Scale */
  scales: PropTypes.shape({
    x: PropTypes.func,
    y: PropTypes.func
  }).isRequired,

  /* fn that accepts keyfield, and returns stroke color for line */
  colorScale: PropTypes.func,

  /*
    key names containing x, y data
      x -> accessor for xscale
      y -> accessor for yscale (when there's one, e.g. <Line />)
      y0 -> accessor for yscale (when there're two; e.g., lower bound)
      y1 -> accessor for yscale (when there're two; e.g., upper bound)
  */
  dataAccessors: PropTypes.shape({
    x: PropTypes.string,
    y: PropTypes.string,
    y0: PropTypes.string,
    y1: PropTypes.string
  }).isRequired,

  onClick: PropTypes.func,

  onMouseOver: PropTypes.func,

  onMouseLeave: PropTypes.func,
};

const defaultProps = {
  showUncertainty: false,
  showLine: true,
  colorScale: () => { return 'steelblue'; },
  scales: { x: scaleLinear(), y: scaleLinear() },
};

const MultiLine = (props) => {
  const {
    colorScale,
    keyField,
    dataField,
    data,
    showUncertainty,
    showLine
  } = props;

  const childProps = omit(props, [
    'data',
    'keyField',
    'dataField',
    'style',
    'showUncertainty',
    'showLine'
  ]);

  return (
    <g>
      {
        (!showUncertainty && !showLine)
          ? null
          : map(data, (lineData) => {
            const key = lineData[keyField];
            const values = lineData[dataField];
            const color = colorScale(lineData[keyField]);
            // on each iteration, lineData is an object
            // e.g., { keyField: STRING, dataField: ARRAY }

            // if uncertainty is turned off, only draw lines
            if (!showUncertainty) {
              return (
                <Line
                  key={`line:${key}`}
                  data={values}
                  stroke={color}
                  {...childProps}
                />
              );
            }

            // if line is turned off, only show uncertainty
            if (!showLine) {
              return (
                <Area
                  key={`area:${key}`}
                  data={values}
                  color={color}
                  {...childProps}
                />
              );
            }

            // otherwise, show both
            return (
              <g key={`area:line:${lineData[keyField]}`}>
                <Line
                  key={`line:${key}`}
                  data={values}
                  stroke={color}
                  {...childProps}
                />
                <Area
                  key={`area:${key}`}
                  data={values}
                  color={color}
                  {...childProps}
                />
              </g>
            );
          })
      }
    </g>
  );
};

MultiLine.propTypes = propTypes;

MultiLine.defaultProps = defaultProps;

export default MultiLine;
