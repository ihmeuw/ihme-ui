import React, { PropTypes } from 'react';
import classNames from 'classnames';

const propTypes = {
  /* array of classes to add to button */
  classes: PropTypes.array,

  id: PropTypes.string,

  name: PropTypes.string,

  disabled: PropTypes.boolean,

  /* text to render within button tag */
  text: PropTypes.string,

  clickHandler: PropTypes.func,
};

const defaultProps = {
  classes: [],
  disabled: false
};

const Button = (props) => {
  return (
    <button
      className={classNames('beaut-btn', ...props.classes)}
      id={props.id}
      type="button"
      name={props.name}
      disabled={props.disabled}
      onClick={props.clickHandler}
    >
      {props.text}
    </button>
  );
};

Button.propTypes = propTypes;
Button.defaultProps = defaultProps;

export default Button;
