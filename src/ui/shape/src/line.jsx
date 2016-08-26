import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { line } from 'd3-shape';

import { eventHandleWrapper } from '../../../utils/events';
import {
  CommonPropTypes,
  CommonDefaultProps,
  propResolver,
  PureComponent,
} from '../../../utils';

export default class Line extends PureComponent {
  render() {
    const {
      className,
      data,
      dataAccessors,
      onClick,
      onMouseLeave,
      onMouseMove,
      onMouseOver,
      scales,
      style,
    } = this.props;

    const path = line()
      .x((datum) => scales.x(propResolver(datum, dataAccessors.x)))
      .y((datum) => scales.y(propResolver(datum, dataAccessors.y)));

    return (
      <path
        className={className && classNames(className)}
        d={path(data)}
        fill="none"
        onClick={eventHandleWrapper(onClick, data, this)}
        onMouseLeave={eventHandleWrapper(onMouseLeave, data, this)}
        onMouseMove={eventHandleWrapper(onMouseMove, data, this)}
        onMouseOver={eventHandleWrapper(onMouseOver, data, this)}
        style={style}
      />
    );
  }
}

Line.propTypes = {
  /* base classname to apply to line */
  className: CommonPropTypes.className,

  /* array of objects. e.g. [ {}, {}, {} ] */
  data: PropTypes.arrayOf(PropTypes.object).isRequired,

  dataAccessors: PropTypes.shape({
    x: CommonPropTypes.dataAccessor.isRequired,
    y: CommonPropTypes.dataAccessor.isRequired,
  }).isRequired,

  /* mouse events signature: function(event, props.data, Line instance) {...} */
  onClick: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onMouseMove: PropTypes.func,
  onMouseOver: PropTypes.func,

  /* scales from d3Scale */
  scales: PropTypes.shape({
    x: PropTypes.func,
    y: PropTypes.func
  }).isRequired,

  /*
   inline-style object or function to be applied as base style;
   if a function, is called with data
   */
  style: CommonPropTypes.style,
};

Line.defaultProps = {
  dataAccessors: { x: 'x', y: 'y' },
  onClick: CommonDefaultProps.noop,
  onMouseOver: CommonDefaultProps.noop,
  onMouseMove: CommonDefaultProps.noop,
  onMouseLeave: CommonDefaultProps.noop,
  style: {
    stroke: 'steelblue',
    strokeWidth: 1,
  },
};
