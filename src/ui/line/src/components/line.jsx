import React, { PropTypes } from 'react';
import { line } from 'd3-shape';

const propTypes = {
  // array of datum objects
  data: PropTypes.array.isRequired,

  // partially applied fn that takes in datum and returns fn
  clickHandler: PropTypes.func,

  // partially applied fn that takes in datum and returns fn
  hoverHandler: PropTypes.func
};

const defaultProps = {
  clickHandler: () => { return () => { return; }; },
  hoverHandler: () => { return () => { return; }; }
};

const Line = (props) => {
  const { data, keyField, valueField, xScale, yScale, clickHandler, hoverHandler } = props;

  const path = line()
    .x((d) => { return xScale(d[keyField]); })
    .y((d) => { return yScale(d[valueField]); });

  return (
    <path d={path(data)} />
  );
};

Line.propTypes = propTypes;

Line.defaultProps = defaultProps;

export default Line;
