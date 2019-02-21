import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import castArray from 'lodash/castArray';
import isUndefined from 'lodash/isUndefined';
import pick from 'lodash/pick';

import Bar from './bar';

import {
  adjustDomainScale,
  combineStyles,
  CommonPropTypes,
  computeDomainScale,
  computeRangeScale,
  computeStackDatumKey,
  computeStackMax,
  computeStackOffsets,
  isVertical,
  memoizeByLastCall,
  propResolver,
} from '../../../utils';

/**
 * `import { StackedBars } from 'ihme-ui'`
 */
export default class StackedBars extends React.PureComponent {
  constructor(props) {
    super(props);

    this.combineStyles = memoizeByLastCall(combineStyles);
    this.castSelectionAsArray = memoizeByLastCall((selection) => castArray(selection));
  }

  getDomainScale() {
    const {
      align,
      bandPadding,
      bandPaddingInner,
      bandPaddingOuter,
      categories: stacks,
      orientation,
      scales,
      height,
      width,
    } = this.props;

    const vertical = isVertical(orientation);
    const domainScale = (vertical ? scales.x : scales.y)
      || computeDomainScale(stacks, orientation, vertical ? width : height);

    // Adjust the domain scale based on alignment and padding.
    return adjustDomainScale(
      domainScale,
      align,
      !isUndefined(bandPaddingInner) ? bandPaddingInner : bandPadding,
      !isUndefined(bandPaddingOuter) ? bandPaddingOuter : bandPadding,
    );
  }

  getRangeScale() {
    const {
      categories: stacks,
      data,
      dataAccessors: {
        category: stackAccessor,
        value: valueAccessor,
      },
      orientation,
      rangeMax,
      scales,
      height,
      width,
    } = this.props;

    const vertical = isVertical(orientation);

    const scale = vertical ? scales.y : scales.x;
    if (scale) {
      return scale;
    }

    const max = !isUndefined(rangeMax)
      ? rangeMax
      : computeStackMax(data, stacks, stackAccessor, valueAccessor);

    return computeRangeScale(max, orientation, vertical ? height : width);
  }

  render() {
    const {
      categories: stacks,
      className,
      clipPathId,
      colorScale,
      data,
      dataAccessors: {
        fill: fillAccessor,
        category: stackAccessor,
        subcategory: layerAccessor,
        value: valueAccessor,
      },
      focus,
      orientation,
      rectClassName,
      rectStyle,
      selection,
      style,
      subcategories: layers,
    } = this.props;

    const childProps = pick(this.props, [
      'focusedClassName',
      'focusedStyle',
      'onClick',
      'onMouseLeave',
      'onMouseMove',
      'onMouseOver',
      'selectedClassName',
      'selectedStyle',
    ]);

    const vertical = isVertical(orientation);
    const domainScale = this.getDomainScale();
    const rangeScale = this.getRangeScale();
    const bandwidth = domainScale.bandwidth();

    // compute spatial offsets for each bar
    const offsetMap = computeStackOffsets(
      data,
      stacks,
      layers,
      stackAccessor,
      layerAccessor,
      valueAccessor,
    );

    return (
      <g
        className={className && classNames(className)}
        clipPath={clipPathId && `url(#${clipPathId})`}
        style={this.combineStyles(style, data)}
      >
        {data.map((datum) => {
          const stack = propResolver(datum, stackAccessor);
          const layer = propResolver(datum, layerAccessor);
          const key = computeStackDatumKey(stack, layer);
          const fillValue = propResolver(datum, fillAccessor);
          const [start, end] = offsetMap[key];

          /* eslint-disable no-multi-spaces */
          const x         = vertical ? domainScale(stack)    : rangeScale(start);
          const y         = vertical ? rangeScale(end)       : domainScale(stack);
          const barHeight = vertical ? rangeScale(start) - y : bandwidth;
          const barWidth  = vertical ? bandwidth             : rangeScale(end) - x;
          /* eslint-enable no-multi-spaces */

          return (
            <Bar
              className={rectClassName}
              key={key}
              datum={datum}
              x={x}
              y={y}
              height={barHeight}
              width={barWidth}
              fill={colorScale && isFinite(fillValue) && colorScale(fillValue)}
              focused={focus === datum}
              selected={selection.includes(datum)}
              style={rectStyle}
              {...childProps}
            />
          );
        })}
      </g>
    );
  }
}

StackedBars.propTypes = {
  /**
   * Ordinal scaleBand align property. Sets the alignment of `<Bars />`s to the to the
   * specified value which must be in the range [0, 1].
   * See https://github.com/d3/d3-scale/blob/master/README.md#scaleBand for reference.
   */
  align: PropTypes.number,

  /**
   * Ordinal scaleBand padding property. A convenience method for setting the inner and
   * outer padding of `<Bars />`s to the same padding value
   * See https://github.com/d3/d3-scale/blob/master/README.md#scaleBand for reference.
   */
  bandPadding: PropTypes.number,

  /**
   * Ordinal scaleBand paddingInner property. Sets the inner padding of `<Bars />`s to the
   * specified value which must be in the range [0, 1].
   * See https://github.com/d3/d3-scale/blob/master/README.md#scaleBand for reference.
   */
  bandPaddingInner: PropTypes.number,

  /**
   * Ordinal scaleBand paddingOuter property. Sets the outer padding of `<Bars />`s to the
   * specified value which must be in the range [0, 1].
   * See https://github.com/d3/d3-scale/blob/master/README.md#scaleBand for reference.
   */
  bandPaddingOuter: PropTypes.number,

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

  categories: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ])).isRequired,

  subcategories: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ])).isRequired,

  /**
   *  Pixel height of bar chart.
   */
  height: PropTypes.number,

  /**
   *  Pixel width of bar chart.
   */
  width: PropTypes.number,

  /**
   *  Array of objects, e.g. [ {location: 'USA',values: []}, {location: 'Canada', values: []} ].
   */
  data: PropTypes.arrayOf(PropTypes.object).isRequired,

  /**
   * Accessors on datum objects:
   *   fill              : property denoting fill color (will be passed to `props.colorScale`)
   *   category (req)    : property denoting category (the chart domain)
   *   subcategory (req) : property denoting layer (of a stack) or member (of a group)
   *   value:   (req)    : property denoting data value (the chart range)
   *
   * Each accessor can either be a string or function. If a string, it is assumed to be the name of a
   * property on datum objects; full paths to nested properties are supported (e.g., { `x`: 'values.year', ... }).
   * If a function, it is passed datum objects as its first and only argument.
   */
  dataAccessors: PropTypes.shape({
    fill: CommonPropTypes.dataAccessor,
    category: CommonPropTypes.dataAccessor,
    subcategory: CommonPropTypes.dataAccessor,
    value: CommonPropTypes.dataAccessor,
  }).isRequired,

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
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),

  /**
   * className applied to each `<Bar />`
   */
  rectClassName: CommonPropTypes.className,

  /**
   * Inline styles passed to each `<Bar />`
   */
  rectStyle: CommonPropTypes.style,

  /**
   * `x` and `y` scales for positioning `<Bar />`s.
   * Object with keys: `x`, and `y`.
   *
   * The `scales` prop is an optional low-level interface. It's designed to integrate with
   * AxisChart, which passes `scales` to its children.
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

  rangeMax: PropTypes.number,

  /**
   * inline style applied to outermost wrapping `<g>`
   */
  style: CommonPropTypes.style,
};

StackedBars.defaultProps = {
  bandPadding: 0.05,
  colorScale: () => 'steelblue',
  orientation: 'vertical',
};
