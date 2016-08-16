import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { assign, bindAll, get as getValue } from 'lodash';
import { CommonPropTypes, propsChanged, PureComponent } from '../../../utils';

import styles from './tooltip.css';

export default class Tooltip extends PureComponent {
  /**
   * Return bounds passed through props or default
   * to { x: [0, window.innerWidth], y: [0, window.innerHeight] }
   * @param {Object} [bounds]
   * @param {Array} [bounds.x]
   * @param {Array} [bounds.y]
   * @return {{ x: array, y: array}} Bounds object with keys x and y
   */
  static getBounds(bounds) {
    return {
      x: getValue(bounds, 'x', [0, getValue(window, 'innerWidth', 0)]),
      y: getValue(bounds, 'y', [0, getValue(window, 'innerHeight', 0)]),
    };
  }

  /**
   * @param {Object} params
   * @param {Object} params.bounds
   * @param {Array} params.bounds.x - default to [0, window.innerWidth]
   * @param {Array} params.bounds.y - default to [0, window.innerHeight]
   * @param {Number} params.height - height of tooltip
   * @param {Number} params.mouseX
   * @param {Number} params.mouseY
   * @param {Number} params.offsetX
   * @param {Number} params.offsetY
   * @param {Number} params.paddingX
   * @param {Number} params.paddingY
   * @param {Number} params.width - width of tooltip
   * @return {{ left: number, top: number }}
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
    const halfWidth = width / 2;
    const absOffsetX = Math.abs(offsetX);
    let x = mouseX + offsetX - halfWidth;

    // guard against placing the tooltip out of its left-bound
    if (x < leftBound + paddingX) {
      x = mouseX < leftBound
        ? leftBound + paddingX + absOffsetX
        : mouseX + paddingX;
    }
    // guard against placing the tooltip out of its right-bound
    if (x > rightBound - paddingX - width) {
      x = mouseX > rightBound
        ? rightBound - width - Math.abs(absOffsetX - paddingX)
        : mouseX - width - Math.abs(absOffsetX - paddingX);
    }

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

    return { transform: `translate(${x}px, ${y}px)` };
  }

  /**
   * Calculate style given base style and absolute position
   * @param {Object} style
   * @param {Object} position
   * @param {String} position.transform
   * @return {Object}
   */
  static getStyle(style, position) {
    return assign({}, style, position);
  }

  constructor(props) {
    super(props);

    const position = { left: 0, top: 0 };
    this.state = {
      style: Tooltip.getStyle(props.style, position),
    };

    bindAll(this, [
      'storeRef',
    ]);
  }

  componentWillReceiveProps(nextProps) {
    if (!propsChanged(this.props, nextProps, [
      'bounds',
      'mouseX',
      'mouseY',
      'offsetX',
      'offsetY',
      'paddingX',
      'paddingY',
      'style',
    ]) || !this._wrapper) return;
    const { width, height } = this._wrapper.getBoundingClientRect();
    const bounds = Tooltip.getBounds(nextProps.bounds);

    this.setState({
      style: Tooltip.getStyle(nextProps.style, Tooltip.getPosition({
        bounds,
        height,
        mouseX: nextProps.mouseX,
        mouseY: nextProps.mouseY,
        offsetX: nextProps.offsetX,
        offsetY: nextProps.offsetY,
        paddingX: nextProps.paddingX,
        paddingY: nextProps.paddingY,
        width,
      })),
    });
  }

  storeRef(el) {
    this._wrapper = el;
  }

  render() {
    const {
      className,
      show,
    } = this.props;

    const { style } = this.state;

    if (!show) return null;

    return (
      <div
        className={classNames(styles.wrapper, className)}
        ref={this.storeRef}
        style={style}
      >
        {this.props.children}
      </div>
    );
  }
}

Tooltip.propTypes = {
  /*
   pixel bounds within which to render tooltip;
   defaults to [0, window.innerWidth], [0, window.innerHeight]
  */
  bounds: PropTypes.shape({
    x: PropTypes.arrayOf(PropTypes.number),
    y: PropTypes.arrayOf(PropTypes.number),
  }),

  /* className to apply to tooltip wrapper */
  className: CommonPropTypes.className,

  /* mouse postion (x; e.g., clientX) */
  mouseX: PropTypes.number,

  /* mouse position (y; e.g., clientY) */
  mouseY: PropTypes.number,

  /* shift tooltip offsetX pixels left (if negative) or right (if positive) of mouseX  */
  offsetX: PropTypes.number,

  /* shift tooltip offsetY pixels above (if negative) or below (if positive) of mouseY  */
  offsetY: PropTypes.number,

  /*
    guards against placing the tooltip outside of its bounds;
    at minimum, tooltip will be placed paddingX within bounds.x
  */
  paddingX: PropTypes.number,

  /*
    guards against placing the tooltip outside of its bounds;
    at minimum, tooltip will be placed paddingY within bounds.y
  */
  paddingY: PropTypes.number,

  /* whether to show or hide tooltip */
  show: PropTypes.bool,

  /* inline styles to be applied to tooltip wrapper */
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
