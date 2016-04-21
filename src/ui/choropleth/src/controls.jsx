import React, { PropTypes } from 'react';

import style from './controls.css';
import Button from '../../button';

const propTypes = {
  /* click handler for zoom in button */
  onZoomIn: PropTypes.func.isRequired,

  /* click handler for zoom reset button */
  onZoomReset: PropTypes.func.isRequired,

  /* click handler for zoom out button */
  onZoomOut: PropTypes.func.isRequired
};

const defaultProps = {

};

const Controls = (props) => {
  return (
    <div className={style.common}>
      <Button text="in" clickHandler={props.onZoomIn} />
      <Button text="reset" clickHandler={props.onZoomReset} />
      <Button text="out" clickHandler={props.onZoomOut} />
    </div>
  );
};

Controls.propTypes = propTypes;
Controls.defaultProps = defaultProps;

export default Controls;
