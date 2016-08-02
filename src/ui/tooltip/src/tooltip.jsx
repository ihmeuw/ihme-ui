import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { assign, bindAll, get as getValue } from 'lodash';
import { CommonPropTypes, propsChanged, PureComponent } from '../../../utils';

import styles from './tooltip.css';

export default class Tooltip extends PureComponent {
  /**
   * @param {Object} params
   * @param {Number} params.height - height of tooltip
   * @param {Number} params.mouseX
   * @param {Number} params.mouseY
   * @param {Number} params.offsetX
   * @param {Number} params.offsetY
   * @param {Number} params.paddingX
   * @param {Number} params.paddingY
   * @param {Number} params.width - width of tooltip
   * @param {Number} params.windowInnerWidth - inner width of Window
   * @param {Number} params.windowInnerHeight - inner height of Window
   * @return {{ left: number, top: number }}
   */
  static getPosition({
    height,
    mouseX,
    mouseY,
    offsetX,
    offsetY,
    paddingX,
    paddingY,
    width,
    windowInnerHeight,
    windowInnerWidth,
  }) {
    // aim to position tooltip centered about the mouse-cursor in the x-direction
    const halfWidth = width / 2;
    const offsetXCoordinate = mouseX + offsetX;

    let x = offsetXCoordinate - halfWidth;
    // guard against placing the tooltip off the left-side of the screen
    if (x < paddingX) x = offsetXCoordinate + paddingX;
    // guard against placing the tooltip off the right-side of the screen
    if (offsetXCoordinate + halfWidth > windowInnerWidth - paddingX) {
      x = mouseX - width - paddingX - offsetX;
    }

    // position tooltip above or below the mouse cursor in the y-direction
    // origin in top-left corner
    const offsetYCoordinate = mouseY - offsetY;
    let y = (offsetY < 0)
            ? offsetYCoordinate // assume tooltip should be placed below mouse
            : offsetYCoordinate - height; // otherwise, assume tooltip should be placed above mouse

    // guard against placing tooltip off top of screen
    if (y < paddingY) y = offsetYCoordinate + paddingY;
    // guard against placing tooltip below screen
    if (offsetY < 0 && offsetYCoordinate + height > windowInnerHeight - paddingY) {
      y = mouseY - height - paddingY - Math.abs(offsetY);
    }

    return { transform: `translate(${x}px, ${y}px)` };
  }

  /**
   * Calculate style given base style and absolute position
   * @param {Object} style
   * @param {Object} position
   * @param {Number} position.left
   * @param {Number} position.top
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
      'mouseX',
      'mouseY',
      'offsetX',
      'offsetY',
      'paddingX',
      'paddingY',
      'style',
    ]) || !this._wrapper) return;

    const { width, height } = this._wrapper.getBoundingClientRect();
    this.setState({
      style: Tooltip.getStyle(nextProps.style, Tooltip.getPosition({
        height,
        mouseX: nextProps.mouseX,
        mouseY: nextProps.mouseY,
        offsetX: nextProps.offsetX,
        offsetY: nextProps.offsetY,
        paddingX: nextProps.paddingX,
        paddingY: nextProps.paddingY,
        width,
        windowInnerHeight: getValue(window, 'innerHeight', 0),
        windowInnerWidth: getValue(window, 'innerWidth', 0),
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
  /* className to apply to tooltip wrapper */
  className: CommonPropTypes.className,

  /* mouse postion (x; e.g., clientX) */
  mouseX: PropTypes.number,

  /* mouse position (y; e.g., clientY) */
  mouseY: PropTypes.number,

  /* shift tooltip (in px) left of mouseClientX  */
  offsetX: PropTypes.number,

  /* shift tooltip (in px) above or below mouseClientY */
  offsetY: PropTypes.number,

  /*
    guards against placing the tooltip outside of the bounds of the window;
    at minimum, tooltip will be placed padding.width within window left/right bounds
  */
  paddingX: PropTypes.number,

  /*
    guards against placing the tooltip outside of the bounds of the window;
    at minimum, tooltip will be placed padding.height within window top/bottom bounds
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
  offsetY: 25,
  paddingX: 10,
  paddingY: 10,
  show: false,
};
