import React, { PropTypes } from 'react';
import { line } from 'd3-shape';

const propTypes = {
  // array of objects
  // e.g. [ {}, {}, {} ]
  data: PropTypes.arrayOf(PropTypes.object).isRequired,

  // scales from d3Scale
  scales: PropTypes.shape({
    x: PropTypes.func,
    y: PropTypes.func
  }).isRequired,

  dataAccessors: PropTypes.shape({
    x: PropTypes.string,
    y: PropTypes.string
  }).isRequired,

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
    scales,
    dataAccessors: { x: xAccessor, y: yAccessor }
  } = props;

  const path = line()
    .x((datum) => {
      return scales.x(datum[xAccessor]);
    })
    .y((datum) => {
      return scales.y(datum[yAccessor]);
    });

  return (
    <path d={path(data)}/>
  );
};

Line.propTypes = propTypes;

Line.defaultProps = defaultProps;

export default Line;
