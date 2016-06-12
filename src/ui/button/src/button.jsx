import React, { PropTypes } from 'react';

import classNames from 'classnames';

import styles from './button.css';
import Spinner from '../../spinner';

const propTypes = {
  /* additional class names to add to button */
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array
  ]),

  /* additional style to add to button */
  style: PropTypes.object,

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
  theme: PropTypes.oneOf(['green']),
};

const defaultProps = {
  disabled: false
};

const getContent = (showSpinner, iconPath) => {
  if (showSpinner) return <Spinner inline size="small" />;
  if (iconPath) return <img className={styles.icon} alt="" src={iconPath} />;
  return null;
};

const Button = (props) => {
  const clickHandler = props.showSpinner ? null : props.clickHandler;
  return (
    <button
      style={props.style}
      className={classNames(styles.common,
                            styles[props.theme],
                            { [styles.disabled]: props.disabled },
                            props.className)}
      disabled={props.disabled}
      id={props.id}
      name={props.name}
      onClick={clickHandler}
      type="button"
    >
      {getContent(props.showSpinner, props.icon)}
      {!props.showSpinner ? <span>{props.text}</span> : null}
    </button>
  );
};

Button.propTypes = propTypes;

Button.defaultProps = defaultProps;

export default Button;
