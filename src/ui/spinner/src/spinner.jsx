import React, { PropTypes } from 'react';

import styles from './spinner.css';

const propTypes = {
  /* display spinner inline with other elements (e.g., in a button) */
  inline: PropTypes.bool,
  /* how large the dots will be */
  size: PropTypes.oneOf(['small', 'medium', 'large'])
};

const Spinner = (props) => {
  return (
    <div className={props.inline ? styles['inline-spinner'] : styles.spinner}>
      <span className={styles[`${props.size}-dot`]}></span>
      <span className={styles[`${props.size}-dot`]}></span>
      <span className={styles[`${props.size}-dot`]}></span>
    </div>
  );
};

Spinner.propTypes = propTypes;

export default Spinner;
