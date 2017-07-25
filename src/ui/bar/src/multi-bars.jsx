import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { scaleLinear, scaleBand, stack, max } from 'd3';
import { castArray, map, pick } from 'lodash';
import Bars from './bars';


import {
  isVertical,
  combineStyles,
  CommonDefaultProps,
  CommonPropTypes,
  memoizeByLastCall,
  propResolver,
  PureComponent,
  stackedDataArray,
} from '../../../utils';


export default class MultiBars extends PureComponent {
  constructor(props) {
    super(props);

    this.combineStyles = memoizeByLastCall(combineStyles);
    this.castSelectionAsArray = memoizeByLastCall((selection) => castArray(selection));
  }

  render() {
    const {
      barsClassName,
      barsStyle,
      barsValueIteratee,
      className,
      clipPathId,
      colorScale,
      data,
      dataAccessors,
      fieldAccessors,
      height,
      innerDomain,
      innerOrdinal,
      orientation,
      scales,
      selection,
      style,
      type,
      stacked,
      xDomain,
      grouped,
    } = this.props;

    const {
      fill: fillField,
      key: renameLater,
      x: xField,
      y: yField,
      otherX: otherField,
    } = dataAccessors;

    const {
      color: colorField,
      data: dataField,
      key: keyField
    } = fieldAccessors;


    // Sets these constants to the correct scales based on whether the orientation
    // is default at vertical. (i.e. having  x axis contains the bands and y axis be
    // linear, vice versa)
    const ordinal = (isVertical(orientation) ? scales.x : scales.y);
    const linear = (isVertical(orientation) ? scales.y : scales.x);

    const outerOrdinal = (isVertical(orientation) ? scales.x : scales.y);



    if (stacked) {
      const stackedDomain = [0, max(stackedDataArray(data, xField, yField, otherField, dataField, xDomain), (data) => { return max(data, (d) => { return d[1]; }); })];

      linear.domain(stackedDomain);

    } else { // grouped bar chart type
      innerOrdinal.domain(innerDomain).range([0, outerOrdinal.bandwidth()]);

      // update y domain

      // scales.y.domain
    }

    console.log(stackedDataArray(data, xField, yField, otherField, dataField, xDomain));
    console.log(Object.prototype.hasOwnProperty.call(this.props, 'type'));

    const childProps = pick(this.props, [
      'colorScale',
      'dataAccessors',
      'focus',
      'focusedClassName',
      'focusedStyle',
      'height',
      'innerOrdinal',
      'onClick',
      'onMouseLeave',
      'onMouseMove',
      'onMouseOver',
      'orientation',
      'selectedClassName',
      'selectedStyle',
      'scales',
      'rectClassName',
      'rectStyle',
      'type',
      'stacked',
      'grouped',
    ]);

    return (
      <g
        className={className && classNames(className)}
        clipPath={clipPathId && `url(#${clipPathId})`}
        style={this.combineStyles(style, data)}
      >
        {
          map(stacked ? stackedDataArray(data, xField, yField, otherField, dataField, xDomain) : data, (datum) => {
            const key = propResolver(datum, keyField);
            const values = propResolver(datum, dataField);
            const color = colorScale(colorField ? propResolver(datum, colorField) : key);
            // const barsValues = barsValueIteratee(values, key); //useless code?
            // console.log(barsValues);

            // Key should be from list of outer categories
            // const translate = outerOrdinal(key);

            return (
              <Bars
                className={barsClassName}
                data={datum}
                fill={color}
                key={`bars:${key}`}
                selection={this.castSelectionAsArray(selection)}
                style={barsStyle}
                categoryTranslate={0}
                ordinal={ordinal}
                linear={linear}
                {...childProps}
              />
            );
          })
        }
      </g>
    );
  }
}



MultiBars.propTypes = {
  /**
   * className applied to `<Bars />`'s outermost wrapping `<g>`.
   */
  barsClassName: CommonPropTypes.className,

  /**
   * inline styles applied to `<Bars />`'s outermost wrapping `<g>`.
   */
  barsStyle: CommonDefaultProps.style,

  /**
   * function to apply to the datum to transform bars values. default: _.identity
   * signature: (data, key) => {...}
   */
  barsValueIteratee: PropTypes.func,


  /**
   * className applied to outermost wrapping `<g>`.
   */
  className: CommonPropTypes.className,

  /**
   * If a clip path is applied to a container element (e.g., an `<AxisChart />`),
   * clip all children of `<MultiBars />` to that container by passing in the clip path URL id.
   */
  clipPathId: PropTypes.string,

  /**
   * If provided and `dataAccessors.fill` is undefined, determines the color of bars.
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
    x: CommonPropTypes.dataAccessor,
    y: CommonPropTypes.dataAccessor,
  }).isRequired,

  /**
   * Accessors for objects within `props.data`
   *   color: (optional) color data as input to color scale.
   *   data: data provided to child components. default: 'values'
   *   key: unique key to apply to child components. used as input to color scale if color field is not specified. default: 'key'
   */
  fieldAccessors: PropTypes.shape({
    color: CommonPropTypes.dataAccessor,
    data: CommonPropTypes.dataAccessor.isRequired,
    key: CommonPropTypes.dataAccessor.isRequired,
  }),

  /**
   * The datum object corresponding to the `<Bar />` currently focused.
   */
  focus: PropTypes.object,

  /**
   * className applied if `<Bar />` has focus.
   */
  focusedClassName: CommonPropTypes.className,

  /**
   * Inline styles applied to focused `<Bar />`.
   * If an object, spread into inline styles.
   * If a function, passed underlying datum corresponding to its `<Bar />`,
   * and return value is spread into inline styles;
   * signature: (datum) => obj
   */
  focusedStyle: CommonPropTypes.style,

  /**
   * Domain use for the innderOrdinal prop that scales the inner categorical data together.
   */
  innerDomain: PropTypes.array,

  /**
   * Inner ordinal scale for categorical data within a grouped bar chart.
   */
  innerOrdinal: PropTypes.func,

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
   * Orientation in which bars should be created.
   * Defaults to vertical, but option for horizontal orientation supported.
   */
  orientation: PropTypes.string,

  /**
   * `x` and `y` scales for positioning `<Bar />`s.
   * Object with keys: `x`, and `y`.
   */
  scales: PropTypes.shape({
    x: PropTypes.func,
    y: PropTypes.func,
  }),

  /**
   * className applied to `<Bar />`s if selected
   */
  selectedClassName: CommonPropTypes.className,

  /**
   * inline styles applied to selected `<Shape />`s.
   * If an object, spread into inline styles.
   * If a function, passed underlying datum corresponding to its `<Bar />`,
   * and return value is spread into inline styles;
   * signature: (datum) => obj
   */
  selectedStyle: CommonPropTypes.style,

  /**
   * Datum object or array of datum objects corresponding to selected `<Bar />`s
   */
  selection: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]),

  /**
   * inline style applied to outermost wrapping `<g>`
   */
  style: CommonPropTypes.style,

  /**
   * Type of bar chart to be created.
   * Default is a simple vertically oriented bar graph. Options for grouped and
   * stacked are also supported.
   */
  type: PropTypes.string,

};

MultiBars.defaultProps = {
  colorScale() {return 'steelblue'; },
  fieldAccessors: {
    data: 'values',
    key: 'key',
  },
  scales: {x: scaleBand(), y: scaleLinear() },
  innerOrdinal: scaleBand(),
  barsValueIteratee: CommonDefaultProps.identity, // get rid because don't readlly need
  orientation: 'vertical',
  type: 'default'
};

