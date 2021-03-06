import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Shape } from '../../shape';
import { CommonPropTypes } from '../../../utils';

import styles from './loading-indicator.css';

/**
 * `import { LoadingIndicator } from 'ihme-ui'`
 *
 *
 * Yet another loading indicator.
 */
export default function LoadingIndicator(props) {
  const {
    className,
    inline,
    style,
    shapeFill,
    shapeStyle,
    shapeType,
  } = props;

  return (
    <div
      className={classNames(styles.spinner, {
        [styles['inline-spinner']]: inline
      }, className)}
      style={style}
    >
      <svg className={styles.dot} viewBox="-8 -8 16 16" width="1em" height="1em">
        <Shape fill={shapeFill} style={shapeStyle} shapeType={shapeType} />
      </svg>
      <svg className={styles.dot} viewBox="-8 -8 16 16" width="1em" height="1em">
        <Shape fill={shapeFill} style={shapeStyle} shapeType={shapeType} />
      </svg>
      <svg className={styles.dot} viewBox="-8 -8 16 16" width="1em" height="1em">
        <Shape fill={shapeFill} style={shapeStyle} shapeType={shapeType} />
      </svg>
    </div>
  );
}

LoadingIndicator.propTypes = {
  /**
   * Class name applied to outermost wrapping `<div>`.
   */
  className: CommonPropTypes.className,

  /**
   * Display inline with other elements (e.g., in a button).
   */
  inline: PropTypes.bool,

  /**
   * Inline styles applied to outermost wrapping `<div>`.
   */
  style: PropTypes.object,

  /**
   * Fill color of loading shape.
   */
  shapeFill: PropTypes.string,

  /**
   * Inline styles applied to loading shape.
   */
  shapeStyle: CommonPropTypes.style,

  /**
   * Type of loading shape to render.
   * One of: 'circle', 'cross', 'diamond', 'square', 'star', 'triangle', 'wye'
   */
  shapeType: PropTypes.string,
};

LoadingIndicator.defaultProps = {
  shapeFill: 'black',
  shapeType: 'circle',
};
