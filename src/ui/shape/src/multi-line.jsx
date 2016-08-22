import React, { PropTypes } from 'react';
import { scaleLinear } from 'd3-scale';
import { map, omit } from 'lodash';

import Line from './line';
import Area from './area';

const propTypes = {
  /* fn that accepts keyfield, and returns stroke color for line */
  colorScale: PropTypes.func,

  /* array of objects
    e.g. [ {location: 'USA',values: []}, {location: 'Canada', values: []} ]
  */
  data: PropTypes.arrayOf(PropTypes.object),

  /*
    key names containing x, y data
      x -> accessor for xscale
      y -> accessor for yscale (when there's one, e.g. <Line />)
      y0 -> accessor for yscale (when there're two; e.g., lower bound)
      y1 -> accessor for yscale (when there're two; e.g., upper bound)
  */
  dataAccessors: PropTypes.shape({
    x: PropTypes.oneOf([PropTypes.string, PropTypes.func]),
    y: PropTypes.oneOf([PropTypes.string, PropTypes.func]),
    y0: PropTypes.oneOf([PropTypes.string, PropTypes.func]),
    y1: PropTypes.oneOf([PropTypes.string, PropTypes.func]),
  }).isRequired,

  /* key that holds values to be represented by individual lines */
  dataField: PropTypes.string,

  /* key that uniquely identifies dataset within array of datasets */
  keyField: PropTypes.string,

  /* signature: function(event, line data, Line instance) {...} */
  onClick: PropTypes.func,

  /* signature: function(event, line data, Line instance) {...} */
  onMouseLeave: PropTypes.func,

  /* signature: function(event, line data, Line instance) {...} */
  onMouseMove: PropTypes.func,

  /* signature: function(event, line data, Line instance) {...} */
  onMouseOver: PropTypes.func,

  /* scales from d3Scale */
  scales: PropTypes.shape({
    x: PropTypes.func,
    y: PropTypes.func
  }).isRequired,

  /* whether or not to draw lines (e.g., mean estimate lines) */
  showLine: PropTypes.bool,

  /* whether or not to draw uncertainty areas for lines */
  showUncertainty: PropTypes.bool,
};

const defaultProps = {
  showUncertainty: false,
  showLine: true,
  colorScale: () => 'steelblue',
  scales: { x: scaleLinear(), y: scaleLinear() },
};

const MultiLine = (props) => {
  const {
    colorScale,
    data,
    dataAccessors,
    dataField,
    keyField,
  } = props;

  const childProps = omit(props, [
    'data',
    'keyField',
    'dataField',
    'style',
  ]);

  function renderLine(key, values, color) {
    return (
      <Line
        key={`line:${key}`}
        data={values}
        stroke={color}
        {...childProps}
      />
    );
  }

  function renderArea(key, values, color) {
    return (
      <Area
        key={`area:${key}`}
        data={values}
        color={color}
        {...childProps}
      />
    );
  }

  return (
    <g>
      {
        (!(dataAccessors.y || (dataAccessors.y0 && dataAccessors.y1)))
          ? null
          : map(data, (lineData) => {
            const key = lineData[keyField];
            const values = lineData[dataField];
            const color = colorScale(lineData[keyField]);
            // on each iteration, lineData is an object
            // e.g., { keyField: STRING, dataField: ARRAY }

            // only show Line
            if (!dataAccessors.y0) {
              return renderLine(key, values, color);
            }

            // only show Area
            if (!dataAccessors.y) {
              return renderArea(key, values, color);
            }

            // show both Line and Area
            return (
              <g key={`area:line:${lineData[keyField]}`}>
                {renderLine(key, values, color)}
                {renderArea(key, values, color)}
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
