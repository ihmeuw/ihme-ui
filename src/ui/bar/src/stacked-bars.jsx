import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import pick from 'lodash/pick';

import * as util from '../../../utils';

import Bar from './bar';
import commonProps from './commonProps';

/**
 * `import { StackedBars } from 'ihme-ui'`
 *
 * Creates the bars for a stacked bar chart.
 * Each category represents a stack, and each subcategory represents a layer in each stack.
 */
export default class StackedBars extends React.PureComponent {
  constructor(props) {
    super(props);

    this.combineStyles = util.memoizeByLastCall(util.combineStyles);
    this.computeStackOffsets = util.memoizeByLastCall(util.computeStackOffsets);
  }

  render() {
    const {
      categories: stacks,
      className,
      clipPathId,
      data,
      dataAccessors: {
        category: stackAccessor,
        subcategory: layerAccessor,
        value: valueAccessor,
      },
      fill,
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

    const vertical = util.isVertical(orientation);
    const domainScale = util.getDomainScale(this.props);
    const rangeScale = util.getRangeScale({ ...this.props, stacked: true });
    const bandwidth = domainScale.bandwidth();

    // compute spatial offset for each bar
    const offsetMap = this.computeStackOffsets(
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
          const stack = util.propResolver(datum, stackAccessor);
          const layer = util.propResolver(datum, layerAccessor);
          const value = util.propResolver(datum, valueAccessor);
          const key = util.computeStackDatumKey(stack, layer);
          const start = offsetMap[key];
          const end = start + value;

          /* eslint-disable no-multi-spaces */
          const x         = vertical ? domainScale(stack)    : rangeScale(start);
          const y         = vertical ? rangeScale(end)       : domainScale(stack);
          const barHeight = vertical ? rangeScale(start) - y : bandwidth;
          const barWidth  = vertical ? bandwidth             : rangeScale(end) - x;
          /* eslint-enable no-multi-spaces */

          return (
            <Bar
              key={key}
              datum={datum}
              x={x}
              y={y}
              height={barHeight}
              width={barWidth}
              fill={typeof fill === 'function' ? fill(datum) : fill}
              className={rectClassName}
              style={rectStyle}
              focused={focus === datum}
              selected={util.isInSelection(datum, selection)}
              {...childProps}
            />
          );
        })}
      </g>
    );
  }
}

const {
  CommonDefaultProps,
  CommonPropTypes,
} = util;

StackedBars.propTypes = {
  ...commonProps,

   /**
   * Accessors on datum objects:
   *   category: used to determine the bar's stack (to plot it on the chart domain)
   *   subcategory: used to determine the bar's layer within its stack
   *   value: used to obtain the bar's data value (to plot it on the chart range)
   *
   * Each accessor can either be a string or function.
   * If a string, it is assumed to be the name of a property on datum objects; full paths to nested
   * properties are supported (e.g. `{ x: 'values.year', ... }`).
   * If a function, it is passed the datum as its first and only argument.
   */
  dataAccessors: PropTypes.shape({
    category: CommonPropTypes.dataAccessor.isRequired,
    subcategory: CommonPropTypes.dataAccessor.isRequired,
    value: CommonPropTypes.dataAccessor.isRequired,
  }).isRequired,

  /**
   * List of subcategory names used in the bar chart.
   * In a stacked bar chart, each stack contains a layer for each subcategory.
   */
  subcategories: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ])).isRequired,
};

StackedBars.defaultProps = {
  align: 0.5,
  bandPadding: 0.05,
  onClick: CommonDefaultProps.noop,
  onMouseLeave: CommonDefaultProps.noop,
  onMouseMove: CommonDefaultProps.noop,
  onMouseOver: CommonDefaultProps.noop,
  orientation: 'vertical',
};
