import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { line } from 'd3-shape';
import { assign, noop } from 'lodash';

import { eventHandleWrapper } from '../../../utils/events';
import {
  CommonPropTypes,
  propsChanged,
  PureComponent,
  stateFromPropUpdates,
} from '../../../utils';

const propTypes = {
  /* base classname to apply to line */
  className: CommonPropTypes.className,

  /* array of objects
    e.g. [ {}, {}, {} ]
  */
  data: PropTypes.arrayOf(PropTypes.object).isRequired,

  dataAccessors: PropTypes.shape({
    x: PropTypes.string,
    y: PropTypes.string
  }).isRequired,

  fill: PropTypes.string,

  /* signature: function(event, props.data, Line instance) {...} */
  onClick: PropTypes.func,

  /* signature: function(event, props.data, Line instance) {...} */
  onMouseLeave: PropTypes.func,

  /* signature: function(event, props.data, Line instance) {...} */
  onMouseMove: PropTypes.func,

  /* signature: function(event, props.data, Line instance) {...} */
  onMouseOver: PropTypes.func,

  /* scales from d3Scale */
  scales: PropTypes.shape({
    x: PropTypes.func,
    y: PropTypes.func
  }).isRequired,

  stroke: PropTypes.string,

  strokeWidth: PropTypes.number,
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

export default class Line extends PureComponent {
  /**
   * Return path string for <path>'s d attribute
   * @param {Object} scales - scales from d3Scale
   * @param {Function} scales.x - scale for x axis
   * @param {Function} scales.y - scale for y axis
   * @param {Object[]} data - array of data points to be used in creating the line
   * @param {Object} dataAccessors - keys into objects in the data parameter for determining the point coordinates
   * @param {String} dataAccessors.x - key into data objects for getting the x-value
   * @param {String} dataAccessors.y - key into data objects for getting the y-value
   * @return {String}
   */
  static getPath(scales, data, { x: xAccessor, y: yAccessor }) {
    const pathBuilder = line()
      .x((datum) => scales.x(datum[xAccessor]))
      .y((datum) => scales.y(datum[yAccessor]));
    return pathBuilder(data);
  }

  constructor(props) {
    super(props);
    this.state = stateFromPropUpdates(Line.propUpdates, {}, props, {});
  }

  componentWillReceiveProps(nextProps) {
    this.setState(stateFromPropUpdates(Line.propUpdates, this.props, nextProps, {}));
  }

  render() {
    const {
      className,
      data,
      fill,
      stroke,
      strokeWidth,
      onClick,
      onMouseLeave,
      onMouseMove,
      onMouseOver,
    } = this.props;

    const { path } = this.state;

    return (
      <path
        className={classNames(className) || (void 0)}
        fill={fill}
        stroke={stroke}
        strokeWidth={`${strokeWidth}px`}
        d={path}
        onClick={eventHandleWrapper(onClick, data, this)}
        onMouseLeave={eventHandleWrapper(onMouseLeave, data, this)}
        onMouseMove={eventHandleWrapper(onMouseMove, data, this)}
        onMouseOver={eventHandleWrapper(onMouseOver, data, this)}
      />
    );
  }
}

Line.propTypes = propTypes;

Line.defaultProps = defaultProps;

Line.propUpdates = {
  // update state.path if scales, data, or dataAccessors props have changed
  path: (accum, propName, prevProps, nextProps) => {
    if (!propsChanged(prevProps, nextProps, ['scales', 'data', 'dataAccessors'])) {
      return accum;
    }
    return assign(accum, {
      path: Line.getPath(nextProps.scales, nextProps.data, nextProps.dataAccessors),
    });
  },
};
