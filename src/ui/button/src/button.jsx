import React, { PropTypes } from 'react';

import classNames from 'classnames';

import styles from './button.css';
import Spinner from '../../spinner';

const propTypes = {
  /* array of classes to add to button */
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array
  ]),

  clickHandler: PropTypes.func,

  disabled: PropTypes.bool,

  /* path to image to render within button tag */
  icon: PropTypes.string,

  id: PropTypes.string,

  name: PropTypes.string,

  /* if true, will contain spinner */
  showSpinner: PropTypes.bool,

  /* text to render within button tag */
  text: PropTypes.string,

  /* color scheme of component; see button.css */
  theme: PropTypes.oneOf(['dark', 'light'])
};

const defaultProps = {
  disabled: false
};

const getContent = (showSpinner, iconPath) => {
  if (showSpinner) return <Spinner size="small" />;
  if (iconPath) return <img src={iconPath} />;
  return null;
};

const Button = (props) => {
  return (
    <button
      className={classNames(props.className, styles[props.theme], {
        [styles.disabled]: props.disabled
      })}
      disabled={props.disabled}
      id={props.id}
      name={props.name}
      onClick={props.clickHandler}
      type="button"
    >
      {getContent(props.showSpinner, props.icon)}
      {props.text}
    </button>
  );
};

Button.propTypes = propTypes;

Button.defaultProps = defaultProps;

export default Button;
