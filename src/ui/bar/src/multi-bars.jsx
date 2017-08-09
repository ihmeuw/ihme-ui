import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { scaleLinear, scaleBand, max } from 'd3';
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
      layerDomain,
      layerOrdinal,
      orientation,
      scales,
      selection,
      style,
      stacked,
      grouped,
    } = this.props;

    const {
      layer: layerField,
      value: valueField,
      stack: stackField,
    } = dataAccessors;

    const {
      color: colorField,
      data: dataField,
      key: keyField
    } = fieldAccessors;

    // If stacked bar chart, the data must be transformed using d3.stack() function.
    const plotData = stacked ? stackedDataArray(data, layerField, valueField, stackField, dataField,layerDomain) : data;

    // Updates specific domains for each type of bar chart
    if (stacked) {
      const stackedDomain = [0, max(plotData, (data) => { return max(data, (d) => { return d[1]; }); })];
      const linear = (isVertical(orientation) ? scales.y : scales.x);
      linear.domain(stackedDomain);
    } else {
      const ordinal = (isVertical(orientation) ? scales.x : scales.y);
      layerOrdinal.domain(layerDomain).range([0, ordinal.bandwidth()]);
    }

    const childProps = pick(this.props, [
      'colorScale',
      'dataAccessors',
      'focus',
      'focusedClassName',
      'focusedStyle',
      'height',
      'layerOrdinal',
      'layerDomain',
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
          map(plotData, (datum) => { // change to data
            const key = propResolver(datum, keyField);
            const values = stacked ? datum : propResolver(datum, dataField);
            const color = colorScale(colorField ? propResolver(datum, colorField) : key);
            const outerOrdinal = (isVertical(orientation) ? scales.x : scales.y);
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
   *   stack: property on datum to position bars svg element rect in x-direction
   *   value: property on datum to position bars svg element rect in y-direction
   *   layer: property on datum to position bars svg element rect in categorical format. (grouped/stacked)
   *
   * Each accessor can either be a string or function. If a string, it is assumed to be the name of a
   * property on datum objects; full paths to nested properties are supported (e.g., { `x`: 'values.year', ... }).
   * If a function, it is passed datum objects as its first and only argument.
   */
  dataAccessors: PropTypes.shape({
    fill: CommonPropTypes.dataAccessor,
    key: CommonPropTypes.dataAccessor.isRequired,
    stack: CommonPropTypes.dataAccessor,
    value: CommonPropTypes.dataAccessor,
    layer: CommonPropTypes.dataAccessor,
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
   * Domain use for the layerOrdinal prop that scales the layer categorical data together.
   */
  layerDomain: PropTypes.array,

  /**
   * Layer ordinal scale for categorical data within a grouped/stacked bar chart.
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
   * inline styles applied to selected `<Bar />`s.
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

