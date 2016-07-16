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
      'onMouseDown',
      'onMouseMove',
      'onMouseOut',
      'onMouseOver'
    ]);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(stateFromPropUpdates(Path.propUpdates, this.props, nextProps, {}));
  }

  // e.g., select the location
  onClick(e) {
    e.preventDefault();

    // if being dragged, don't fire onClick
    if (this.dragging) return;

    this.props.onClick(e, this.props.locationId, this);
  }

  onMouseDown(e) {
    e.preventDefault();

    // clear mouseMove flag
    this.dragging = false;
    this.props.onMouseDown(e, this.props.locationId, this);
  }

  // e.g., position tooltip
  onMouseMove(e) {
    e.preventDefault();

    // set flag to prevent onClick handler from firing when map is being dragged
    this.dragging = true;
    this.props.onMouseMove(e, this.props.locationId, this);
  }

  // e.g., destroy tooltip
  onMouseOut(e) {
    e.preventDefault();

    this.props.onMouseOut(e, this.props.locationId, this);
  }

  // e.g., init tooltip
  onMouseOver(e) {
    e.preventDefault();

    this.props.onMouseOver(e, this.props.locationId, this);
  }

  render() {
    const { className, selected, selectedClassName } = this.props;
    const { path, style } = this.state;

    return (
      <path
        d={path}
        className={classNames(className, {
          [selectedClassName]: selected,
        })}
        style={style}
        onClick={this.onClick}
        onMouseDown={this.onMouseDown}
        onMouseMove={this.onMouseMove}
        onMouseOut={this.onMouseOut}
        onMouseOver={this.onMouseOver}
      >
      </path>
    );
  }
}

Path.propTypes = {
  /* a GeoJSON feature or geometry object; see https://github.com/d3/d3/wiki/Geo-Paths#_path */
  feature: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object
  ]).isRequired,

  /* a function which accepts a `feature` and returns a valid `d` attribute */
  pathGenerator: PropTypes.func.isRequired,

  /* locationId identifying this geometry */
  locationId: PropTypes.number,

  /* fill of path */
  fill: PropTypes.string,

  /* whether or not this geometry is selected */
  selected: PropTypes.bool,

  /* signature: function(event, locationId, Path) {...} */
  onClick: PropTypes.func,

  /* signature: function(event, locationId, Path) {...} */
  onMouseOver: PropTypes.func,

  /* signature: function(event, locationId, Path) {...} */
  onMouseMove: PropTypes.func,

  /* signature: function(event, locationId, Path) {...} */
  onMouseDown: PropTypes.func,

  /* signature: function(event, locationId, Path) {...} */
  onMouseOut: PropTypes.func,

  /* classname and style to apply to unselected path */
  className: CommonPropTypes.className,
  style: CommonPropTypes.style,

  /* classname and style to apply to selected path */
  selectedClassName: CommonPropTypes.className,
  selectedStyle: CommonPropTypes.style,
};

Path.defaultProps = {
  selected: false,
  style: {
    strokeWidth: '1px',
    stroke: '#000',
  },
  selectedStyle: {
    strokeWidth: '2px',
    stroke: '#000',
  },
  onClick() { return noop; },
  onMouseOver() { return noop; },
  onMouseMove() { return noop; },
  onMouseDown() { return noop; },
  onMouseOut() { return noop; },
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
