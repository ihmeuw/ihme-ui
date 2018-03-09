import React from 'react';
import NodeGroup from 'react-move/NodeGroup';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { scaleLinear } from 'd3';
import assign from 'lodash/assign';
import bindAll from 'lodash/bindAll';
import findIndex from 'lodash/findIndex';
import isFinite from 'lodash/isFinite';
import keyBy from 'lodash/keyBy';
import map from 'lodash/map';
import pick from 'lodash/pick';
import sortBy from 'lodash/sortBy';

import {
  animationProcessorFactory,
  animationStartFactory,
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

  static getDatumProcessor(
    {
      colorScale,
      dataAccessors,
      fill,
      scales,
      shapeScale,
      shapeType,
    },
  ) {
    return function processDatum(datum) {
      // Compute fill.
      const fillValue = propResolver(datum, dataAccessors.fill || dataAccessors.x);
      const processedFill = colorScale && isFinite(fillValue) ? colorScale(fillValue) : fill;

      // Compute shape type.
      const resolvedShapeType = dataAccessors.shape ?
        shapeScale(propResolver(datum, dataAccessors.shape)) :
        shapeType;

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
    };
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

  processDataSet(data, keyAccessor) {
    // Conform non-animated data to shape of animated data.
    return data.reduce((accum, datum) => {
      const newDatum = {
        data: datum,
        key: propResolver(datum, keyAccessor),
        state: this.state.processDatum(datum),
      };

      return [
        ...accum,
        newDatum,
      ];
    }, []);
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
    return (
      <Shape
        className={this.props.shapeClassName}
        key={key}
        datum={data}
        fill={fill}
        focused={this.state.focusedDatumKey === key}
        selected={this.state.selectedDataMappedToKeys.hasOwnProperty(key)}
        shapeType={shapeType}
        style={this.props.shapeStyle}
        translateX={translateX}
        translateY={translateY}
        {...this.state.childProps}
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
        {map(data, this.renderShape)}
      </g>
    );
  }

  renderAnimatedScatter(data) {
    // react-move properties `start`, `enter`, `update`, and `move` are populated by the default
    // animated behavior of IHME-UI Scatter component unless overridden in animate prop.
    const { key } = this.props.dataAccessors;
    const {
      animationProcessor,
      animationStartProcessor,
    } = this.state;

    return (
      <NodeGroup
        data={data}
        keyAccessor={datum => propResolver(datum, key)}
        start={animationStartProcessor}
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
    const { sortedData } = this.state;
    // If `props.animate` is true, we want to render the animated scatter component. Since this
    // requires the data to be in a particular shape, we make both the animated & the non-animated
    // data conform to that shape which allows us to leverage the same rendering methods.
    return (
      this.shouldAnimate()
      ? this.renderAnimatedScatter(sortedData)
      : this.renderScatter(this.processDataSet(sortedData))
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
      /**
       * `start` function.
       * A function that returns the starting state.
       * The function is passed the data and index and must return an object.
       *
       * Default `start` function (You can specify just the things you want to override):
       * (datum, index) => {
       *   processedFill?: string[];       // color after colorScales has been applied.
       *   resolvedShapeType?: string[];   // shape after shapeScale has been applied.
       *   translateX?: number[];          // x coordinate after positioning scale has been applied.
       *   translateY?: number[];          // y coordinate after positioning scale has been applied.
       * }
       *
       * Note: `start` does not use `timing`, `events` properties because it represents initial state.
       */
      start: PropTypes.func,
      /**
       * `enter`, `leave`, `update` animation functions. [detailed in react-move](https://react-move.js.org/#/documentation/node-group)
       * A function that returns an object or array of objects describing how the state should transform
       * on enter. The function is passed the data and index.
       *
       * All required properties must be overridden in return value of `enter`, `leave`, `update` functions.
       * ie signature: (datum, index) => {} | [{}] where properties, or accumulative properties result
       * in shape: {
       *   processedFill: string | string[];      // color after colorScales has been applied.
       *   resolvedShapeType: string | string[];  // shape after shapeScale has been applied.
       *   translateX: number | number[];         // x coordinate after positioning scale has been applied.
       *   translateY: number | number[];         // y coordinate after positioning scale has been applied.
       *   timing?: {                             // *defaultTiming [detailed in react-move](https://react-move.js.org/#/documentation/node-group).
       *     delay?: number;                      // delay before animation in ms.
       *     duration?: number;                   // duration of enter animation in ms.
       *     ease?: () => number,                 // interpolator function. ie d3-ease.
       *   },
       *   events?: {                             // [detailed in react-move](https://react-move.js.org/#/documentation/node-group).
       *     start?: () => void,                  // function to run on `start`.
       *     interrupt?: () => void,              // function to run on `interrupt`.
       *     end?: () => void,                    // function to run on `end`.
       *   },
       * }
       *
       * *Default `enter`,`leave` function: undefined
       */
      enter: PropTypes.func,
      leave: PropTypes.func,
      update: PropTypes.func,
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
  processDatum: (state, _, prevProps, nextProps) => {
    const datumProcessorProps = [
      'colorScale',
      'data',
      'dataAccessors',
      'fill',
      'scales',
      'shapeScale',
      'shapeType',
    ];
    if (!propsChanged(prevProps, nextProps, datumProcessorProps)) return state;

    return assign({}, state, { processDatum: Scatter.getDatumProcessor(nextProps) });
  },
  animationProcessor: (state, _, prevProps, nextProps) => {
    if (!propsChanged(prevProps, nextProps, ['animate'])) return state;

    const animationProcessor = animationProcessorFactory(
      nextProps.animate,
      Scatter.getDatumProcessor(nextProps),
      Scatter.animatable,
    );

    return assign({}, state, { animationProcessor });
  },
  animationStartProcessor: (state, _, prevProps, nextProps) => {
    if (!propsChanged(prevProps, nextProps, ['animate'])) return state;

    const animationStartProcessor = animationStartFactory(
      nextProps.animate,
      Scatter.getDatumProcessor(nextProps),
    );

    return assign({}, state, { animationStartProcessor });
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
    return assign({}, state, { childProps: pick(nextProps, childPropNames) });
  },
  focusedDatumKey: (state, _, prevProps, nextProps) => {
    if (!propsChanged(prevProps, nextProps, ['focus', 'data'])) return state;
    const {
      dataAccessors: { key },
      focus,
    } = nextProps;
    return assign({}, state, { focusedDatumKey: focus ? propResolver(focus, key) : null });
  },
  selections: (state, _, prevProps, nextProps) => {
    if (!propsChanged(prevProps, nextProps, ['selection', 'dataAccessors'])) return state;
    return assign({}, state, {
      selectedDataMappedToKeys: keyBy(nextProps.selection, (selectedDatum) =>
        propResolver(selectedDatum, nextProps.dataAccessors.key)
      ),
    });
  },
  sortedData: (state, _, prevProps, nextProps) => {
    /* eslint-disable max-len, eqeqeq */
    if (!propsChanged(prevProps, nextProps, ['selection', 'data'])) return state;
    const keyField = nextProps.dataAccessors.key;
    return assign({}, state, {
      // sort data by whether or not datum is selected
      // this is a way of ensuring that selected symbols are rendered last
      // similar to, in a path click handler, doing a this.parentNode.appendChild(this)
      sortedData: sortBy(nextProps.data, (datum) =>
        findIndex(nextProps.selection, (selected) =>
          propResolver(datum, keyField) == propResolver(selected, keyField)
        )
      ),
    });
  },
};
