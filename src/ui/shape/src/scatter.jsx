import React from 'react';
import NodeGroup from 'react-move/NodeGroup';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { scaleLinear } from 'd3';
import bindAll from 'lodash/bindAll';
import findIndex from 'lodash/findIndex';
import isFinite from 'lodash/isFinite';
import has from 'lodash/has';
import keyBy from 'lodash/keyBy';
import partial from 'lodash/partial';
import pick from 'lodash/pick';
import sortBy from 'lodash/sortBy';

import {
  animationProcessorFactory,
  AnimateEvents,
  AnimateProp,
  AnimateTiming,
  combineStyles,
  CommonDefaultProps,
  CommonPropTypes,
  memoizeByLastCall,
  propResolver,
  propsChanged,
  stateFromPropUpdates,
} from '../../../utils';

import Shape from './shape';

/**
 * `import { Scatter } from 'ihme-ui'`
 */
export default class Scatter extends React.PureComponent {
  static getCoordinate(value, scale) {
    return scale && isFinite(value) ? scale(value) : 0;
  }

  constructor(props) {
    super(props);
    this.combineStyles = memoizeByLastCall(combineStyles);
    this.state = stateFromPropUpdates(Scatter.propUpdates, {}, props, {});
    bindAll(this, [
      'renderScatter',
      'renderShape',
    ]);
  }

  componentWillReceiveProps(nextProps) {
    this.state = stateFromPropUpdates(Scatter.propUpdates, this.props, nextProps, this.state);
  }

  static processDatum(props, datum) {
    const {
      colorScale,
      dataAccessors,
      fill,
      scales,
      shapeScale,
      shapeType,
    } = props;

    // Compute fill.
    const fillValue = propResolver(datum, dataAccessors.fill || dataAccessors.x);
    const processedFill = colorScale && isFinite(fillValue) ? colorScale(fillValue) : fill;

    // Compute shape type.
    const resolvedShapeType = dataAccessors.shape
      ? shapeScale(propResolver(datum, dataAccessors.shape))
      : shapeType;

    // Compute x and y translations.
    const translateX = Scatter.getCoordinate(
      propResolver(datum, dataAccessors.x),
      scales && scales.x,
    );
    const translateY = Scatter.getCoordinate(
      propResolver(datum, dataAccessors.y),
      scales && scales.y,
    );

    return {
      fill: processedFill,
      shapeType: resolvedShapeType,
      translateX,
      translateY,
    };
  }

  processDataSet(data) {
    const { key } = this.props.dataAccessors;
    // This data shape is compatible with animated and non-animated components.
    return data.map(
      datum => ({
        data: datum,
        key: propResolver(datum, key),
        state: Scatter.processDatum(this.props, datum),
      }),
    );
  }

  renderShape({
    data,
    key,
    state: {
      fill,
      shapeType,
      translateX,
      translateY,
    },
  }) {
    const {
      shapeClassName,
      shapeStyle,
    } = this.props;

    const {
      childProps,
      focusedDatumKey,
      selectedDataMappedToKeys,
    } = this.state;

    return (
      <Shape
        className={shapeClassName}
        key={key}
        datum={data}
        fill={fill}
        focused={focusedDatumKey === key}
        selected={has(selectedDataMappedToKeys, key)}
        shapeType={shapeType}
        style={shapeStyle}
        translateX={translateX}
        translateY={translateY}
        {...childProps}
      />
    );
  }

  renderScatter(data) {
    return (
      <g
        className={this.props.className && classNames(this.props.className)}
        clipPath={this.props.clipPathId && `url(#${this.props.clipPathId})`}
        style={this.combineStyles(this.props.style, this.props.data)}
      >
        {data.map(this.renderShape)}
      </g>
    );
  }

  renderAnimatedScatter(data) {
    // react-move properties `start`, `enter`, `update`, and `move` are populated by the default
    // animated behavior of IHME-UI Scatter component unless overridden in `animate` prop.
    const { animationProcessor } = this.state;

    return (
      <NodeGroup
        data={data}
        keyAccessor={({ key }) => key}
        start={animationProcessor('start')}
        enter={animationProcessor('enter')}
        update={animationProcessor('update')}
        leave={animationProcessor('leave')}
      >
        {this.renderScatter}
      </NodeGroup>
    );
  }

  shouldAnimate() {
    return !!this.props.animate;
  }

  render() {
    const data = this.processDataSet(this.state.sortedData);

    return (
      this.shouldAnimate()
      ? this.renderAnimatedScatter(data)
      : this.renderScatter(data)
    );
  }
}

/**
 * Props given to <Shape /> children that can be animated using <Scatter animate />
 * @type {string[]}
 */
Scatter.animatable = [
  'fill',
  'translateX',
  'translateY',
];

Scatter.propTypes = {
  /**
   * Whether to animate the scatter component (using default `start`, `update` functions).
   * Optionally, an object that provides functions that dictate behavior of animations.
   */
  animate: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape({
      fill: AnimateProp,
      translateX: AnimateProp,
      translateY: AnimateProp,
      events: AnimateEvents,
      timing: AnimateTiming,
    }),
  ]),

  /**
   * className applied to outermost wrapping `<g>`.
   */
  className: CommonPropTypes.className,

  /**
   * If a clip path is applied to a container element (e.g., an `<AxisChart />`),
   * clip all children of `<Scatter />` to that container by passing in the clip path URL id.
   */
  clipPathId: PropTypes.string,

  /**
   * If provided will determine color of rendered `<Shape />`s
   */
  colorScale: PropTypes.func,

  /**
   * Array of datum objects
   */
  data: PropTypes.arrayOf(PropTypes.object).isRequired,

  /**
   * Accessors on datum objects
   *   fill: property on datum to provide fill (will be passed to `props.colorScale`)
   *   key: unique dimension of datum (required)
   *   shape: property on datum used to determine which type of shape to render (will be passed to `props.shapeScale`)
   *   x: property on datum to position scatter shapes in x-direction
   *   y: property on datum to position scatter shapes in y-direction
   *
   * Each accessor can either be a string or function. If a string, it is assumed to be the name of a
   * property on datum objects; full paths to nested properties are supported (e.g., { `x`: 'values.year', ... }).
   * If a function, it is passed datum objects as its first and only argument.
   */
  dataAccessors: PropTypes.shape({
    fill: CommonPropTypes.dataAccessor,
    key: CommonPropTypes.dataAccessor.isRequired,
    shape: CommonPropTypes.dataAccessor,
    x: CommonPropTypes.dataAccessor,
    y: CommonPropTypes.dataAccessor,
  }).isRequired,

  /**
   * If `props.colorScale` is undefined, each `<Shape />` will be given this same fill value.
   */
  fill: PropTypes.string,

  /**
   * The datum object corresponding to the `<Shape />` currently focused.
   */
  focus: PropTypes.object,

  /**
   * className applied if `<Shape />` has focus.
   */
  focusedClassName: CommonPropTypes.className,

  /**
   * inline styles applied to focused `<Shape />`
   * If an object, spread into inline styles.
   * If a function, passed underlying datum corresponding to its `<Shape />`,
   * and return value is spread into inline styles;
   * signature: (datum) => obj
   */
  focusedStyle: CommonPropTypes.style,

  /**
   * onClick callback.
   * signature: (SyntheticEvent, datum, instance) => {...}
   */
  onClick: PropTypes.func,

  /**
   * onMouseLeave callback.
   * signature: (SyntheticEvent, datum, instance) => {...}
   */
  onMouseLeave: PropTypes.func,

  /**
   * onMouseMove callback.
   * signature: (SyntheticEvent, datum, instance) => {...}
   */
  onMouseMove: PropTypes.func,

  /**
   * onMouseOver callback.
   * signature: (SyntheticEvent, datum, instance) => {...}
   */
  onMouseOver: PropTypes.func,

  /**
   * `x` and `y` scales for positioning `<Shape />`s.
   * Object with keys: `x`, and `y`.
   */
  scales: PropTypes.shape({
    x: PropTypes.func,
    y: PropTypes.func,
  }),

  /**
   * className applied to `<Shape />`s if selected
   */
  selectedClassName: CommonPropTypes.className,

  /**
   * Array of datum objects corresponding to selected `<Shape />`s
   */
  selection: PropTypes.array,

  /**
   * Size of `<Shape />`s; area in square pixels.
   * If not provided, `<Shape />` provides a default of 64 (8px x 8px).
   */
  size: PropTypes.number,

  /**
   * Inline styles applied to wrapping element (`<g>`) of scatter shapes
   */
  style: CommonPropTypes.style,

  /**
   * className applied to each `<Shape />`
   */
  shapeClassName: CommonPropTypes.className,

  /**
   * If provided, used in conjunction with `dataAccessors.shape` (or `dataAccessors.key` if not provided)
   * to determine type of shape to render
   */
  shapeScale: PropTypes.func,

  /**
   * Inline styles passed to each `<Shape />`
   */
  shapeStyle: CommonPropTypes.style,

  /**
   * Type of shape to render; use in lieu of `props.shapeScale`
   * if you want all `<Shape />` to be of the same type.
   */
  shapeType: PropTypes.string,
};

Scatter.defaultProps = {
  animate: false,
  enter: undefined,
  fill: 'steelblue',
  leave: undefined,
  onClick: CommonDefaultProps.noop,
  onMouseLeave: CommonDefaultProps.noop,
  onMouseMove: CommonDefaultProps.noop,
  onMouseOver: CommonDefaultProps.noop,
  scales: { x: scaleLinear(), y: scaleLinear() },
  size: 64,
  shapeStyle: undefined,
  shapeType: 'circle',
  start: undefined,
  update: undefined,
};

Scatter.propUpdates = {
  animationProcessor: (state, _, prevProps, nextProps) => {
    if (!propsChanged(prevProps, nextProps, ['animate'])) return state;
    const animationProcessor = partial(
      animationProcessorFactory,
      nextProps.animate,
      Scatter.animatable,
    );
    return {
      ...state,
      animationProcessor,
    };
  },
  childProps: (state, _, prevProps, nextProps) => {
    const childPropNames = [
      'focusedClassName',
      'focusedStyle',
      'onClick',
      'onMouseLeave',
      'onMouseMove',
      'onMouseOver',
      'selectedClassName',
      'selectedStyle',
      'size',
    ];
    if (!propsChanged(prevProps, nextProps, childPropNames)) return state;
    return {
      ...state,
      childProps: pick(nextProps, childPropNames),
    };
  },
  focusedDatumKey: (state, _, prevProps, nextProps) => {
    if (!propsChanged(prevProps, nextProps, ['focus', 'data'])) return state;
    const {
      dataAccessors: { key },
      focus,
    } = nextProps;
    return {
      ...state,
      focusedDatumKey: focus ? propResolver(focus, key) : null,
    };
  },
  selections: (state, _, prevProps, nextProps) => {
    if (!propsChanged(prevProps, nextProps, ['selection', 'dataAccessors'])) return state;
    const selectedDataMappedToKeys = keyBy(nextProps.selection, (selectedDatum) =>
      propResolver(selectedDatum, nextProps.dataAccessors.key)
    );
    return {
      ...state,
      selectedDataMappedToKeys,
    };
  },
  sortedData: (state, _, prevProps, nextProps) => {
    /* eslint-disable eqeqeq */
    if (!propsChanged(prevProps, nextProps, ['selection', 'data'])) return state;
    // sort data by whether or not datum is selected
    // this is a way of ensuring that selected symbols are rendered last
    // similar to, in a path click handler, doing a this.parentNode.appendChild(this)
    const keyField = nextProps.dataAccessors.key;
    const sortedData = sortBy(nextProps.data, (datum) =>
      findIndex(nextProps.selection, (selected) =>
        propResolver(datum, keyField) == propResolver(selected, keyField)
      )
    );
    return {
      ...state,
      sortedData,
    };
  },
};
