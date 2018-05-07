import React from 'react';
import Animate from 'react-move/Animate';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { line } from 'd3';
import bindAll from 'lodash/bindAll';
import partial from 'lodash/partial';

import {
  animationProcessorFactory,
  AnimateEvents,
  AnimateProp,
  AnimateTiming,
  CommonPropTypes,
  CommonDefaultProps,
  memoizeByLastCall,
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

    this.processStyle = memoizeByLastCall(Line.processStyle);
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

  renderPath({ d, ...processedProps }) {
    const {
      className,
      clipPathId,
      style,
    } = this.props;

    return (
      <path
        className={className && classNames(className)}
        clipPath={clipPathId && `url(#${clipPathId})`}
        d={d}
        fill="none"
        onClick={this.onClick}
        onMouseLeave={this.onMouseLeave}
        onMouseMove={this.onMouseMove}
        onMouseOver={this.onMouseOver}
        style={this.processStyle(style, processedProps)}
      />
    );
  }

  renderAnimatedPath() {
    const { animationProcessor } = this.state;
    const { data } = this.props;
    return (
      <Animate
        start={animationProcessor('start')(data)}
        enter={animationProcessor('enter')(data)}
        update={animationProcessor('update')(data)}
        leave={animationProcessor('leave')(data)}
      >
        {this.renderPath}
      </Animate>
    );
  }

  shouldAnimate() {
    return !!this.props.animate;
  }

  render() {
    if (this.shouldAnimate()) {
      return this.renderAnimatedPath();
    }

    const processedProps = Line.dataProcessor(this.props, this.props.data);

    return this.renderPath(processedProps);
  }
}

Line.propTypes = {
  /**
   * Whether to animate the Line component (using default `start`, `update` functions).
   * Optionally, an object that provides functions that dictate behavior of animations.
   */
  animate: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape({
      events: AnimateEvents,
      d: AnimateProp,
      stroke: AnimateProp,
      strokeWidth: AnimateProp,
      timing: AnimateTiming,
    }),
  ]),

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

Line.animatable = [
  'd',
  'stroke',
  'strokeWidth',
];

Line.processStyle = (style, { stroke, strokeWidth }) => ({
  ...style,
  stroke,
  strokeWidth,
});

Line.getPathGenerator = props => {
  return line()
    .x(datum => props.scales.x(propResolver(datum, props.dataAccessors.x)))
    .y(datum => props.scales.y(propResolver(datum, props.dataAccessors.y)));
};

Line.dataProcessor = (props, data) => ({
  d: Line.getPathGenerator(props)(data),
  stroke: props.stroke || props.style.stroke,
  strokeWidth: props.strokeWidth || props.style.strokeWidth,
});

Line.propUpdates = {
  animationProcessor: (acc, propName, prevProps, nextProps) => {
    const animationPropNames = [
      'animate',
      'data',
      'dataAccessors',
      'scales',
      'style',
    ];

    if (!propsChanged(prevProps, nextProps, animationPropNames)) {
      return acc;
    }

    const dataProcessor = partial(Line.dataProcessor, nextProps);

    const animationProcessor = partial(
      animationProcessorFactory,
      nextProps.animate,
      Line.animatable,
      dataProcessor,
    );

    return {
      ...acc,
      animationProcessor,
    };
  },
};
