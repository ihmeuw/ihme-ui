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
  /* base classname to apply to symbol */
  className: CommonPropTypes.className,

  /* string id url for clip path */
  clipPathId: PropTypes.string,

  /* Datum for the click and hover handlers. */
  datum: PropTypes.object,

  fill: PropTypes.string,

  /* whether symbol has focus */
  focused: PropTypes.bool,

  /* classname to be applied if symbol has focus */
  focusedClassName: CommonPropTypes.className,

  /*
    inline-style object or function to be applied if symbol has focus;
    if a function, is called with datum
    can override style and selectedStyle
  */
  focusedStyle: CommonPropTypes.style,

  /* mouse events signature: function(event, data, instance) {...} */
  onClick: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onMouseMove: PropTypes.func,
  onMouseOver: PropTypes.func,

  /* whether symbol is selected */
  selected: PropTypes.bool,

  /* classname to be applied if symbol is selected */
  selectedClassName: CommonPropTypes.className,

  /*
   inline-style object or function to be applied if symbol is selected;
   if a function, is called with datum
   can override style
   */
  selectedStyle: CommonPropTypes.style,

  /* area in square pixels */
  size: PropTypes.number,

  /*
   inline-style object or function to be applied as base style;
   if a function, is called with datum
   */
  style: CommonPropTypes.style,

  /* a SYMBOL_TYPE  */
  symbolType: PropTypes.oneOf(symbolTypes()),

  translateX: PropTypes.number,

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
