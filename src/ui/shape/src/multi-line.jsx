import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { scaleLinear } from 'd3';
import { map, pick } from 'lodash';

import Line from './line';
import Area from './area';
import {
  AnimateEvents, AnimateProp, AnimateTiming,
  CommonDefaultProps,
  CommonPropTypes,
  propResolver,
} from '../../../utils';

/**
 * `import { MultiLine } from 'ihme-ui'`
 *
 * This is a convenience component intended to make it easier to render many `<Line />`s
 * on a single chart. It additionally supports rendering `<Area />`s when the proper `dataAccessors`
 * are provided, which can be helpful, for example, for showing uncertainty around an estimate represented
 * by a line.
 */
export default class MultiLine extends React.PureComponent {
  render() {
    const {
      areaClassName,
      areaStyle,
      areaValuesIteratee,
      className,
      clipPathId,
      colorScale,
      data,
      dataAccessors,
      fieldAccessors,
      lineClassName,
      lineStyle,
      lineValuesIteratee,
      scales,
      style,
    } = this.props;

    const {
      color: colorField,
      data: dataField,
      key: keyField,
    } = fieldAccessors;

    const childProps = pick(this.props, [
      'animate',
      'onClick',
      'onMouseLeave',
      'onMouseMove',
      'onMouseOver',
    ]);

    return (
      <g
        className={className && classNames(className)}
        clipPath={clipPathId && `url(#${clipPathId})`}
        style={style}
      >
        {
          map(data, (datum) => {
            const key = propResolver(datum, keyField);
            const values = propResolver(datum, dataField);
            const color = colorScale(colorField ? propResolver(datum, colorField) : key);

            const areaValues = areaValuesIteratee(values, key);
            const lineValues = lineValuesIteratee(values, key);

            const computedAreaStyle = typeof areaStyle === 'function'
              ? areaStyle(areaValues, key)
              : areaStyle;
            const computedLineStyle = typeof lineStyle === 'function'
              ? lineStyle(lineValues, key)
              : lineStyle;

            return (
              [
                (!!dataAccessors.x && !!dataAccessors.y0 && !!dataAccessors.y1 && !!areaValues) ?
                  <Area
                    className={areaClassName}
                    dataAccessors={dataAccessors}
                    data={areaValues}
                    key={`area:${key}`}
                    scales={scales}
                    style={{
                      fill: color,
                      stroke: color,
                      ...computedAreaStyle,
                    }}
                    {...childProps}
                  /> : null,
                (!!dataAccessors.x && !!dataAccessors.y && !!lineValues) ?
                  <Line
                    className={lineClassName}
                    dataAccessors={dataAccessors}
                    data={lineValues}
                    key={`line:${key}`}
                    scales={scales}
                    style={{
                      stroke: color,
                      ...computedLineStyle,
                    }}
                    {...childProps}
                  /> : null,
              ]
            );
          })
        }
      </g>
    );
  }
}

MultiLine.propTypes = {
  /**
   * Whether to animate the scatter component (using default `start`, `update` functions).
   * Optionally, an object that provides functions that dictate behavior of animations.
   */
  animate: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape({
      d: AnimateProp,
      events: AnimateEvents,
      fill: AnimateProp,
      stroke: AnimateProp,
      strokeWidth: AnimateProp,
      timing: AnimateTiming,
    }),
  ]),

  /**
   * classname applied to `<Area/>`s that are children of MultiLine, if applicable
   */
  areaClassName: CommonPropTypes.className,

  /**
   * inline styles applied to `<Area />`s, if applicable
   */
  areaStyle: CommonPropTypes.style,

  /**
   * Applied to the data to transform area values. default: _.identity
   * signature: (data, key) => {...}
   */
  areaValuesIteratee: PropTypes.func,

  /**
   * className applied to outermost wrapping `<g>`
   */
  className: CommonPropTypes.className,

  /**
   * If a clip path is applied to a container element (e.g., an `<AxisChart />`),
   * clip all children of `<MultiLine />` to that container by passing in the clip path URL id.
   */
  clipPathId: PropTypes.string,

  /**
   * Function that accepts keyfield and returns stroke color for line.
   * signature: (key) => str
   */
  colorScale: PropTypes.func,

  /**
   *  Array of objects, e.g. [ {location: 'USA',values: []}, {location: 'Canada', values: []} ].
   */
  data: PropTypes.arrayOf(PropTypes.object),

  /**
   * Keys on datum objects containing values to scale to chart
   *   x: accessor for xscale
   *   y: accessor for yscale (when applicable, e.g. <Line />)
   *   y0: accessor for yscale (when applicable; e.g., lower bound)
   *   y1: accessor for yscale (when applicable; e.g., upper bound)
   *
   * To render `<Line />`s, include just x, y.
   * To render `<Area />`s, include just x, y0, y1.
   * To render `<Line />`s and `<Area />`s, include all four properties.
   *
   * Each accessor can either be a string or function. If a string, it is assumed to be the name of a
   * property on datum objects; full paths to nested properties are supported (e.g., { `x`: 'values.year', ... }).
   * If a function, it is passed datum objects as its first and only argument.
   */
  dataAccessors: PropTypes.oneOfType([
    PropTypes.shape({
      x: CommonPropTypes.dataAccessor.isRequired,
      y: CommonPropTypes.dataAccessor.isRequired,
    }),
    PropTypes.shape({
      x: CommonPropTypes.dataAccessor.isRequired,
      y0: CommonPropTypes.dataAccessor.isRequired,
      y1: CommonPropTypes.dataAccessor.isRequired,
    }),
    PropTypes.shape({
      x: CommonPropTypes.dataAccessor.isRequired,
      y: CommonPropTypes.dataAccessor.isRequired,
      y0: CommonPropTypes.dataAccessor.isRequired,
      y1: CommonPropTypes.dataAccessor.isRequired,
    }),
  ]).isRequired,

  /**
   * Accessors for objects within `props.data`
   *  color: (optional) color data as input to color scale.
   *  data: data provided to child components. default: 'values'
   *  key: unique key to apply to child components. used as input to color scale if color field is not specified. default: 'key'
   *
   *  For example:
   *  IF (`props.data` === [ {location: 'USA',values: [{...}, {...}]}, {location: 'Canada', values: [{...}, {...}]} ])
   *  THEN `fieldAccessors` === { data: 'values', key: 'location' }
   */
  fieldAccessors: PropTypes.shape({
    color: CommonPropTypes.dataAccessor,
    data: CommonPropTypes.dataAccessor.isRequired,
    key: CommonPropTypes.dataAccessor.isRequired,
  }),

  /**
   * classname applied to `<Line />`s, if applicable
   */
  lineClassName: CommonPropTypes.className,

  /**
   * inline styles applied to `<Line />`s, if applicable
   */
  lineStyle: CommonPropTypes.style,

  /**
   * function to apply to the data to transform area values. default: _.identity
   * signature: (data, key) => {...}
   */
  lineValuesIteratee: PropTypes.func,

  /**
   * onClick callback.
   * signature: (SyntheticEvent, data, instance) => {...}
   */
  onClick: PropTypes.func,

  /**
   * onMouseLeave callback.
   * signature: (SyntheticEvent, data, instance) => {...}
   */
  onMouseLeave: PropTypes.func,

  /**
   * onMouseMove callback.
   * signature: (SyntheticEvent, data, instance) => {...}
   */
  onMouseMove: PropTypes.func,

  /**
   * onMouseOver callback.
   * signature: (SyntheticEvent, data, instance) => {...}
   */
  onMouseOver: PropTypes.func,

  /**
   * `x` and `y` scales.
   * Object with keys: `x`, and `y`.
   */
  scales: PropTypes.shape({
    x: PropTypes.func,
    y: PropTypes.func,
  }).isRequired,

  /**
   * inline style applied to outermost wrapping `<g>`
   */
  style: CommonPropTypes.style,
};

MultiLine.defaultProps = {
  areaValuesIteratee: CommonDefaultProps.identity,
  colorScale() { return 'steelblue'; },
  fieldAccessors: {
    data: 'values',
    key: 'key',
  },
  lineValuesIteratee: CommonDefaultProps.identity,
  scales: { x: scaleLinear(), y: scaleLinear() },
};

MultiLine.animatable = [
  'd',
  'fill',
  'stroke',
  'strokeWidth',
];
