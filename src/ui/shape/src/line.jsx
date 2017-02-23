import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { line } from 'd3';

import {
  CommonPropTypes,
  CommonDefaultProps,
  eventHandleWrapper,
  propsChanged,
  propResolver,
  PureComponent,
  stateFromPropUpdates,
} from '../../../utils';

export default class Line extends PureComponent {
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
      clipPathId,
      data,
      onClick,
      onMouseLeave,
      onMouseMove,
      onMouseOver,
      style,
    } = this.props;

    const {
      path,
    } = this.state;

    return (
      <path
        className={className && classNames(className)}
        clipPath={clipPathId && `url(#${clipPathId})`}
        d={path}
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

  /* string id url for clip path */
  clipPathId: PropTypes.string,

  /* array of objects. e.g. [ {}, {}, {} ] */
  data: PropTypes.arrayOf(PropTypes.object).isRequired,

  dataAccessors: PropTypes.shape({
    x: CommonPropTypes.dataAccessor.isRequired,
    y: CommonPropTypes.dataAccessor.isRequired,
  }).isRequired,

  /* mouse events signature: function(event, data, instance) {...} */
  onClick: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onMouseMove: PropTypes.func,
  onMouseOver: PropTypes.func,

  /* scales from d3Scale */
  scales: PropTypes.shape({
    x: PropTypes.func,
    y: PropTypes.func,
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

Line.propUpdates = {
  path: (acc, propName, prevProps, nextProps) => {
    if (propsChanged(prevProps, nextProps, ['data', 'dataAccessors', 'scales'])) {
      const pathGenerator = line()
        .x(datum => nextProps.scales.x(propResolver(datum, nextProps.dataAccessors.x)))
        .y(datum => nextProps.scales.y(propResolver(datum, nextProps.dataAccessors.y)));
      return {
        ...acc,
        path: pathGenerator(nextProps.data),
      };
    }
    return acc;
  },
};
