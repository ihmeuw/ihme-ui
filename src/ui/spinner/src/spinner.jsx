import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { Symbol } from '../../shape';
import { CommonPropTypes, PureComponent } from '../../../utils';

import styles from './spinner.css';

class Spinner extends PureComponent {
  render() {
    const { props } = this;
    return (
      <div
        className={classNames(styles.spinner, {
          [styles['inline-spinner']]: props.inline
        }, props.className)}
        style={props.style}
      >
        <svg className={styles.dot} viewBox="-8 -8 16 16" width="1em" height="1em">
          <Symbol symbolType="circle" fill="black" />
        </svg>
        <svg className={styles.dot} viewBox="-8 -8 16 16" width="1em" height="1em">
          <Symbol symbolType="circle" fill="black" />
        </svg>
        <svg className={styles.dot} viewBox="-8 -8 16 16" width="1em" height="1em">
          <Symbol symbolType="circle" fill="black" />
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
};

export default Spinner;
