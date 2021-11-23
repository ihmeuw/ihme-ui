import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
  axisBottom,
  axisLeft,
  axisRight,
  axisTop,
  scaleLinear,
  select,
} from 'd3';
import {
  assign,
  mean,
  reduce,
  trim,
} from 'lodash';

import {
  calcLabelPosition,
  calcAxisTranslate,
  CommonPropTypes,
  propsChanged,
  stateFromPropUpdates,
  camelToKebabCase,
} from '../../../utils';

import styles from './axis.css';

export const AXIS_TYPES = {
  top: axisTop,
  right: axisRight,
  bottom: axisBottom,
  left: axisLeft,
};

/**
 * `import { Axis } from 'ihme-ui'`
 */
export default class Axis extends React.PureComponent {
  static concatStyle(style) {
    return trim(reduce(
      style,
      (accum, value, attr) => `${accum} ${camelToKebabCase(attr)}: ${value};`,
      ''
    ));
  }

  constructor(props) {
    super(props);
    this.state = stateFromPropUpdates(Axis.propUpdates, {}, props, {});

    this.storeRef = this.storeRef.bind(this);
  }

  componentDidMount() {
    this.drawAxis();
  }

  componentWillReceiveProps(nextProps) {
    this.setState(stateFromPropUpdates(Axis.propUpdates, this.props, nextProps, {}));
  }

  componentDidUpdate() {
    this.drawAxis();
  }

  componentWillUnmount() {
    this._axisSelection.remove();
  }

  drawAxis() {
    const {
      className,
      legendAriaHideTickMarks,
      orientation,
      rotateTickLabels,
      scale,
      style,
      tickArguments,
      ticks,
      tickFormat,
      tickSize,
      tickSizeInner,
      tickSizeOuter,
      tickPadding,
      tickValues,
    } = this.props;

    const {
      translate,
    } = this.state;

    if (!this._axisSelection) {
      throw new Error();
    }

    const axis = AXIS_TYPES[orientation](scale);

    axis.tickSize(tickSize); // default is 6px
    axis.tickPadding(tickPadding); // default is 3px
    if (ticks) axis.ticks(ticks);
    if (tickArguments) axis.tickArguments(tickArguments);
    if (tickFormat) axis.tickFormat(tickFormat);
    if (tickSizeInner) axis.tickSizeInner(tickSizeInner);
    if (tickSizeOuter) axis.tickSizeOuter(tickSizeOuter);
    if (tickValues) axis.tickValues(tickValues);

    this._axisSelection
      .attr('aria-hidden', `${legendAriaHideTickMarks}`)
      .attr('class', classNames(styles.common, className))
      .attr('transform', `translate(${translate.x}, ${translate.y})`)
      .attr('style', Axis.concatStyle(style))
      .call(axis);

    if (orientation === 'bottom') {
      // eslint-disable-next-line no-unused-expressions
      rotateTickLabels
        ? this._axisSelection
          .selectAll('text')
          .style('text-anchor', 'end')
          .attr('dx', '-0.8em')
          .attr('dy', '0.15em')
          .attr('transform', 'rotate(-45)')
        : this._axisSelection
          .selectAll('text')
          .style('text-anchor', 'middle')
          .attr('dx', '0')
          .attr('dy', '0.71em')
          .attr('transform', 'rotate(0)');
    } else if (orientation === 'top') {
      // eslint-disable-next-line no-unused-expressions
      rotateTickLabels
        ? this._axisSelection
          .selectAll('text')
          .style('text-anchor', 'end')
          .attr('dx', '-0.65em')
          .attr('dy', '0.45em')
          .attr('transform', 'rotate(45)')
        : this._axisSelection
          .selectAll('text')
          .style('text-anchor', 'middle')
          .attr('dx', '0')
          .attr('dy', '0')
          .attr('transform', 'rotate(0)');
    }
  }

  storeRef(axisG) {
    if (!axisG) {
      this._axisSelection = null;
      return;
    }

    this._axisSelection = select(axisG);
  }

  render() {
    const {
      label,
      labelClassName,
      labelStyle,
      orientation,
      padding,
      scale,
    } = this.props;

    const {
      translate,
    } = this.state;

    const labelPosition = label &&
      calcLabelPosition(orientation, translate, padding, mean(scale.range()));

    return (
      <g>
        <g ref={this.storeRef}></g>
        {label &&
          <text
            className={labelClassName}
            style={labelStyle}
            x={labelPosition.x}
            y={labelPosition.y}
            dx={labelPosition.dX}
            dy={labelPosition.dY}
            transform={`rotate(${labelPosition.rotate || 0})`}
            textAnchor="middle"
          >
            {label}
          </text>
        }
      </g>
    );
  }
}

export const AXIS_SCALE_PROP_TYPES = {
  scale: PropTypes.func.isRequired,
};

export const HEIGHT_PROP_TYPES = {
  height: PropTypes.number.isRequired,
  translate: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }).isRequired,
};

export const WIDTH_PROP_TYPES = {
  translate: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }).isRequired,
  width: PropTypes.number.isRequired,
};

Axis.propTypes = {

  /**
   * className applied to outermost group element
   */
  className: CommonPropTypes.className,

  /**
   * height of charting area, minus padding
   * required if translate is not provided
   */
  height: PropTypes.number,

  /**
   * the axis label
   */
  label: PropTypes.string,

  /**
   * className applied to text element surrounding axis label
   */
  labelClassName: CommonPropTypes.className,

  /**
   * inline styles applied to text element surrounding axis label
   */
  labelStyle: PropTypes.object,
  legendAriaHideTickMarks: PropTypes.bool,

  /**
   * where to position axis line; will position ticks accordingly
   * one of: "top", "right", "bottom", "left"
   */
  orientation: PropTypes.oneOf(Object.keys(AXIS_TYPES)).isRequired,

  /**
   * used to position label
   * keys: 'top', 'bottom', 'left', 'right'
   */
  padding: PropTypes.shape({
    top: PropTypes.number,
    bottom: PropTypes.number,
    left: PropTypes.number,
    right: PropTypes.number,
  }),

  /**
   *  whether to rotate top/bottom axis tick labels 45 deg
   */
  rotateTickLabels: PropTypes.bool,

  /**
   *  appropriate scale for axis
   */
  scale: PropTypes.func,

  /**
   * inline styles to apply to outermost group element
   */
  style: PropTypes.object,

  /**
   * [number of axis ticks use](https://github.com/d3/d3-axis#axis_ticks)
   */
  ticks: PropTypes.number,

  /**
   * [alternative to tickValues and/or tickFormat](https://github.com/d3/d3-axis#axis_tickArguments)
   */
  tickArguments: PropTypes.array,

  /**
   * [format of axis ticks](https://github.com/d3/d3-axis#axis_tickFormat)
   */
  tickFormat: PropTypes.func,

  /**
   * [padding of axis ticks](https://github.com/d3/d3-axis#axis_tickPadding)
   */
  tickPadding: PropTypes.number,

  /**
   * [size of both inner and outer tick lines](https://github.com/d3/d3-axis#axis_tickSize)
   */
  tickSize: PropTypes.number,

  /**
   * [size of inner tick lines](https://github.com/d3/d3-axis#axis_tickSizeInner)
   */
  tickSizeInner: PropTypes.number,

  /**
   * [size of outer tick lines](https://github.com/d3/d3-axis#axis_tickSizeOuter)
   */
  tickSizeOuter: PropTypes.number,

  /**
   * [user-specified tick values](https://github.com/d3/d3-axis#axis_tickValues)
   */
  tickValues: PropTypes.array,

  /**
   * push axis in x or y direction
   * keys: 'x' (required), 'y' (required)
   * required if width and height are not provided
   */
  translate: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }),

  /**
   * width of charting area, minus padding
   * required if translate is not specified
  */
  width: PropTypes.number,
};

Axis.defaultProps = {
  height: 30,
  legendAriaHideTickMarks: true,
  padding: {
    top: 40,
    bottom: 40,
    left: 50,
    right: 50,
  },
  rotateTickLabels: false,
  scale: scaleLinear(),
  width: 900,
};

Axis.propUpdates = {
  translate: (accum, propName, prevProps, nextProps) => {
    if (!propsChanged(prevProps, nextProps, ['orientation', 'width', 'height', 'translate'])) {
      return accum;
    }

    return assign({}, accum, {
      translate: nextProps.translate
      || calcAxisTranslate(nextProps.orientation, nextProps.width, nextProps.height)
    });
  },
};
