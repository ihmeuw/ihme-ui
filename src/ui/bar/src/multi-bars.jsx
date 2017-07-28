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
      className,
      clipPathId,
      colorScale,
      data,
      dataAccessors,
      fieldAccessors,
      height,
      layerDomain,
      layerOrdinal,
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
      key: keyIterator,
      layer: layerField,
      value: valueField,
      stack: stackField,
    } = dataAccessors;

    const {
      color: colorField,
      data: dataField,
      key: keyField
    } = fieldAccessors;


    // Sets these constants to the correct scales based on whether the orientation
    // is default at vertical. (i.e. having  x axis contains the bands and y axis be
    // linear, vice versa)
    // const ordinal = (isVertical(orientation) ? scales.x : scales.y);
    // const linear = (isVertical(orientation) ? scales.y : scales.x);

    const outerOrdinal = (isVertical(orientation) ? scales.x : scales.y);

    const plotData = stacked ? stackedDataArray(data, layerField, valueField, stackField, dataField, xDomain) : data;

    console.log(Object.prototype.hasOwnProperty.call(this.props, 'stacked'));


    if (stacked) {
      const stackedDomain = [0, max(plotData, (data) => { return max(data, (d) => { return d[1]; }); })];
      const linear = (isVertical(orientation) ? scales.y : scales.x);
      linear.domain(stackedDomain);

    } else { // grouped bar chart type
      const ordinal = (isVertical(orientation) ? scales.x : scales.y);
      layerOrdinal.domain(layerDomain).range([0, ordinal.bandwidth()]);

      // update y domain
      // scales.y.domain
    }

    const childProps = pick(this.props, [
      'colorScale',
      'dataAccessors',
      'focus',
      'focusedClassName',
      'focusedStyle',
      'height',
      'layerOrdinal',
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
          map(plotData, (datum) => {
            const key = propResolver(datum, keyField);

            // need to account for two types of data set since can be grouped or stacked
            // change values or get rid since not really needed.
            const values = stacked ? datum : propResolver(datum, dataField);

            // need to account for te fact that data may be laid out differently between stacked
            // vs bar chart

            const color = colorScale(colorField ? propResolver(datum, colorField) : key);
            // const barsValues = barsValueIteratee(values, key); //useless code?
            // console.log(barsValues);

            // Key should be from list of outer categories
            const translate = outerOrdinal(key);

            return (
              <Bars
                className={barsClassName}
                data={values}
                fill={color}
                key={`bars:${key}`}
                selection={this.castSelectionAsArray(selection)}
                style={barsStyle}
                categoryTranslate={translate}
                // ordinal={ordinal}
                // linear={linear}
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
   * Domain use for the innderOrdinal prop that scales the layer categorical data together.
   */
  layerDomain: PropTypes.array,

  /**
   * Inner ordinal scale for categorical data within a grouped bar chart.
   */
  layerOrdinal: PropTypes.func,

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
  layerOrdinal: scaleBand(),
  orientation: 'vertical',
  type: 'default'
};

