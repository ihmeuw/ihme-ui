import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import pick from 'lodash/pick';

import * as util from '../../../utils';

import Bar from './bar';
import commonProps from './commonProps';

/**
 * `import { Bars } from 'ihme-ui'`
 *
 * Creates the bars for a conventional bar chart (i.e. one bar for each category)
 */
export default class Bars extends React.PureComponent {
  constructor(props) {
    super(props);

    this.combineStyles = util.memoizeByLastCall(util.combineStyles);
  }

  render() {
    const {
      className,
      clipPathId,
      colorScale,
      data,
      dataAccessors,
      fill,
      focus,
      height,
      orientation,
      rectClassName,
      rectStyle,
      selection,
      style,
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
    const rangeScale = util.getRangeScale(this.props);
    const bandwidth = domainScale.bandwidth();

    return (
      <g
        className={className && classNames(className)}
        clipPath={clipPathId && `url(#${clipPathId})`}
        style={this.combineStyles(style, data)}
      >
        {data.map((datum) => {
          const fillValue =
            colorScale && dataAccessors.fill
            ? colorScale(util.propResolver(datum, dataAccessors.fill))
            : fill;
          const category = util.propResolver(datum, dataAccessors.category);
          const value = util.propResolver(datum, dataAccessors.value);

          /* eslint-disable no-multi-spaces */
          const x         = vertical ? domainScale(category) : 0;
          const y         = vertical ? rangeScale(value)     : domainScale(category);
          const barHeight = vertical ? height - y            : bandwidth;
          const barWidth  = vertical ? bandwidth             : rangeScale(value);
          /* eslint-enable no-multi-space */

          return (
            <Bar
              className={rectClassName}
              key={category}
              datum={datum}
              x={x}
              y={y}
              height={barHeight}
              width={barWidth}
              fill={fillValue}
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

const {
  CommonDefaultProps,
  CommonPropTypes,
} = util;

Bars.propTypes = {
  ...commonProps,

  /**
   * Accessors on datum objects:
   *   fill: used to compute the bar's fill color (the result will be passed to `props.colorScale`)
   *   category (req): used to determine the bar's category (to plot it on the chart domain)
   *   value (req): used to obtain the bar's data value (to plot it on the chart range)
   *
   * Each accessor can either be a string or function.
   * If a string, it is assumed to be the name of a property on datum objects; full paths to nested
   * properties are supported (e.g. `{ x: 'values.year', ... }`).
   * If a function, it is passed the datum as its first and only argument.
   */
  dataAccessors: PropTypes.shape({
    fill: CommonPropTypes.dataAccessor,
    category: CommonPropTypes.dataAccessor.isRequired,
    value: CommonPropTypes.dataAccessor.isRequired,
  }).isRequired,
};

Bars.defaultProps = {
  bandPadding: 0.05,
  fill: 'steelblue',
  onClick: CommonDefaultProps.noop,
  onMouseLeave: CommonDefaultProps.noop,
  onMouseMove: CommonDefaultProps.noop,
  onMouseOver: CommonDefaultProps.noop,
  orientation: 'vertical',
};
