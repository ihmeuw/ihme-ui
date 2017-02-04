import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { assign, bindAll, clamp, get as getValue } from 'lodash';
import { CommonPropTypes, propsChanged, PureComponent, stateFromPropUpdates } from '../../../utils';

import styles from './tooltip.css';

/**
 * Return bounds passed through props or default
 * to { x: [0, window.innerWidth], y: [0, window.innerHeight] }
 * @param {Object} [bounds]
 * @param {Array} [bounds.x]
 * @param {Array} [bounds.y]
 * @return {{ x: Number[], y: Number[] }} Bounds object with keys x and y
 */
function getBounds(bounds) {
  return {
    x: getValue(bounds, 'x', [0, getValue(window, 'innerWidth', 0)]),
    y: getValue(bounds, 'y', [0, getValue(window, 'innerHeight', 0)]),
  };
}

/**
 * maps props.show to css visibility declaration
 * either 'visible' (if true) or 'hidden' (if false)
 * @param {boolean} visible
 * @return {string}
 */
function mapShowPropToVisibilityRule(visible) {
  if (visible) return 'visible';
  return 'hidden';
}


/**
 * `import Tooltip from 'ihme-ui/ui/tooltip'`
 *
 * A wrapper to provide bounded, absolute positioning for arbitrary content.
 */
export default class Tooltip extends PureComponent {
  /**
   * Calculate the translation of the tooltip with respect to the top-left corner of the screen
   * @param {Object} params
   * @param {Object} params.bounds
   * @param {Number[]} params.bounds.x - default to [0, window.innerWidth]
   * @param {Number[]} params.bounds.y - default to [0, window.innerHeight]
   * @param {Number} params.height - height of tooltip
   * @param {Number} params.mouseX
   * @param {Number} params.mouseY
   * @param {Number} params.offsetX
   * @param {Number} params.offsetY
   * @param {Number} params.paddingX
   * @param {Number} params.paddingY
   * @param {Number} params.width - width of tooltip
   * @return {Number[]} two-element array representing [x, y] coordinates used for the transform
   */
  static getPosition({
    bounds,
    height,
    mouseX,
    mouseY,
    offsetX,
    offsetY,
    paddingX,
    paddingY,
    width,
  }) {
    const {
      x: [leftBound, rightBound],
      y: [topBound, bottomBound],
    } = bounds;

    // aim to position tooltip centered about the mouse-cursor in the x-direction
    // guard against placing the tooltip out of its left of right bounds
    const x = clamp(
      mouseX + offsetX - width / 2,
      leftBound + paddingX,
      rightBound - paddingX - width
    );

    // position tooltip above or below the mouse cursor in the y-direction
    // origin in top-left corner
    const offsetYCoordinate = mouseY - offsetY;
    const absOffsetY = Math.abs(offsetY);
    let y = (offsetY < 0)
          ? offsetYCoordinate // assume tooltip should be placed below mouse
          : offsetYCoordinate - height; // otherwise, assume tooltip should be placed above mouse

    // guard against placing tooltip out of its top-bound
    if (y < topBound + paddingY) {
      y = mouseY < topBound
        ? topBound + paddingY + absOffsetY
        : mouseY + paddingY;
    }
    // guard against placing tooltip below screen
    if (y > bottomBound - paddingY - height) {
      y = mouseY > bottomBound
        ? bottomBound - height - Math.abs(absOffsetY - paddingY)
        : mouseY - height - Math.abs(absOffsetY - paddingY);
    }

    return [x, y];
  }

  constructor(props) {
    super(props);

    this.state = {
      style: stateFromPropUpdates(Tooltip.propUpdates, {}, props, {}, this),
    };

    bindAll(this, [
      'storeRef',
    ]);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      style: stateFromPropUpdates(
        Tooltip.propUpdates,
        this.props,
        nextProps,
        this.state.style,
        this
      ),
    });
  }

  storeRef(el) {
    this._wrapper = el;

    if (!el) return;

    this.setState({
      style: stateFromPropUpdates(
        Tooltip.propUpdates,
        {},
        this.props,
        this.state.style,
        this
      ),
    });
  }

  render() {
    const { style } = this.state;

    return (
      <div
        className={classNames(styles.wrapper, this.props.className)}
        ref={this.storeRef}
        style={style}
      >
        {this.props.children}
      </div>
    );
  }
}

Tooltip.propTypes = {
  /**
   * Pixel bounds within which to render tooltip.
   * Defaults to [0, window.innerWidth], [0, window.innerHeight].
   */
  bounds: PropTypes.shape({
    x: PropTypes.arrayOf(PropTypes.number),
    y: PropTypes.arrayOf(PropTypes.number),
  }),

  /**
   * Class name applied to outermost wrapping `<div>`.
   */
  className: CommonPropTypes.className,

  /**
   * Mouse postion (x; e.g., clientX)
   */
  mouseX: PropTypes.number,

  /**
   * Mouse position (y; e.g., clientY)
   */
  mouseY: PropTypes.number,

  /**
   * Shift tooltip offsetX pixels left (if negative) or right (if positive) of mouseX.
   */
  offsetX: PropTypes.number,

  /**
   * Shift tooltip offsetY pixels above (if negative) or below (if positive) of mouseY.
   */
  offsetY: PropTypes.number,

  /**
   * Guard against placing the tooltip outside of its bounds;
   * at minimum, tooltip will be placed paddingX within bounds.x.
   */
  paddingX: PropTypes.number,

  /**
   * Guard against placing the tooltip outside of its bounds;
   * at minimum, tooltip will be placed paddingY within bounds.y.
   */
  paddingY: PropTypes.number,

  /**
   * Whether to show or hide tooltip.
   */
  show: PropTypes.bool,

  /**
   * Inline styles to be applied to tooltip wrapper.
   */
  style: CommonPropTypes.style,
};

Tooltip.defaultProps = {
  mouseX: 0,
  mouseY: 0,
  offsetX: 0,
  offsetY: 0,
  paddingX: 10,
  paddingY: 10,
  show: false,
};

Tooltip.propUpdates = {
  position: (accum, _, prevProps, nextProps, context) => {
    /* eslint-disable no-underscore-dangle */
    if (!propsChanged(prevProps, nextProps, [
      'bounds',
      'mouseX',
      'mouseY',
      'offsetX',
      'offsetY',
      'paddingX',
      'paddingY',
    ]) || !context._wrapper) return accum;
    const { width, height } = context._wrapper.getBoundingClientRect();
    const bounds = getBounds(nextProps.bounds);
    const [x, y] = Tooltip.getPosition({
      bounds,
      height,
      mouseX: nextProps.mouseX,
      mouseY: nextProps.mouseY,
      offsetX: nextProps.offsetX,
      offsetY: nextProps.offsetY,
      paddingX: nextProps.paddingX,
      paddingY: nextProps.paddingY,
      width,
    });
    return assign({}, accum, { transform: `translate(${x}px, ${y}px)` });
    /* eslint-enable no-underscore-dangle */
  },
  display: (accum, _, prevProps, nextProps) => {
    if (!propsChanged(prevProps, nextProps, ['show'])) return accum;
    return assign({}, accum, { visibility: mapShowPropToVisibilityRule(nextProps.show) });
  },
  externalStyle: (accum, _, prevProps, nextProps) => {
    if (!propsChanged(prevProps, nextProps, ['style'])) return accum;
    return assign({}, accum, nextProps.style);
  }
};
