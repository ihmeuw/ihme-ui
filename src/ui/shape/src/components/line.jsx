import React, { PropTypes } from 'react';

import { line } from 'd3-shape';

import { noop } from 'lodash';

const propTypes = {
  // array of objects
  // e.g. [ {}, {}, {} ]
  data: PropTypes.arrayOf(PropTypes.object).isRequired,

  // scales from d3Scale
  scales: PropTypes.shape({
    x: PropTypes.func,
    y: PropTypes.func
  }).isRequired,

  /* style object to apply to element */
  style: PropTypes.object,

  dataAccessors: PropTypes.shape({
    x: PropTypes.string,
    y: PropTypes.string
  }).isRequired,

  clickHandler: PropTypes.func,

  hoverHandler: PropTypes.func
};

const defaultProps = {
  style: { fill: 'none', stroke: 'black' },
  dataAccessors: { x: 'x', y: 'y' },
  clickHandler: noop,
  hoverHandler: noop
};

const Line = (props) => {
  const {
    data,
    scales,
    style,
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
    <path style={style} d={path(data)}/>
  );
};

Line.propTypes = propTypes;

Line.defaultProps = defaultProps;

export default Line;
