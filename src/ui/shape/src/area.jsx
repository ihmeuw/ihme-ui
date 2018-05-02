import React from 'react';
import Animate from 'react-move/Animate';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { area } from 'd3';
import bindAll from 'lodash/bindAll';
import partial from 'lodash/partial';

import {
  animationProcessorFactory,
  CommonPropTypes,
  CommonDefaultProps,
  memoizeByLastCall,
  propsChanged,
  propResolver,
  stateFromPropUpdates,
} from '../../../utils';

/**
 * `import { Area } from 'ihme-ui'`
 */
export default class Area extends React.PureComponent {
  constructor(props) {
    super(props);

    this.processStyle = memoizeByLastCall(Area.processStyle);
    this.state = stateFromPropUpdates(Area.propUpdates, {}, props, {});

    bindAll(this, [
      'onClick',
      'onMouseLeave',
      'onMouseMove',
      'onMouseOver',
      'renderPath',
    ]);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(stateFromPropUpdates(Area.propUpdates, this.props, nextProps, {}));
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

    const processedProps = Area.dataProcessor(this.props, this.props.data);

    return this.renderPath(processedProps);
  }
}

Area.propTypes = {
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
   * `dataAccessors` is an object that should have three properties: `x`, `y0`, and `y1`.
   * Each accessor can either be a string or function. If a string, it is assumed to be the name of a
   * property on datum objects; full paths to nested properties are supported (e.g., { `x`: 'values.year', ... }).
   * If a function, it is passed datum objects as its first and only argument.
   */
  dataAccessors: PropTypes.shape({
    x: CommonPropTypes.dataAccessor.isRequired,
    y0: CommonPropTypes.dataAccessor.isRequired,
    y1: CommonPropTypes.dataAccessor.isRequired,
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

Area.animatable = [
  'd',
  'fill',
  'stroke',
  'strokeWidth',
];

Area.processStyle = (style, { fill, stroke, strokeWidth }) => ({
  ...style,
  fill,
  stroke,
  strokeWidth,
});

Area.getPathGenerator = props => {
  return area()
    .x((datum) => props.scales.x(propResolver(datum, props.dataAccessors.x)))
    .y0((datum) => props.scales.y(propResolver(datum, props.dataAccessors.y0)))
    .y1((datum) => props.scales.y(propResolver(datum, props.dataAccessors.y1)));
};

Area.dataProcessor = (props, data) => ({
  d: Area.getPathGenerator(props)(data),
  fill: props.style.fill,
  stroke: props.style.stroke,
  strokeWidth: props.style.strokeWidth,
});

Area.propUpdates = {
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

    const dataProcessor = partial(Area.dataProcessor, nextProps);

    const animationProcessor = partial(
      animationProcessorFactory,
      nextProps.animate,
      Area.animatable,
      dataProcessor,
    );

    return {
      ...acc,
      animationProcessor,
    };
  },
};
