import React, { PropTypes } from 'react';

import style from './controls.css';
import Button from '../../button';

const Controls = (props) => {
  return (
    <div className={style.common}>
      <Button className={style.button} text="+" clickHandler={props.onZoomIn} />
      <Button className={style.button} text="•" clickHandler={props.onZoomReset} />
      <Button className={style.button} text="-" clickHandler={props.onZoomOut} />
    </div>
  );
};

Controls.propTypes = {
  /* click handler for zoom in button */
  onZoomIn: PropTypes.func.isRequired,

  /* click handler for zoom reset button */
  onZoomReset: PropTypes.func.isRequired,

  /* click handler for zoom out button */
  onZoomOut: PropTypes.func.isRequired
};

export default Controls;
