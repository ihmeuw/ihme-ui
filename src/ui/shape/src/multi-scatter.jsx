import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { castArray, map, pick } from 'lodash';
import Scatter from './scatter';

import { propResolver, PureComponent, CommonDefaultProps, CommonPropTypes } from '../../../utils';

/**
 * `import { MultiScatter } from 'ihme-ui/ui/shape'`
 *
 * This is a convenience component intended to make it easier to render many `<Scatter />`s on a single chart.
 */
export default class MultiScatter extends PureComponent {
  render() {
    const {
      className,
      clipPathId,
      colorScale,
      data,
      fieldAccessors,
      scatterClassName,
      scatterValuesIteratee,
      selection,
      style,
      symbolScale,
      symbolStyle,
    } = this.props;

    const {
      color: colorField,
      data: dataField,
      key: keyField,
      symbol: symbolField,
    } = fieldAccessors;

    const childProps = pick(this.props, [
      'colorScale',
      'dataAccessors',
      'focus',
      'focusedClassName',
      'focusedStyle',
      'onClick',
      'onMouseLeave',
      'onMouseMove',
      'onMouseOver',
      'selectedClassName',
      'selectedStyle',
      'scales',
      'size',
      'symbolClassName',
      'symbolScale',
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

            const symbolType = symbolField && symbolScale(propResolver(datum, symbolField));

            const scatterValues = scatterValuesIteratee(values, key);

            return !!scatterValues ? (
              <Scatter
                className={scatterClassName}
                data={scatterValues}
                fill={color}
                key={`scatter:${key}`}
                selection={castArray(selection)}
                style={symbolStyle}
                symbolType={symbolType}
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
   * className applied to outermost wrapping `<g>`.
   */
  className: CommonPropTypes.className,

  /**
   * If a clip path is applied to a container element (e.g., an `<AxisChart />`),
   * clip all children of `<MultiScatter />` to that container by passing in the clip path URL id.
   */
  clipPathId: PropTypes.string,

  /**
   * If provided and `dataAccessors.fill` is undefined,
   * determines the color of scatter symbols.
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
   *   symbol: property on datum used to determine which type of symbol to render (will be passed to `props.symbolScale`)
   *   x: property on datum to position scatter symbols in x-direction
   *   y: property on datum to position scatter symbols in y-direction
   *
   * Each accessor can either be a string or function. If a string, it is assumed to be the name of a
   * property on datum objects; full paths to nested properties are supported (e.g., { `x`: 'values.year', ... }).
   * If a function, it is passed datum objects as its first and only argument.
   */
  dataAccessors: PropTypes.shape({
    fill: CommonPropTypes.dataAccessor,
    key: CommonPropTypes.dataAccessor,
    symbol: CommonPropTypes.dataAccessor,
    x: CommonPropTypes.dataAccessor,
    y: CommonPropTypes.dataAccessor,
  }).isRequired,

  /**
   * Accessors for objects within `props.data`
   *   color: (optional) color data as input to color scale.
   *   data: data provided to child components. default: 'values'
   *   key: unique key to apply to child components. used as input to color scale if color field is not specified. default: 'key'
   *   symbol: symbol data as input to the symbol scale.
   */
  fieldAccessors: PropTypes.shape({
    color: CommonPropTypes.dataAccessor,
    data: CommonPropTypes.dataAccessor.isRequired,
    key: CommonPropTypes.dataAccessor.isRequired,
    symbol: CommonPropTypes.dataAccessor,
  }),

  /**
   * The datum object corresponding to the `<Symbol />` currently focused.
   */
  focus: PropTypes.object,

  /**
   * className applied if `<Symbol />` has focus.
   */
  focusedClassName: CommonPropTypes.className,

  /**
   * inline styles applied to focused `<Symbol />`.
   * If an object, spread into inline styles.
   * If a function, passed underlying datum corresponding to its `<Symbol />`.
   */
  focusedStyle: CommonPropTypes.style,

  /**
   * onClick callback.
   * signature: function(SyntheticEvent, data, instance) {...}
   */
  onClick: PropTypes.func,

  /**
   * onMouseLeave callback.
   * signature: function(SyntheticEvent, data, instance) {...}
   */
  onMouseLeave: PropTypes.func,

  /**
   * onMouseMove callback.
   * signature: function(SyntheticEvent, data, instance) {...}
   */
  onMouseMove: PropTypes.func,

  /**
   * onMouseOver callback.
   * signature: function(SyntheticEvent, data, instance) {...}
   */
  onMouseOver: PropTypes.func,

  /**
   * `x` and `y` scales for positioning `<Symbol />`s.
   * Object with keys: `x`, and `y`.
   */
  scales: PropTypes.shape({
    x: PropTypes.func,
    y: PropTypes.func,
  }).isRequired,

  /**
   * className applied to `<Scatter />`'s outermost wrapping `<g>`.
   */
  scatterClassName: CommonPropTypes.className,

  /**
   * function to apply to the datum to transform scatter values. default: _.identity
   * signature: (data, key) => {...}
   */
  scatterValuesIteratee: PropTypes.func,

  /**
   * className applied to `<Symbol />`s if selected
   */
  selectedClassName: CommonPropTypes.className,

  /**
   * inline styles applied to selected `<Symbol />`s.
   * If an object, spread into inline styles.
   * If a function, passed underlying datum corresponding to its `<Symbol />`.
   */
  selectedStyle: CommonPropTypes.style,

  /**
   * Datum object or array of datum objects corresponding to selected `<Symbol />`s
   */
  selection: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]),

  /**
   * Size of `<Symbol />`s; area in square pixels.
   * If not provided, `<Symbol />` provides a default of 64.
   */
  size: PropTypes.number,

  /**
   * inline style applied to outermost wrapping `<g>`
   */
  style: PropTypes.object,

  /**
   * className applied to each `<Symbol />`
   */
  symbolClassName: CommonPropTypes.className,

  /**
   * If provided, used in conjunction with `dataAccessors.symbol` (or `dataAccessors.key` if not provided)
   * to determine type of symbol to render
   */
  symbolScale: PropTypes.func,

  /**
   * Inline styles applied to `<Symbol />`s.
   */
  symbolStyle: CommonPropTypes.style,
};

MultiScatter.defaultProps = {
  colorScale() { return 'steelblue'; },
  fieldAccessors: {
    data: 'values',
    key: 'key',
  },
  scatterValuesIteratee: CommonDefaultProps.identity,
  size: 64,
  symbolField: 'type',
  symbolScale() { return 'circle'; },
};
