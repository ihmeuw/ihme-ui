import React, { PropTypes } from 'react';
import map from 'lodash.map';

const propTypes = {
  data: PropTypes.array.isRequired, // array of datum objects
  keyProp: PropTypes.string.isRequired, // uniquely identifying property on datum, e.g., location_id
  valueProp: PropTypes.string.isRequired, // name of prop on datum that holds
  colorScale: PropTypes.func.isRequired, // linear color scale
  xScale: PropTypes.func.isRequired, // scale to place circles along x-axis of range slider
  clickHandler: PropTypes.func, // partially applied fn that takes in datum and returns fn
  hoverHandler: PropTypes.func // partially applied fn that takes in datum and returns fn
};

const defaultProps = {
  clickHandler: () => {},
  hoverHandler: () => {}
};

const DensityPlot = (props) => {
  const { data, keyProp, valueProp, colorScale, xScale, clickHandler, hoverHandler } = props;

  return (
    <g>
      {
        map(data, (datum) => {
          const key = datum[keyProp];
          const value = datum[valueProp];
          return (
            <circle
              key={key}
              r='7.5'
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

export default DensityPlot;
