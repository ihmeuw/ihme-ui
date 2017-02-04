import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { symbol } from 'd3';
import { assign } from 'lodash';

import { eventHandleWrapper } from '../../../utils/events';
import {
  CommonDefaultProps,
  CommonPropTypes,
  propsChanged,
  PureComponent,
  stateFromPropUpdates,
} from '../../../utils';
import { getSymbol, symbolTypes } from '../../../utils/symbol';

const SYMBOL_ROTATE = {
  down: 180,
  left: 270,
  right: 90,
};

/**
 * `import { Symbol } from 'ihme-ui/ui/shape'`
 */
export default class Symbol extends PureComponent {
  /**
   * Return path string for given symbol type and size
   * @param type {String}
   * @param size {Number}
   * @return {String}
   */
  static getPath(type, size) {
    const symbolType = getSymbol(type);
    return symbol().type(symbolType).size(size)();
  }

  /**
   * Calculate style given base style, selected style, and focused style
   * @param {Object}
   * @return {Object} computed style
   */
  static getStyle({ datum, fill, focused, focusedStyle, selected, selectedStyle, style }) {
    const baseStyle = { fill };
    const computedStyle = typeof style === 'function' ? style(datum) : style;
    let computedSelectedStyle = {};
    let computedFocusedStyle = {};

    // if symbol is selected, compute selectedStyle
    if (selected) {
      computedSelectedStyle = typeof selectedStyle === 'function' ?
        selectedStyle(datum) : selectedStyle;
    }

    // if symbol is focused, compute focusedStyle
    if (focused) {
      computedFocusedStyle = typeof focusedStyle === 'function' ?
        focusedStyle(datum) : focusedStyle;
    }

    return assign({}, baseStyle, computedStyle, computedSelectedStyle, computedFocusedStyle);
  }

  constructor(props) {
    super(props);
    this.state = stateFromPropUpdates(Symbol.propUpdates, {}, props, {});
  }

  componentWillReceiveProps(nextProps) {
    this.setState(stateFromPropUpdates(Symbol.propUpdates, this.props, nextProps, {}));
  }

  render() {
    const {
      className,
      clipPathId,
      datum,
      focused,
      focusedClassName,
      onClick,
      onMouseLeave,
      onMouseMove,
      onMouseOver,
      selected,
      selectedClassName,
      translateX,
      translateY,
    } = this.props;
    const { path, rotate, style } = this.state;

    return (
      <path
        d={path}
        className={classNames(className, {
          [selectedClassName]: selected && selectedClassName,
          [focusedClassName]: focused && selectedClassName,
        }) || (void 0)}
        clipPath={clipPathId && `url(#${clipPathId})`}
        onClick={eventHandleWrapper(onClick, datum, this)}
        onMouseLeave={eventHandleWrapper(onMouseLeave, datum, this)}
        onMouseMove={eventHandleWrapper(onMouseMove, datum, this)}
        onMouseOver={eventHandleWrapper(onMouseOver, datum, this)}
        style={style}
        transform={`translate(${translateX}, ${translateY}) rotate(${rotate})`}
      />
    );
  }
}

Symbol.propTypes = {
  /**
   * Class name applied to path.
   */
  className: CommonPropTypes.className,

  /**
   * If a clip path is applied to a container element (e.g., an `<AxisChart />`),
   * clip this path to that container by passing in the clip path URL id.
   */
  clipPathId: PropTypes.string,

  /**
   * Datum object corresponding to this symbol ("bound" data, in the language in D3)
   */
  datum: PropTypes.object,

  /**
   * Fill color for path.
   */
  fill: PropTypes.string,

  /**
   * Whether symbol has focus.
   */
  focused: PropTypes.bool,

  /**
   * Class name applied if symbol has focus.
   */
  focusedClassName: CommonPropTypes.className,

  /**
   * Inline styles applied if symbol has focus.
   * If an object, spread directly into inline styles.
   * If a function, called with `props.datum` as argument; must return an object of inline styles.
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
   * Whether symbol is selected.
   */
  selected: PropTypes.bool,

  /**
   * Class name applied if selected.
   */
  selectedClassName: CommonPropTypes.className,

  /**
   * Inline styles applied to selected `<Symbol />`s.
   * If an object, spread into inline styles.
   * If a function, passed underlying datum corresponding to its `<Symbol />`.
   */
  selectedStyle: CommonPropTypes.style,

  /**
   * Area in square pixels.
   */
  size: PropTypes.number,

  /**
   * Base inline styles applied to `<Symbol />`s.
   * If an object, spread into inline styles.
   * If a function, passed underlying datum corresponding to its `<Symbol />`.
   */
  style: CommonPropTypes.style,

  /**
   * Type of symbol to render, driven by d3-shape.
   * One of: 'circle', 'cross', 'diamond', 'square', 'star', 'triangle', 'wye'
   */
  symbolType: PropTypes.oneOf(symbolTypes()),

  /**
   * Move symbol away from origin in x direction.
   */
  translateX: PropTypes.number,

  /**
   * Move symbol away from origin in y direction.
   */
  translateY: PropTypes.number,
};

Symbol.defaultProps = {
  fill: 'steelblue',
  focused: false,
  focusedClassName: 'focused',
  focusedStyle: {
    stroke: '#AAF',
    strokeWidth: 1,
  },
  onClick: CommonDefaultProps.noop,
  onMouseLeave: CommonDefaultProps.noop,
  onMouseMove: CommonDefaultProps.noop,
  onMouseOver: CommonDefaultProps.noop,
  selected: false,
  selectedClassName: 'selected',
  selectedStyle: {
    stroke: '#000',
    strokeWidth: 1,
  },
  size: 64,
  translateX: 0,
  translateY: 0,
  symbolType: 'circle',
  style: {},
};

Symbol.propUpdates = {
  // update path if symbol type or size have changed
  path: (accum, propName, prevProps, nextProps) => {
    if (!propsChanged(prevProps, nextProps, ['symbolType', 'size'])) return accum;
    const [symbolType, rotate] = nextProps.symbolType.split(' ', 2);
    return assign(accum, {
      path: Symbol.getPath(symbolType, nextProps.size),
      rotate: SYMBOL_ROTATE[rotate] || 0,
    });
  },

  // update style if datum, focused, focusedStyle, selected, selectedStyle, or style have changed
  style: (accum, propName, prevProps, nextProps) => {
    if (!propsChanged(prevProps, nextProps, [
      'datum',
      'fill',
      'focused',
      'focusedStyle',
      'selected',
      'selectedStyle',
      'style',
    ])) {
      return accum;
    }
    return assign(accum, {
      style: Symbol.getStyle({
        datum: nextProps.datum,
        fill: nextProps.fill,
        focused: nextProps.focused,
        focusedStyle: nextProps.focusedStyle,
        selected: nextProps.selected,
        selectedStyle: nextProps.selectedStyle,
        style: nextProps.style,
      }),
    });
  },
};
