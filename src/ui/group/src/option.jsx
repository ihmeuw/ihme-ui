import React, { PropTypes } from 'react';

import classNames from 'classnames';

import Button from '../../button';

import styles from './group.css';

const propTypes = {
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array
  ]),

  clickHandler: PropTypes.func,

  /* apply disabled class styling */
  disabled: PropTypes.bool,

  hoverHandler: PropTypes.func,

  /* path to image to render within label tag */
  icon: PropTypes.string,

  /* apply selected class styling */
  selected: PropTypes.bool,

  /* text to render within label tag */
  text: PropTypes.string,

  /* react element to be wrapped by this option */
  type: PropTypes.any
};

const defaultProps = {
  type: Button
};

const Option = (props) => {
  return React.createElement(
    props.type,
    {
      className: classNames(props.className, {
        [styles.disabled]: props.disabled,
        [styles.selected]: props.selected
      }),
      clickHandler: props.clickHandler,
      disabled: props.disabled,
      hoverHandler: props.hoverHandler,
      icon: props.icon,
      text: props.text
    }
  );
};

Option.propTypes = propTypes;

Option.defaultProps = defaultProps;

export default Option;
