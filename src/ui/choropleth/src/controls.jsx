import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import style from './controls.css';
import Button from '../../button';
import { CommonPropTypes } from '../../../utils';

export default function Controls(props) {
  return (
    <div className={classNames(style.wrapper, props.className)} style={props.style}>
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
}

Controls.propTypes = {
  /* classname to add to each button */
  buttonClassName: CommonPropTypes.className,

  buttonStyle: PropTypes.object,

  /* classname to add to wrapper */
  className: CommonPropTypes.className,

  /* click handler for zoom in button */
  onZoomIn: PropTypes.func.isRequired,

  /* click handler for zoom reset button */
  onZoomReset: PropTypes.func.isRequired,

  /* click handler for zoom out button */
  onZoomOut: PropTypes.func.isRequired,

  /* inline styles to apply to wrapper */
  style: PropTypes.object,
};
