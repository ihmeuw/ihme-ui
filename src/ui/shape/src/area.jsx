import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { area } from 'd3-shape';

import { eventHandleWrapper } from '../../../utils/events';
import { CommonDefaultProps, CommonPropTypes, PureComponent } from '../../../utils';

class Area extends PureComponent {
  render() {
    const {
      className,
      data,
      scales,
      color,
      strokeWidth,
      dataAccessors: { x: xAccessor, y0: y0Accessor, y1: y1Accessor },
      onClick,
      onMouseLeave,
      onMouseMove,
      onMouseOver,
      style,
    } = this.props;

    const path = area()
      .x((datum) => scales.x(datum[xAccessor]))
      .y0((datum) => scales.y(datum[y0Accessor]))
      .y1((datum) => scales.y(datum[y1Accessor]));

    return (
      <path
        className={classNames(className)}
        fill={color}
        stroke={color}
        strokeWidth={`${strokeWidth}px`}
        d={path(data)}
        onClick={eventHandleWrapper(onClick, data, this)}
        onMouseLeave={eventHandleWrapper(onMouseLeave, data, this)}
        onMouseMove={eventHandleWrapper(onMouseMove, data, this)}
        onMouseOver={eventHandleWrapper(onMouseOver, data, this)}
        style={style}
      />
    );
  }
}

Area.propTypes = {
  className: CommonPropTypes.className,

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
  onMouseLeave: PropTypes.func,
  onMouseMove: PropTypes.func,
  onMouseOver: PropTypes.func,

  style: CommonPropTypes.style,
};

Area.defaultProps = {
  color: 'steelblue',
  strokeWidth: 2.5,
  dataAccessors: { x: 'x', y0: 'y0', y1: 'y1' },
  onClick: CommonDefaultProps.noop,
  onMouseLeave: CommonDefaultProps.noop,
  onMouseMove: CommonDefaultProps.noop,
  onMouseOver: CommonDefaultProps.noop,
};

export default Area;
