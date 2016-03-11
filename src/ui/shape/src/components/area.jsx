import React, { PropTypes } from 'react';
import { area } from 'd3-shape';
import noop from 'lodash/noop';

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
    y0: PropTypes.string,
    y1: PropTypes.string
  }).isRequired,

  clickHandler: PropTypes.func,

  hoverHandler: PropTypes.func
};

const defaultProps = {
  fill: 'none',
  stroke: 'steelblue',
  strokeWidth: 2.5,
  dataAccessors: { x: 'x', y0: 'y0', y1: 'y1' },
  clickHandler: noop,
  hoverHandler: noop
};

const Area = (props) => {
  const {
    data,
    scales,
    fill,
    stroke,
    strokeWidth,
    dataAccessors: { x: xAccessor, y0: y0Accessor, y1: y1Accessor },
    clickHandler,
    hoverHandler
  } = props;

  const path = area()
    .x((datum) => {
      return scales.x(datum[xAccessor]);
    })
    .y0((datum) => {
      return scales.y(datum[y0Accessor]);
    })
    .y1((datum) => {
      return scales.y(datum[y1Accessor]);
    });

  return (
    <path
      fill={fill}
      stroke={stroke}
      strokeWidth={`${strokeWidth}px`}
      d={path(data)}
      onClick={clickHandler(data)}
      onMouseOver={hoverHandler(data)}
    />
  );
};

Area.propTypes = propTypes;

Area.defaultProps = defaultProps;

export default Area;
