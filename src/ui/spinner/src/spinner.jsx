import React, { PropTypes } from 'react';
import classNames from 'classnames';

import styles from './spinner.css';

const propTypes = {
  /* display spinner inline with other elements (e.g., in a button) */
  inline: PropTypes.bool,

  /* how large the dots will be */
  size: PropTypes.oneOf(['small', 'medium', 'large']),

  /* an extra classname */
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
    PropTypes.object
  ])
};

const Spinner = (props) => {
  return (
    <div
      className={classNames(styles.spinner, {
        [styles['inline-spinner']]: props.inline
      }, props.className)}
    >
      <span className={styles[`${props.size}-dot`]}></span>
      <span className={styles[`${props.size}-dot`]}></span>
      <span className={styles[`${props.size}-dot`]}></span>
    </div>
  );
};

Spinner.propTypes = propTypes;

export default Spinner;
