import React, { PropTypes } from 'react';
import classNames from 'classnames';
import {
  assign,
  findIndex,
  isFinite,
  keyBy,
  map,
  pick,
  sortBy,
} from 'lodash';
import {
  CommonDefaultProps,
  CommonPropTypes,
  propResolver,
  propsChanged,
  PureComponent,
  stateFromPropUpdates,
} from '../../../utils';

import Symbol from './symbol';

/**
 * `import { Scatter } from 'ihme-ui/ui/shape'`
 */
export default class Scatter extends PureComponent {
  constructor(props) {
    super(props);
    this.state = stateFromPropUpdates(Scatter.propUpdates, {}, props, {});
  }

  componentWillReceiveProps(nextProps) {
    this.state = stateFromPropUpdates(Scatter.propUpdates, this.props, nextProps, this.state);
  }

  render() {
    const {
      className,
      clipPathId,
      colorScale,
      dataAccessors,
      fill,
      focus,
      scales,
      symbolClassName,
      symbolScale,
      symbolType,
    } = this.props;

    const { selectedDataMappedToKeys, sortedData } = this.state;

    const childProps = pick(this.props, [
      'focusedClassName',
      'focusedStyle',
      'onClick',
      'onMouseLeave',
      'onMouseMove',
      'onMouseOver',
      'selectedClassName',
      'selectedStyle',
      'size',
      'style',
    ]);

    return (
      <g
        className={className && classNames(className)}
        clipPath={clipPathId && `url(#${clipPathId})`}
      >
        {
          map(sortedData, (datum) => {
            // value passed into colorScale
            // use dataAccessors.x as fail-over for backward compatibility
            const key = propResolver(datum, dataAccessors.key);
            const fillValue = propResolver(datum, dataAccessors.fill || dataAccessors.x);

            const focusedDatumKey = focus ? propResolver(focus, dataAccessors.key) : null;

            const resolvedSymbolType = dataAccessors.symbol ?
              symbolScale(propResolver(datum, dataAccessors.symbol)) :
              symbolType;

            const xValue = propResolver(datum, dataAccessors.x);
            const yValue = propResolver(datum, dataAccessors.y);

            return (
              <Symbol
                className={symbolClassName}
                key={key}
                datum={datum}
                fill={colorScale && isFinite(fillValue) ? colorScale(fillValue) : fill}
                focused={focusedDatumKey === key}
                selected={selectedDataMappedToKeys.hasOwnProperty(key)}
                symbolType={resolvedSymbolType}
                translateX={scales.x && isFinite(xValue) ? scales.x(xValue) : 0}
                translateY={scales.y && isFinite(yValue) ? scales.y(yValue) : 0}
                {...childProps}
              />
            );
          })
        }
      </g>
    );
  }
}

Scatter.propTypes = {
  /**
   * className applied to outermost wrapping `<g>`.
   */
  className: CommonPropTypes.className,

  /**
   * If a clip path is applied to a container element (e.g., an `<AxisChart />`),
   * clip all children of `<Scatter />` to that container by passing in the clip path URL id.
   */
  clipPathId: PropTypes.string,

  /**
   * If provided will determine color of rendered `<Symbol />`s
   */
  colorScale: PropTypes.func,

  /**
   * Array of datum objects
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
    key: CommonPropTypes.dataAccessor.isRequired,
    symbol: CommonPropTypes.dataAccessor,
    x: CommonPropTypes.dataAccessor,
    y: CommonPropTypes.dataAccessor,
  }).isRequired,

  /**
   * If `props.colorScale` is undefined, each `<Symbol />` will be given this same fill value.
   */
  fill: PropTypes.string,

  /**
   * The datum object corresponding to the `<Symbol />` currently focused.
   */
  focus: PropTypes.object,

  /**
   * className applied if `<Symbol />` has focus.
   */
  focusedClassName: CommonPropTypes.className,

  /**
   * inline styles applied to focused `<Symbol />`
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
   * className applied to `<Symbol />`s if selected
   */
  selectedClassName: CommonPropTypes.className,

  /**
   * Array of datum objects corresponding to selected `<Symbol />`s
   */
  selection: PropTypes.array,

  /**
   * Size of `<Symbol />`s; area in square pixels.
   * If not provided, `<Symbol />` provides a default of 64.
   */
  size: PropTypes.number,

  /**
   * Inline styles passed to each `<Symbol />`
   */
  style: CommonPropTypes.style,

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
   * Type of symbol to render; use in lieu of `props.symbolScale`
   * if you want all `<Symbol />` to be of the same type.
   */
  symbolType: PropTypes.string,
};

Scatter.defaultProps = {
  fill: 'steelblue',
  onClick: CommonDefaultProps.noop,
  onMouseLeave: CommonDefaultProps.noop,
  onMouseMove: CommonDefaultProps.noop,
  onMouseOver: CommonDefaultProps.noop,
  size: 64,
  symbolType: 'circle',
};

Scatter.propUpdates = {
  selections: (state, _, prevProps, nextProps) => {
    if (!propsChanged(prevProps, nextProps, ['selection', 'dataAccessors'])) return state;
    return assign({}, state, {
      selectedDataMappedToKeys: keyBy(nextProps.selection, (selectedDatum) =>
        propResolver(selectedDatum, nextProps.dataAccessors.key)
      ),
    });
  },
  sortedData: (state, _, prevProps, nextProps) => {
    /* eslint-disable max-len, eqeqeq */
    if (!propsChanged(prevProps, nextProps, ['selection', 'data'])) return state;
    const keyField = nextProps.dataAccessors.key;
    return assign({}, state, {
      // sort data by whether or not datum is selected
      // this is a way of ensuring that selected symbols are rendered last
      // similar to, in a path click handler, doing a this.parentNode.appendChild(this)
      sortedData: sortBy(nextProps.data, (datum) =>
        findIndex(nextProps.selection, (selected) =>
          propResolver(datum, keyField) == propResolver(selected, keyField)
        )
      ),
    });
  },
};
