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
  static getStyle(feature, fill, selected, style, selectedStyle) {
    const baseStyle = { fill };
    const computedStyle = typeof style === 'function' ? style(feature) : style;

    // if feature is not selected, early return to avoid applying selectedStyles
    if (!selected) return assign({}, baseStyle, computedStyle);

    // otherwise, apply selectedStyle on top of basic style
    const computedSelectedStyle = typeof selectedStyle === 'function'
                                  ? selectedStyle(feature)
                                  : selectedStyle;
    return assign({}, baseStyle, computedStyle, computedSelectedStyle);
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
    const { className, selected, selectedClassName } = this.props;
    const { path, style } = this.state;

    return (
      <path
        d={path}
        className={classNames(className, {
          [selectedClassName]: selected && selectedClassName,
        }) || (void 0)}
        style={style}
        onClick={this.onClick}
        onMouseLeave={this.onMouseLeave}
        onMouseMove={this.onMouseMove}
        onMouseOver={this.onMouseOver}
      />
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
  onClick: noop,
  onMouseDown: noop,
  onMouseLeave: noop,
  onMouseMove: noop,
  onMouseOver: noop,
  selected: false,
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

  // update style if feature, fill, selected, selectedStyle, or style have changed
  style: (accum, propName, prevProps, nextProps) => {
    if (!propsChanged(prevProps, nextProps, [
      'feature',
      'fill',
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
        nextProps.selectedStyle
      ),
    });
  }
};
