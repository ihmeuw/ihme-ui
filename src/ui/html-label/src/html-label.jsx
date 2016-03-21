import React, { PropTypes } from 'react';
import classNames from 'classnames';

import styles from './html-label.css';

const propTypes = {
  text: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired,
  theme: PropTypes.string,
  htmlFor: PropTypes.string
};

const HtmlLabel = (props) => {
  return (
    <label
      className={classNames({
        [styles[props.theme]]: true
      })}
      htmlFor={props.htmlFor}
    >
      {props.text}
      {props.children}
    </label>
  );
};

HtmlLabel.propTypes = propTypes;

export default HtmlLabel;
