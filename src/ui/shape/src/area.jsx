import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { area } from 'd3-shape';

import { eventHandleWrapper } from '../../../utils/events';
import {
  CommonPropTypes,
  CommonDefaultProps,
  propResolver,
  PureComponent,
} from '../../../utils';

export default class Area extends PureComponent {
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

    const pathGenerator = area()
      .x((datum) => scales.x(propResolver(datum, dataAccessors.x)))
      .y0((datum) => scales.y(propResolver(datum, dataAccessors.y0)))
      .y1((datum) => scales.y(propResolver(datum, dataAccessors.y1)));

    return (
      <path
        className={className && classNames(className)}
        d={pathGenerator(data)}
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

  /* array of objects. e.g. [ {}, {}, {} ] */
  data: PropTypes.arrayOf(PropTypes.object).isRequired,

  dataAccessors: PropTypes.shape({
    x: CommonPropTypes.dataAccessor.isRequired,
    y0: CommonPropTypes.dataAccessor.isRequired,
    y1: CommonPropTypes.dataAccessor.isRequired,
  }).isRequired,

  /* mouse events signature: function(event, props.data, Area instance) {...} */
  onClick: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onMouseMove: PropTypes.func,
  onMouseOver: PropTypes.func,

  /* scales from d3Scale */
  scales: PropTypes.shape({
    x: PropTypes.func,
    y: PropTypes.func,
  }).isRequired,

  style: CommonPropTypes.style,
};

Area.defaultProps = {
  dataAccessors: { x: 'x', y0: 'y0', y1: 'y1' },
  onClick: CommonDefaultProps.noop,
  onMouseLeave: CommonDefaultProps.noop,
  onMouseMove: CommonDefaultProps.noop,
  onMouseOver: CommonDefaultProps.noop,
  style: {
    fill: 'steelblue',
    stroke: 'steelblue',
    strokeWidth: 1,
  },
};
