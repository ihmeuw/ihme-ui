import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { ReactComponent as ArrowsToCircle } from '../../../resources/arrows-to-circle.svg';
import { ReactComponent as Plus } from '../../../resources/plus.svg';
import { ReactComponent as Minus } from '../../../resources/minus.svg';

import style from './controls.css';
import Button from '../../button';
import { CommonPropTypes } from '../../../utils';

export default function Controls(props) {
  return (
    <div className={classNames(style.wrapper, props.className)} style={props.style}>
      <div className={classNames(style['inner-wrapper'])}>
        <span className={classNames(style.title)}>Zoom</span>
        <Button
          ariaLabel="Zoom in"
          className={classNames(style.button, props.buttonClassName, style.control)}
          onClick={props.onZoomIn}
          style={props.buttonStyle}
        >
          <Plus className={classNames(style.icon)} />
        </ Button>
        <Button
          ariaLabel="Zoom out"
          className={classNames(style.button, props.buttonClassName, style.control)}
          onClick={props.onZoomOut}
          style={props.buttonStyle}
        >
          <Minus className={classNames(style.icon)} />
        </Button>
        <Button
          ariaLabel="Default zoom level"
          className={classNames(style.button, props.buttonClassName, style.control, style.reset)}
          onClick={props.onZoomReset}
          style={props.buttonStyle}
        >
          <ArrowsToCircle className={classNames(style.icon)} />
          <span className={classNames(style.label)}>Reset</span>
        </Button>
      </div>
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
