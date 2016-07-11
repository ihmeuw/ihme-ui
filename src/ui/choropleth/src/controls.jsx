import React, { PropTypes } from 'react';
import classNames from 'classnames';

import style from './controls.css';
import Button from '../../button';

const Controls = (props) => {
  return (
    <div className={classNames(style.common, props.className)} style={props.style}>
      <Button
        className={classNames(style.button, props.buttonClassName)}
        onClick={props.onZoomIn}
        style={props.buttonStyle}
        text="+"
      />
      <Button
        className={classNames(style.button, props.buttonClassName)}
        onClick={props.onZoomReset}
        style={props.buttonStyle}
        text="•"
      />
      <Button
        className={classNames(style.button, props.buttonClassName)}
        onClick={props.onZoomOut}
        style={props.buttonStyle}
        text="-"
      />
    </div>
  );
};

Controls.propTypes = {
  /* click handler for zoom in button */
  onZoomIn: PropTypes.func.isRequired,

  /* click handler for zoom reset button */
  onZoomReset: PropTypes.func.isRequired,

  /* click handler for zoom out button */
  onZoomOut: PropTypes.func.isRequired,

  /* class name to add to rendered components */
  className: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
  ]),
  buttonClassName: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
  ]),

  /* style to apply to rendered components */
  style: PropTypes.object,
  buttonStyle: PropTypes.object,
};

export default Controls;
