import React, { PropTypes } from 'react';
import map from 'lodash/map';

const propTypes = {
  // array of datum objects
  data: PropTypes.array.isRequired,

  // uniquely identifying property on datum, e.g., location_id
  keyField: PropTypes.string.isRequired,

  // name of prop on datum that holds
  valueField: PropTypes.string.isRequired,

  // linear color scale
  colorScale: PropTypes.func.isRequired,

  // linear x scale
  xScale: PropTypes.func.isRequired,

  // partially applied fn that takes in datum and returns fn
  clickHandler: PropTypes.func,

  // partially applied fn that takes in datum and returns fn
  hoverHandler: PropTypes.func
};

const defaultProps = {
  clickHandler: () => { return () => { return; }; },
  hoverHandler: () => { return () => { return; }; }
};

const DensityPlot = (props) => {
  const { data, keyField, valueField, colorScale, xScale, clickHandler, hoverHandler } = props;

  return (
    <g>
      {
        map(data, (datum) => {
          const key = datum[keyField];
          const value = datum[valueField];
          return (
            <circle
              key={key}
              r="7.5"
              fill={colorScale(value)}
              cx={xScale(value)}
              onClick={clickHandler(datum)}
              onMouseOver={hoverHandler(datum)}
            >
            </circle>
          );
        })
      }
    </g>
  );
};

DensityPlot.propTypes = propTypes;

DensityPlot.defaultProps = defaultProps;

export default DensityPlot;
