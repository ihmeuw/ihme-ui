import React, { PropTypes } from 'react';
import classNames from 'classnames';

import { CommonPropTypes } from '../../../utils/props';
import styles from './html-label.css';

const HtmlLabel = (props) => {
  return (
    <label
      className={classNames(styles[props.theme], props.className)}
      htmlFor={props.htmlFor}
      onClick={props.onClick}
      onMouseOver={props.onMouseOver}
    >
      {props.icon && <img alt="" src={props.icon} />}
      {props.text}
      {props.children}
    </label>
  );
};

HtmlLabel.propTypes = {
  children: PropTypes.element,

  /* array of classes to add to label */
  className: CommonPropTypes.className,

  /* ID of a labelable form-related element */
  htmlFor: PropTypes.string,

  /* path to image to render within label tag */
  icon: PropTypes.string,

  onClick: PropTypes.func,

  onMouseOver: PropTypes.func,

  /* text to render within label tag */
  text: PropTypes.string,

  /* color scheme of component; see html-label.css */
  theme: PropTypes.oneOf(['dark', 'light']),
};

HtmlLabel.defaultProps = {
  theme: 'light',
};

export default HtmlLabel;
