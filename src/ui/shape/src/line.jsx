import React from 'react';
import Animate from 'react-move/Animate';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { line } from 'd3';
import bindAll from 'lodash/bindAll';

import {
  CommonPropTypes,
  CommonDefaultProps,
  propsChanged,
  propResolver,
  stateFromPropUpdates,
} from '../../../utils';

/**
 * `import { Line } from 'ihme-ui'`
 */
export default class Line extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = stateFromPropUpdates(Line.propUpdates, {}, props, {});

    bindAll(this, [
      'onClick',
      'onMouseLeave',
      'onMouseMove',
      'onMouseOver',
      'renderPath',
    ]);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(stateFromPropUpdates(Line.propUpdates, this.props, nextProps, {}));
  }

  onClick(event) {
    const {
      data,
      onClick,
    } = this.props;

    onClick(event, data, this);
  }

  onMouseLeave(event) {
    const {
      data,
      onMouseLeave,
    } = this.props;

    onMouseLeave(event, data, this);
  }

  onMouseMove(event) {
    const {
      data,
      onMouseMove,
    } = this.props;

    onMouseMove(event, data, this);
  }

  onMouseOver(event) {
    const {
      data,
      onMouseOver,
    } = this.props;

    onMouseOver(event, data, this);
  }

  shouldAnimate() {
    return !!this.props.animate;
  }

  renderPath(additionalProps) {
    const {
      className,
      clipPathId,
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
        onClick={this.onClick}
        onMouseLeave={this.onMouseLeave}
        onMouseMove={this.onMouseMove}
        onMouseOver={this.onMouseOver}
        style={style}
        {...additionalProps}
      />
    );
  }

  renderAnimatedPath() {
    const { path } = this.state;
    return (
      <Animate
        start={{ d: this.state.path }}
        update={{ d: [path] }}
      >
        {this.renderPath}
      </Animate>
    );
  }

  render() {
    return (
      this.shouldAnimate()
        ? this.renderAnimatedPath()
        : this.renderPath()
    );
  }
}

Line.propTypes = {
  /**
   * className applied to path.
   */
  className: CommonPropTypes.className,

  /**
   * if a clip path is applied to a container element (e.g., an `<AxisChart />`),
   * clip this path to that container by passing in the clip path URL id.
   */
  clipPathId: PropTypes.string,

  /**
   * Array of datum objects.
   */
  data: PropTypes.arrayOf(PropTypes.object).isRequired,

  /**
   * Accessors to pull appropriate values off of datum objects.
   * `dataAccessors` is an object that should have two properties: `x`, and `y`.
   * Each accessor can either be a string or function. If a string, it is assumed to be the name of a
   * property on datum objects; full paths to nested properties are supported (e.g., { `x`: 'values.year', ... }).
   * If a function, it is passed datum objects as its first and only argument.
   */
  dataAccessors: PropTypes.shape({
    x: CommonPropTypes.dataAccessor.isRequired,
    y: CommonPropTypes.dataAccessor.isRequired,
  }).isRequired,

  /**
   * onClick callback.
   * signature: (SyntheticEvent, data, instance) => {...}
   */
  onClick: PropTypes.func,

  /**
   * onMouseLeave callback.
   * signature: (SyntheticEvent, data, instance) => {...}
   */
  onMouseLeave: PropTypes.func,

  /**
   * onMouseMove callback.
   * signature: (SyntheticEvent, data, instance) => {...}
   */
  onMouseMove: PropTypes.func,

  /**
   * onMouseOver callback.
   * signature: (SyntheticEvent, data, instance) => {...}
   */
  onMouseOver: PropTypes.func,

  /**
   * `x` and `y` scales.
   * Object with keys: `x`, and `y`.
   */
  scales: PropTypes.shape({
    x: PropTypes.func,
    y: PropTypes.func,
  }).isRequired,

  /**
   * inline styles applied to path
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
    if (!propsChanged(prevProps, nextProps, ['data', 'dataAccessors', 'scales'])) {
      return acc;
    }

    const pathGenerator = line()
      .x((datum) => nextProps.scales.x(propResolver(datum, nextProps.dataAccessors.x)))
      .y((datum) => nextProps.scales.y(propResolver(datum, nextProps.dataAccessors.y)));

    return {
      ...acc,
      path: pathGenerator(nextProps.data),
    };
  },
};
