import React, { PropTypes } from 'react';
import { line } from 'd3-shape';

const propTypes = {
  // array of objects
  // e.g. [ {}, {}, {} ]
  data: PropTypes.arrayOf(PropTypes.object),

  // scales from d3Scale
  scales: PropTypes.shape({
    x: PropTypes.func,
    y: PropTypes.func
  }),

  dataAccessors: PropTypes.shape({
    x: PropTypes.string,
    y: PropTypes.string
  }),

  clickHandler: PropTypes.func,

  hoverHandler: PropTypes.func
};

const defaultProps = {
  dataAccessors: { x: 'x', y: 'y' },
  clickHandler: () => { return; },
  hoverHandler: () => { return; }
};

const Line = (props) => {
  const {
    data,
    scales: { x: xScale, y: yScale },
    dataAccessors: { x: xAccessor, y: yAccessor }
  } = props;

  const path = line()
    .x((datum) => { return xScale(datum[xAccessor]); })
    .y((datum) => { return yScale(datum[yAccessor]); });

  return (
    <path d={path(data)} />
  );
};

Line.propTypes = propTypes;

Line.defaultProps = defaultProps;

export default Line;
