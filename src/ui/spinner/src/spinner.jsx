import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { Symbol } from '../../shape';
import { CommonPropTypes, PureComponent } from '../../../utils';

import styles from './spinner.css';

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
  /* an extra classname */
  className: CommonPropTypes.className,

  /* display spinner inline with other elements (e.g., in a button) */
  inline: PropTypes.bool,

  style: CommonPropTypes.style,

  symbolFill: PropTypes.string,
  symbolStyle: CommonPropTypes.style,
  symbolType: PropTypes.string,
};

Spinner.defaultProps = {
  symbolFill: 'black',
  symbolType: 'circle',
};

export default Spinner;
