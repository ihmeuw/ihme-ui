import React, { PropTypes } from 'react';
import { area } from 'd3-shape';
import { noop } from 'lodash';

import { eventHandleWrapper } from '../../../utils/events';
import { CommonPropTypes } from '../../../utils';

const Area = (props) => {
  const {
    data,
    scales,
    color,
    strokeWidth,
    dataAccessors: { x: xAccessor, y0: y0Accessor, y1: y1Accessor },
    onClick,
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
      className="area"
      fill={color}
      stroke={color}
      strokeWidth={`${strokeWidth}px`}
      d={path(data)}
      onClick={eventHandleWrapper(onClick, data, this)}
      onMouseOver={eventHandleWrapper(hoverHandler, data, this)}
    />
  );
};

Area.propTypes = {
  /* array of objects
   e.g. [ {}, {}, {} ]
   */
  data: PropTypes.arrayOf(PropTypes.object).isRequired,

  /* scales from d3Scale */
  scales: PropTypes.shape({
    x: PropTypes.func,
    y: PropTypes.func
  }).isRequired,

  color: PropTypes.string,

  strokeWidth: PropTypes.number,

  dataAccessors: PropTypes.shape({
    x: CommonPropTypes.dataAccessor.isRequired,
    y0: CommonPropTypes.dataAccessor.isRequired,
    y1: CommonPropTypes.dataAccessor.isRequired,
  }).isRequired,

  onClick: PropTypes.func,

  hoverHandler: PropTypes.func
};

Area.defaultProps = {
  color: 'steelblue',
  strokeWidth: 2.5,
  dataAccessors: { x: 'x', y0: 'y0', y1: 'y1' },
  onClick: noop,
  hoverHandler: noop
};

export default Area;
