import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { scaleLinear } from 'd3';
import { castArray, map, pick } from 'lodash';
import Scatter from './scatter';

import {
  combineStyles,
  CommonDefaultProps,
  CommonPropTypes,
  memoizeByLastCall,
  propResolver,
} from '../../../utils';

/**
 * `import { MultiScatter } from 'ihme-ui'`
 *
 * This is a convenience component intended to make it easier to render many `<Scatter />`s on a single chart.
 */
export default class MultiScatter extends React.PureComponent {
  constructor(props) {
    super(props);

    this.combineStyles = memoizeByLastCall(combineStyles);
    this.castSelectionAsArray = memoizeByLastCall((selection) => castArray(selection));
  }

  render() {
    const {
      className,
      clipPathId,
      colorScale,
      data,
      fieldAccessors,
      scatterClassName,
      scatterStyle,
      scatterValuesIteratee,
      selection,
      style,
      shapeScale,
    } = this.props;

    const {
      color: colorField,
      data: dataField,
      key: keyField,
      shape: shapeField,
    } = fieldAccessors;

    const childProps = pick(this.props, [
      'animate',
      'colorScale',
      'dataAccessors',
      'enter',
      'focus',
      'focusedClassName',
      'focusedStyle',
      'leave',
      'onClick',
      'onMouseLeave',
      'onMouseMove',
      'onMouseOver',
      'selectedClassName',
      'selectedStyle',
      'scales',
      'size',
      'shapeClassName',
      'shapeScale',
      'shapeStyle',
      'start',
      'update',
    ]);

    return (
      <g
        className={className && classNames(className)}
        clipPath={clipPathId && `url(#${clipPathId})`}
        style={this.combineStyles(style, data)}
      >
        {
          map(data, (datum) => {
            const key = propResolver(datum, keyField);
            const values = propResolver(datum, dataField);

            const color = colorScale(colorField ? propResolver(datum, colorField) : key);

            const shapeType = shapeField && shapeScale(propResolver(datum, shapeField));

            const scatterValues = scatterValuesIteratee(values, key);

            return !!scatterValues ? (
              <Scatter
                className={scatterClassName}
                data={scatterValues}
                fill={color}
                key={`scatter:${key}`}
                selection={this.castSelectionAsArray(selection)}
                style={scatterStyle}
                shapeType={shapeType}
                {...childProps}
              />
            ) : null;
          })
        }
      </g>
    );
  }
}

MultiScatter.propTypes = {
  /**
   * Whether to animate the multi-scatter component or not.
   */
  animate: PropTypes.boolean,

  /**
   * className applied to outermost wrapping `<g>`.
   */
  className: CommonPropTypes.className,

  /**
   * If a clip path is applied to a container element (e.g., an `<AxisChart />`),
   * clip all children of `<MultiScatter />` to that container by passing in the clip path URL id.
   */
  clipPathId: PropTypes.string,

  /**
   * If provided and `dataAccessors.fill` is undefined, determines the color of scatter shapes.
   */
  colorScale: PropTypes.func,

  /**
   *  Array of objects, e.g. [ {location: 'USA',values: []}, {location: 'Canada', values: []} ].
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
    key: CommonPropTypes.dataAccessor,
    shape: CommonPropTypes.dataAccessor,
    x: CommonPropTypes.dataAccessor,
    y: CommonPropTypes.dataAccessor,
  }).isRequired,

  /**
   * `enter` animation function. [detailed in react-move](https://react-move.js.org/#/documentation/node-group)
   * A function that returns an object or array of objects describing how the state should transform
   * on enter. The function is passed the data and index.
   *
   * Signature: (datum, index) => {
   *   processedFill: string[];       // color after colorScales has been applied.
   *   resolvedShapeType: string[];   // shape after shapeScale has been applied.
   *   translateX: number[];          // x coordinate after positioning scale has been applied.
   *   translateY: number[];          // y coordinate after positioning scale has been applied.
   *   timing: {                      // *defaultTiming [detailed in react-move](https://react-move.js.org/#/documentation/node-group).
   *     delay: number;               // delay before animation in ms.
   *     duration: number;            // duration of enter animation in ms.
   *     ease: () => number,          // interpolator funciton. ie d3-ease.
   *   },
   *   events: {                      // [detailed in react-move](https://react-move.js.org/#/documentation/node-group).
   *     start: () => void,           // function to run on `start`.
   *     interrupt: () => void,       // function to run on `interrupt`.
   *     end: () => void,             // function to run on `end`.
   *   },
   * }
   *
   * Default `enter` function: () => {}
   */
  enter: PropTypes.func,

  /**
   * Accessors for objects within `props.data`
   *   color: (optional) color data as input to color scale.
   *   data: data provided to child components. default: 'values'
   *   key: unique key to apply to child components. used as input to color scale if color field is not specified. default: 'key'
   *   shape: shape data as input to the shape scale.
   */
  fieldAccessors: PropTypes.shape({
    color: CommonPropTypes.dataAccessor,
    data: CommonPropTypes.dataAccessor.isRequired,
    key: CommonPropTypes.dataAccessor.isRequired,
    shape: CommonPropTypes.dataAccessor,
  }),

  /**
   * The datum object corresponding to the `<Shape />` currently focused.
   */
  focus: PropTypes.object,

  /**
   * className applied if `<Shape />` has focus.
   */
  focusedClassName: CommonPropTypes.className,

  /**
   * Inline styles applied to focused `<Shape />`.
   * If an object, spread into inline styles.
   * If a function, passed underlying datum corresponding to its `<Shape />`,
   * and return value is spread into inline styles;
   * signature: (datum) => obj
   */
  focusedStyle: CommonPropTypes.style,

  /**
   * `leave` animation function. [detailed in react-move](https://react-move.js.org/#/documentation/node-group)
   * A function that returns an object or array of objects describing how the state should
   * transform on leave. The function is passed the data and index.
   *
   * Signature: (datum, index) => {
   *   processedFill: string[];       // color after colorScales has been applied.
   *   resolvedShapeType: string[];   // shape after shapeScale has been applied.
   *   translateX: number[];          // x coordinate after positioning scale has been applied.
   *   translateY: number[];          // y coordinate after positioning scale has been applied.
   *   timing: {                      // *defaultTiming [detailed in react-move](https://react-move.js.org/#/documentation/node-group).
   *     delay: number;               // delay before animation in ms.
   *     duration: number;            // duration of enter animation in ms.
   *     ease: () => number,          // interpolator function. ie d3-ease.
   *   },
   *   events: {                      // [detailed in react-move](https://react-move.js.org/#/documentation/node-group).
   *     start: () => void,           // function to run on `start`.
   *     interrupt: () => void,       // function to run on `interrupt`.
   *     end: () => void,             // function to run on `end`.
   *   },
   * }
   *
   * Default `leave` function: () => {}
   */
  leave: PropTypes.func,

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
   * className applied to `<Scatter />`'s outermost wrapping `<g>`.
   */
  scatterClassName: CommonPropTypes.className,

  /**
   * inline styles applied to `<Scatter />`'s outermost wrapping `<g>`.
   */
  scatterStyle: CommonDefaultProps.style,

  /**
   * function to apply to the datum to transform scatter values. default: _.identity
   * signature: (data, key) => {...}
   */
  scatterValuesIteratee: PropTypes.func,

  /**
   * className applied to `<Shape />`s if selected
   */
  selectedClassName: CommonPropTypes.className,

  /**
   * inline styles applied to selected `<Shape />`s.
   * If an object, spread into inline styles.
   * If a function, passed underlying datum corresponding to its `<Shape />`,
   * and return value is spread into inline styles;
   * signature: (datum) => obj
   */
  selectedStyle: CommonPropTypes.style,

  /**
   * Datum object or array of datum objects corresponding to selected `<Shape />`s
   */
  selection: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]),

  /**
   * Size of `<Shape />`s; area in square pixels.
   * If not provided, `<Shape />` provides a default of 64 (8px x 8px).
   */
  size: PropTypes.number,

  /**
   * inline style applied to outermost wrapping `<g>`
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
   * Inline styles applied to `<Shape />`s.
   */
  shapeStyle: CommonPropTypes.style,

  /**
   * `start` function.
   * A function that returns the starting state.
   * The function is passed the data and index and must return an object.
   *
   * Default `start` function (You can specify just the things you want to override): () => {
   *   processedFill: string[];       // color after colorScales has been applied.
   *   resolvedShapeType: string[];   // shape after shapeScale has been applied.
   *   translateX: number[];          // x coordinate after positioning scale has been applied.
   *   translateY: number[];          // y coordinate after positioning scale has been applied.
   * }
   */
  start: PropTypes.func,

  /**
   * `update` animation function. [detailed in react-move](https://react-move.js.org/#/documentation/node-group)
   * A function that returns an object or array of objects describing how the state should transform
   * on update. The function is passed the data and index.
   *
   * Default `update` function (You can specify just the things you want to override): () => {
   *   processedFill: string[];       // color after colorScales has been applied.
   *   resolvedShapeType: string[];   // shape after shapeScale has been applied.
   *   translateX: number[];          // x coordinate after positioning scale has been applied.
   *   translateY: number[];          // y coordinate after positioning scale has been applied.
   *   timing: {                      // *defaultTiming [detailed in react-move](https://react-move.js.org/#/documentation/node-group)
   *     delay: 0,                    // delay before animation in ms.
   *     duration: 250,               // duration of enter animation in ms.
   *     ease: d3-ease.easeLinear,    // interpolator function.
   *   },
   *   events: {},                    // [detailed in react-move](https://react-move.js.org/#/documentation/node-group).
   * }
   */
  update: PropTypes.func,
};

MultiScatter.defaultProps = {
  animate: false,
  colorScale() { return 'steelblue'; },
  enter: undefined,
  fieldAccessors: {
    data: 'values',
    key: 'key',
  },
  leave: undefined,
  scales: { x: scaleLinear(), y: scaleLinear() },
  scatterValuesIteratee: CommonDefaultProps.identity,
  size: 64,
  shapeField: 'type',
  shapeScale() { return 'circle'; },
  start: undefined,
  update: undefined,
};
