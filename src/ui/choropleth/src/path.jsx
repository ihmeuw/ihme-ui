import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { assign, noop, bindAll } from 'lodash';

import {
  CommonPropTypes,
  propsChanged,
  PureComponent,
  stateFromPropUpdates,
} from '../../../utils';

export default class Path extends PureComponent {
  /**
   * Compute inline-style
   * @param {Object} feature
   * @param {String} fill
   * @param {Boolean} selected
   * @param {Object|Function} style
   * @param {Object|Function} selectedStyle
   * @return {Object}
   */
  static getStyle(feature, fill, selected, style, selectedStyle, focused, focusedStyle) {
    const baseStyle = { fill };
    const computedStyle = typeof style === 'function' ? style(feature) : style;

    let computedSelectedStyle = {};
    let computedFocusedStyle = {};

    // if feature is selected, compute selectedStyle
    if (selected) {
      computedSelectedStyle = typeof selectedStyle === 'function'
        ? selectedStyle(feature)
        : selectedStyle;
    }

    // if feature is focused, compute focusedStyle
    if (focused) {
      computedFocusedStyle = typeof focusedStyle === 'function' ?
        focusedStyle(feature) : focusedStyle;
    }

    return assign({}, baseStyle, computedStyle, computedSelectedStyle, computedFocusedStyle);
  }

  constructor(props) {
    super(props);

    this.state = stateFromPropUpdates(Path.propUpdates, {}, props, {});

    bindAll(this, [
      'onClick',
      'onMouseMove',
      'onMouseLeave',
      'onMouseOver'
    ]);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(stateFromPropUpdates(Path.propUpdates, this.props, nextProps, {}));
  }

  // e.g., select the location
  onClick(e) {
    e.preventDefault();

    this.props.onClick(e, this.props.datum, this);
  }

  // e.g., destroy tooltip
  onMouseLeave(e) {
    e.preventDefault();

    this.props.onMouseLeave(e, this.props.datum, this);
  }

  // e.g., position tooltip
  onMouseMove(e) {
    e.preventDefault();

    this.props.onMouseMove(e, this.props.datum, this);
  }

  // e.g., init tooltip
  onMouseOver(e) {
    e.preventDefault();

    this.props.onMouseOver(e, this.props.datum, this);
  }

  render() {
    const {
      className,
      selected,
      selectedClassName,
      focused,
      focusedClassName,
    } = this.props;

    const { path, style } = this.state;

    return (
      <path
        d={path}
        className={classNames(className, {
          [selectedClassName]: selected && selectedClassName,
          [focusedClassName]: focused && focusedClassName,
        }) || (void 0)}
        style={style}
        onClick={this.onClick}
        onMouseLeave={this.onMouseLeave}
        onMouseMove={this.onMouseMove}
        onMouseOver={this.onMouseOver}
      >
      </path>
    );
  }
}

Path.propTypes = {
  /* base classname to apply to path */
  className: CommonPropTypes.className,

  /* datum associated with this location */
  datum: PropTypes.object,

  /* a GeoJSON feature or geometry object; see https://github.com/d3/d3/wiki/Geo-Paths#_path */
  feature: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object
  ]).isRequired,

  /* fill of path */
  fill: PropTypes.string,

  /**
   * Whether shape has focus.
   */
  focused: PropTypes.bool,

  /**
   * Class name applied if shape has focus.
   */
  focusedClassName: CommonPropTypes.className,

  /**
   * Inline styles applied if shape has focus.
   * If an object, spread directly into inline styles.
   * If a function, called with `props.datum` as argument and return value is spread into inline styles;
   * signature: (datum) => obj
   */
  focusedStyle: CommonPropTypes.style,

  /* signature: function(event, datum, Path) {...} */
  onClick: PropTypes.func,

  /* signature: function(event, datum, Path) {...} */
  onMouseLeave: PropTypes.func,

  /* signature: function(event, datum, Path) {...} */
  onMouseMove: PropTypes.func,

  /* signature: function(event, datum, Path) {...} */
  onMouseOver: PropTypes.func,

  /* a function which accepts a `feature` and returns a valid `d` attribute */
  pathGenerator: PropTypes.func.isRequired,

  /* whether or not this geometry is selected */
  selected: PropTypes.bool,

  /* className to apply to path when selected */
  selectedClassName: CommonPropTypes.className,

  /* style to apply to path when selected */
  selectedStyle: CommonPropTypes.style,

  /* base style to apply to path */
  style: CommonPropTypes.style,
};

Path.defaultProps = {
  focused: false,
  focusedClassName: 'focused',
  focusedStyle: {
    stroke: '#AAF',
    strokeWidth: 2,
  },
  onClick: noop,
  onMouseDown: noop,
  onMouseLeave: noop,
  onMouseMove: noop,
  onMouseOver: noop,
  selected: false,
  selectedClassName: 'selected',
  selectedStyle: {
    strokeWidth: '2px',
    stroke: '#000',
  },
  style: {
    strokeWidth: '1px',
    stroke: '#000',
  },
};

Path.propUpdates = {
  // update path if feature or pathGenerator fn have changed
  path: (accum, propName, prevProps, nextProps) => {
    if (!propsChanged(prevProps, nextProps, ['feature', 'pathGenerator'])) return accum;
    return assign(accum, {
      path: nextProps.pathGenerator(nextProps.feature),
    });
  },

  // update style if feature, fill, focused, focusedStyle, selected, selectedStyle, or style have changed
  style: (accum, propName, prevProps, nextProps) => {
    if (!propsChanged(prevProps, nextProps, [
      'feature',
      'fill',
      'focused',
      'focusedStyle',
      'selected',
      'selectedStyle',
      'style'
    ])) {
      return accum;
    }
    return assign(accum, {
      style: Path.getStyle(
        nextProps.feature,
        nextProps.fill,
        nextProps.selected,
        nextProps.style,
        nextProps.selectedStyle,
        nextProps.focused,
        nextProps.focusedStyle
      ),
    });
  }
};
