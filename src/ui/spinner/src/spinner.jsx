import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { Symbol } from '../../shape';
import { CommonPropTypes, PureComponent } from '../../../utils';

import styles from './spinner.css';

/**
 * `import Spinner from 'ihme-ui/ui/spinner'`
 *
 *
 * Yet another loading indicator. But don't be fooled! This one doesn't actually spin.
 */
class Spinner extends PureComponent {
  render() {
    const {
      className,
      inline,
      style,
      symbolFill,
      symbolStyle,
      symbolType,
    } = this.props;

    return (
      <div
        className={classNames(styles.spinner, {
          [styles['inline-spinner']]: inline
        }, className)}
        style={style}
      >
        <svg className={styles.dot} viewBox="-8 -8 16 16" width="1em" height="1em">
          <Symbol fill={symbolFill} style={symbolStyle} symbolType={symbolType} />
        </svg>
        <svg className={styles.dot} viewBox="-8 -8 16 16" width="1em" height="1em">
          <Symbol fill={symbolFill} style={symbolStyle} symbolType={symbolType} />
        </svg>
        <svg className={styles.dot} viewBox="-8 -8 16 16" width="1em" height="1em">
          <Symbol fill={symbolFill} style={symbolStyle} symbolType={symbolType} />
        </svg>
      </div>
    );
  }
}

Spinner.propTypes = {
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
  style: CommonPropTypes.style,

  /**
   * Fill color of loading symbol.
   */
  symbolFill: PropTypes.string,

  /**
   * Inline styles applied to loading symbol.
   */
  symbolStyle: CommonPropTypes.style,

  /**
   * Type of loading symbol to render.
   * One of: 'circle', 'cross', 'diamond', 'square', 'star', 'triangle', 'wye'
   */
  symbolType: PropTypes.string,
};

Spinner.defaultProps = {
  symbolFill: 'black',
  symbolType: 'circle',
};

export default Spinner;
