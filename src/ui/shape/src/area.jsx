import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { area } from 'd3-shape';

import { eventHandleWrapper } from '../../../utils/events';
import { CommonDefaultProps, CommonPropTypes, PureComponent } from '../../../utils';

class Area extends PureComponent {
  render() {
    const {
      className,
      color,
      data,
      dataAccessors: { x: xAccessor, y0: y0Accessor, y1: y1Accessor },
      onClick,
      onMouseLeave,
      onMouseMove,
      onMouseOver,
      scales,
      strokeWidth,
      style,
    } = this.props;

    const path = area()
      .x((datum) => scales.x(datum[xAccessor]))
      .y0((datum) => scales.y(datum[y0Accessor]))
      .y1((datum) => scales.y(datum[y1Accessor]));

    return (
      <path
        className={classNames(className)}
        d={path(data)}
        fill={color}
        onClick={eventHandleWrapper(onClick, data, this)}
        onMouseLeave={eventHandleWrapper(onMouseLeave, data, this)}
        onMouseMove={eventHandleWrapper(onMouseMove, data, this)}
        onMouseOver={eventHandleWrapper(onMouseOver, data, this)}
        stroke={color}
        strokeWidth={`${strokeWidth}px`}
        style={style}
      />
    );
  }
}

Area.propTypes = {
  className: CommonPropTypes.className,

  color: PropTypes.string,

  /* array of objects
   e.g. [ {}, {}, {} ]
   */
  data: PropTypes.arrayOf(PropTypes.object).isRequired,

  dataAccessors: PropTypes.shape({
    x: CommonPropTypes.dataAccessor.isRequired,
    y0: CommonPropTypes.dataAccessor.isRequired,
    y1: CommonPropTypes.dataAccessor.isRequired,
  }).isRequired,

  onClick: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onMouseMove: PropTypes.func,
  onMouseOver: PropTypes.func,

  /* scales from d3Scale */
  scales: PropTypes.shape({
    x: PropTypes.func,
    y: PropTypes.func,
  }).isRequired,

  strokeWidth: PropTypes.number,

  style: CommonPropTypes.style,
};

Area.defaultProps = {
  color: 'steelblue',
  dataAccessors: { x: 'x', y0: 'y0', y1: 'y1' },
  onClick: CommonDefaultProps.noop,
  onMouseLeave: CommonDefaultProps.noop,
  onMouseMove: CommonDefaultProps.noop,
  onMouseOver: CommonDefaultProps.noop,
  strokeWidth: 2.5,
};

export default Area;
