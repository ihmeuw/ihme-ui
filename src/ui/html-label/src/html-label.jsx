import React, { PropTypes } from 'react';

import classNames from 'classnames';

import styles from './html-label.css';

const propTypes = {
  children: PropTypes.element,

  /* array of classes to add to label */
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array
  ]),

  clickHandler: PropTypes.func,

  hoverHandler: PropTypes.func,

  /* ID of a labelable form-related element */
  htmlFor: PropTypes.string,

  /* path to image to render within label tag */
  icon: PropTypes.string,

  /* text to render within label tag */
  text: PropTypes.string,

  /* color scheme of component; see html-label.css */
  theme: PropTypes.string
};

const HtmlLabel = props => (
  <label
    className={classNames(styles[props.theme], props.className)}
    htmlFor={props.htmlFor}
    onClick={props.clickHandler}
    onMouseOver={props.hoverHandler}
  >
    {((path) => {
      if (path) return <img alt="" src={path} />;
      return null;
    })(props.icon)}
    {props.text}
    {props.children}
  </label>
);

HtmlLabel.propTypes = propTypes;

export default HtmlLabel;
