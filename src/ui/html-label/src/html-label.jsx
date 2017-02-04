import React, { PropTypes } from 'react';
import classNames from 'classnames';

import { CommonPropTypes } from '../../../utils/props';
import styles from './html-label.css';

/**
 * `import HtmlLabel from 'ihme-ui/ui/html-label'`
 *
 * An HTML `<label>` to wrap interactive content.
 */
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

  /**
   * className applied to `<label>`
   */
  className: CommonPropTypes.className,

  /**
   * ID of a labelable element; useful if label does not contain its control.
   * See [https://www.w3.org/TR/html5/forms.html#attr-label-for](https://www.w3.org/TR/html5/forms.html#attr-label-for).
   */
  htmlFor: PropTypes.string,

  /**
   * path to image to render within label tag
   */
  icon: PropTypes.string,

  /**
   * signature: function(SyntheticEvent) {...}
   */
  onClick: PropTypes.func,

  /**
   * signature: function(SyntheticEvent) {...}
   */
  onMouseOver: PropTypes.func,

  /**
   * text to render within label tag
   */
  text: PropTypes.string,

  /**
   * one of: 'dark' (`color: white`), 'light' (`color: black`)
   */
  theme: PropTypes.oneOf(['dark', 'light']),
};

HtmlLabel.defaultProps = {
  theme: 'light',
};

export default HtmlLabel;
