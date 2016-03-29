import React, { PropTypes } from 'react';
import classNames from 'classnames';

import styles from './button.css';
import Spinner from '../../spinner';

const propTypes = {
  /* array of classes to add to button */
  classes: PropTypes.array,

  /* color scheme of component; see button.css */
  theme: PropTypes.oneOf(['dark', 'light']),

  id: PropTypes.string,

  name: PropTypes.string,

  disabled: PropTypes.bool,

  /* text to render within button tag */
  text: PropTypes.string,

  /* path to image to render within button tag */
  icon: PropTypes.string,

  /* if true, will contain spinner */
  showSpinner: PropTypes.bool,

  clickHandler: PropTypes.func
};

const defaultProps = {
  classes: [],
  disabled: false,
  theme: 'light'
};

const getButtonContent = (showSpinner, iconPath) => {
  if (showSpinner) return <Spinner size="small" />;
  if (iconPath) return <img src={iconPath} />;
  return null;
};

const Button = (props) => {
  const {
    disabled,
    classes,
    id,
    name,
    clickHandler,
    text,
    showSpinner,
    icon,
    theme
  } = props;

  return (
    <button
      className={classNames({
        [styles[props.theme]]: true,
        [styles.disabled]: disabled
      }, ...classes)}
      id={id}
      type="button"
      name={name}
      disabled={disabled}
      onClick={clickHandler}
    >
      {getButtonContent(showSpinner, icon)}
      {text}
    </button>
  );
};

Button.propTypes = propTypes;
Button.defaultProps = defaultProps;

export default Button;
