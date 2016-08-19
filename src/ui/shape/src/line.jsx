import React, { PropTypes } from 'react';

import { line } from 'd3-shape';

import { noop } from 'lodash';

const propTypes = {
  /* array of objects
    e.g. [ {}, {}, {} ]
  */
  data: PropTypes.arrayOf(PropTypes.object).isRequired,

  /* scales from d3Scale */
  scales: PropTypes.shape({
    x: PropTypes.func,
    y: PropTypes.func
  }).isRequired,

  fill: PropTypes.string,

  stroke: PropTypes.string,

  strokeWidth: PropTypes.number,

  dataAccessors: PropTypes.shape({
    x: PropTypes.string,
    y: PropTypes.string
  }).isRequired,

  onClick: PropTypes.func,

  onMouseOver: PropTypes.func,

  onMouseLeave: PropTypes.func,
};

const defaultProps = {
  fill: 'none',
  stroke: 'steelblue',
  strokeWidth: 2.5,
  dataAccessors: { x: 'x', y: 'y' },
  onClick: noop,
  onMouseOver: noop,
  onMouseLeave: noop,
};

const Line = (props) => {
  const {
    data,
    scales,
    fill,
    stroke,
    strokeWidth,
    dataAccessors: { x: xAccessor, y: yAccessor },
    onClick,
    onMouseOver,
    onMouseLeave,
  } = props;

  const path = line()
    .x((datum) => {
      return scales.x(datum[xAccessor]);
    })
    .y((datum) => {
      return scales.y(datum[yAccessor]);
    });

  return (
    <path
      className="line"
      fill={fill}
      stroke={stroke}
      strokeWidth={`${strokeWidth}px`}
      d={path(data)}
      onClick={() => { onClick(data); }}
      onMouseOver={() => { onMouseOver(data); }}
      onMouseLeave={() => { onMouseLeave(data); }}
    />
  );
};

Line.propTypes = propTypes;

Line.defaultProps = defaultProps;

export default Line;
