import PropTypes from 'prop-types';

import { CommonPropTypes } from '../../../utils';

/**
 * common prop types for Bars, GroupedBars, and StackedBars
 */
export default {
  /**
   * Alignment of each bar within its band. If there is any padding between bars, this property
   * specifies how that space will be allocated. The value must be in the range [0, 1], where:
   * - 0 represents left alignment
   * - 0.5 represents center alignment
   * - 1 represents right alignment
   *
   * See: https://github.com/d3/d3-scale/blob/master/README.md#band_align
   */
  align: PropTypes.number,

  /**
   * A convenience for setting the `bandPaddingInner` and `bandPaddingOuter` to the same value.
   *
   * See: https://github.com/d3/d3-scale/blob/master/README.md#band_padding
   */
  bandPadding: PropTypes.number,

  /**
   * Padding between bars, specified as a proportion of the band width (i.e. the space allocated
   * for each bar). The value must be in the range [0, 1], where:
   * - 0 represents no padding between bars
   * - 0.5 represents padding of the same width as the bars
   * - 1 represents all padding, giving bars a width of 0 (probably not very useful)
   *
   * See: https://github.com/d3/d3-scale/blob/master/README.md#band_paddingInner
   */
  bandPaddingInner: PropTypes.number,

  /**
   * Padding before the first bar and after the last bar, specified as a proportion (or multiple)
   * of the band width (i.e. the space allocated for each bar).
   *
   * See: https://github.com/d3/d3-scale/blob/master/README.md#band_paddingOuter
   */
  bandPaddingOuter: PropTypes.number,

  /**
   * List of category names used in the bar chart. Categories are arrayed across the domain.
   * For a normal bar chart, each category is represented by a single bar.
   * For stacked bars, each category is represented by a single stack.
   * For grouped bars, each category is represented by a single group.
   */
  categories: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ])).isRequired,

  /**
   * className applied to outermost wrapping `<g>`
   */
  className: CommonPropTypes.className,

  /**
   * If a clip path is applied to a container element, clip all children to that container by
   * passing in the clip path URL id.
   */
  clipPathId: PropTypes.string,

  /**
   * If `colorScale` and `dataAccessors.fill` are both provided, they will be used to determine
   * the fill color for each bar as follows:
   * (1) `dataAccessors.fill` will be used to obtain some value from the `datum`.
   * (2) The `colorScale` function will be called with this value and should return a string
   * representing the color (e.g. in hex, rgb, or rgba format).
   *
   * If these props are not provided, `fill` will be used for the fill color instead.
   */
  colorScale: PropTypes.func,

  /**
   * Array of datum objects. A datum object can be just about anything. The only restriction is
   * that it must be possible to obtain the category and value (and, for grouped or stacked bar
   * charts, the subcategory) of each datum using the `dataAccessors`.
   */
  data: PropTypes.arrayOf(PropTypes.object).isRequired,

  /**
   * If `colorScale` and `dataAccessors.fill` are not provided, each bar will get this same fill
   * value.
   */
  fill: PropTypes.string,

  /**
   * the datum object corresponding to the `<Bar />` currently focused
   */
  focus: PropTypes.object,

  /**
   * className applied if `<Bar />` has focus
   */
  focusedClassName: CommonPropTypes.className,

  /**
   * inline styles applied to focused `<Bar />`
   * If an object, spread into inline styles. If a function, passed underlying datum corresponding
   * to its `<Bar />`, and return value is spread into inline styles.
   * signature: (datum) => obj
   */
  focusedStyle: CommonPropTypes.style,

  /**
   *  height, in pixels, of bar chart
   */
  height: PropTypes.number.isRequired,

  /**
   *  width, in pixels, of bar chart
   */
  width: PropTypes.number.isRequired,

  /**
   * onClick callback applied to each `<Bar />`.
   * signature: (SyntheticEvent, datum, instance) => {...}
   */
  onClick: PropTypes.func,

  /**
   * onMouseLeave callback applied to each `<Bar />`.
   * signature: (SyntheticEvent, datum, instance) => {...}
   */
  onMouseLeave: PropTypes.func,

  /**
   * onMouseMove callback applied to each `<Bar />`.
   * signature: (SyntheticEvent, datum, instance) => {...}
   */
  onMouseMove: PropTypes.func,

  /**
   * onMouseOver callback applied to each `<Bar />`.
   * signature: (SyntheticEvent, datum, instance) => {...}
   */
  onMouseOver: PropTypes.func,

  /**
   * orientation of bar chart, representing the direction in which bars extend from the domain axis
   */
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),

  /**
   * maximum value (on the range axis) the chart needs to support
   * If not provided, it will be computed from the data.
   */
  rangeMax: PropTypes.number,

  /**
   * className applied to each `<Bar />`
   */
  rectClassName: CommonPropTypes.className,

  /**
   * inline styles passed to each `<Bar />`
   */
  rectStyle: CommonPropTypes.style,

  /**
   * Object with keys: `x`, and `y`, representing D3 scaling functions used for positioning
   * `<Bar />`s. The domain axis is assumed to use a band scale, the range axis a linear scale.
   *
   * See:
   * - https://github.com/d3/d3-scale/blob/master/README.md#band-scales
   * - https://github.com/d3/d3-scale/blob/master/README.md#linear-scales
   *
   * `scales` is an optional low-level interface designed to integrate with AxisChart, which passes
   * this prop to its children. If not provided, appropriate scaling functions will be computed
   * based on the `data` and the chart `height` and `width`.
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
   * datum object or array of datum objects corresponding to selected `<Bar />`s
   */
  selection: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]),

  /**
   * inline styles applied to wrapping `<g>` element
   */
  style: CommonPropTypes.style,
};
