import React, { PropTypes } from 'react';

import styles from './controls.css';
import Button from '../../button';

const propTypes = {
  /* click handler for zoom in button */
  onZoomIn: PropTypes.func.isRequired,

  /* click handler for zoom reset button */
  onZoomReset: PropTypes.func.isRequired,

  /* click handler for zoom out button */
  onZoomOut: PropTypes.func.isRequired
};

const Controls = (props) => {
  return (
    <div className={styles.common}>
      <Button className={styles.button} text="+" clickHandler={props.onZoomIn} />
      <Button className={styles.button} text="•" clickHandler={props.onZoomReset} />
      <Button className={styles.button} text="-" clickHandler={props.onZoomOut} />
    </div>
  );
};

Controls.propTypes = propTypes;

export default Controls;
