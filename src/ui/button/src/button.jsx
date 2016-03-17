import React, { PropTypes } from 'react';
import classNames from 'classnames';

import styles from './button.css';
import HtmlLabel from '../../html-label';

const propTypes = {
  /* array of classes to add to button */
  classes: PropTypes.array,

  /* color scheme of component; see button.css */
  theme: PropTypes.oneOf(['dark', 'light']),

  /* a label to include for the button */
  label: PropTypes.string,

  id: PropTypes.string,

  name: PropTypes.string,

  disabled: PropTypes.bool,

  /* text to render within button tag */
  text: PropTypes.string,

  clickHandler: PropTypes.func,
};

const defaultProps = {
  classes: [],
  disabled: false,
  theme: 'light'
};

const Button = (props) => {
  const {
    disabled,
    classes,
    id,
    name,
    clickHandler,
    text,
    label,
    theme
  } = props;

  const button = (
    <button
      className={classNames({
        [styles[props.theme]]: true,
        [styles.labeled]: props.label,
        [styles.disabled]: disabled
      }, ...classes)}
      id={id}
      type="button"
      name={name}
      disabled={disabled}
      onClick={clickHandler}
    >
      {text}
    </button>
  );

  if (!label) return button;
  return (
    <HtmlLabel
      text={label}
      theme={theme}
      htmlFor={id}
    >
      {button}
    </HtmlLabel>
  );
};

Button.propTypes = propTypes;
Button.defaultProps = defaultProps;

export default Button;
