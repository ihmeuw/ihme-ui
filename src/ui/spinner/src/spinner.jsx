import React, { PropTypes } from 'react';
import classNames from 'classnames';

import styles from './spinner.css';

const propTypes = {
  /* how large the dots will be */
  size: PropTypes.oneOf(['small', 'medium', 'large'])
};

const Spinner = (props) => {
  return (
    <div className={classNames(styles.spinner)}>
      <span className={classNames(styles[`${props.size}-dot`])}></span>
      <span className={classNames(styles[`${props.size}-dot`])}></span>
      <span className={classNames(styles[`${props.size}-dot`])}></span>
    </div>
  );
};

Spinner.propTypes = propTypes;

export default Spinner;
