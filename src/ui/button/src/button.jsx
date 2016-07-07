import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { CommonPropTypes, PureComponent, propsChanged, stateFromPropUpdates } from '../../../utils';

import styles from './button.css';
import Spinner from '../../spinner';

export default class Button extends PureComponent {
  constructor(props) {
    super(props);

    this.state = stateFromPropUpdates(Button.propUpdates, {}, props, {});
  }

  componentWillReceiveProps(nextProps) {
    this.setState(stateFromPropUpdates(Button.propUpdates, this.props, nextProps, {}));
  }

  static calculateStyle(props) {
    return {
      ...props.style,
      ...(props.disabled ? props.disabledStyle : {}),
    };
  }

  render() {
    const {
      children,
      className,
      clickHandler,
      disabled,
      disabledClassName,
      icon,
      id,
      name,
      showSpinner,
      text,
      theme,
    } = this.props;
    const {
      style,
    } = this.state;

    return (
      <button
        style={style}
        className={classNames(className, styles[theme], { [disabledClassName]: disabled })}
        disabled={disabled}
        id={id}
        name={name}
        onClick={showSpinner ? null : clickHandler}
        type="button"
      >
        {showSpinner && <Spinner inline size="small" />}
        {!showSpinner && icon && <img className={styles.icon} alt="" src={icon} />}
        {!showSpinner && (children || text)}
      </button>
    );
  }
}

Button.propTypes = {
  /* color scheme of component; see button.css */
  theme: PropTypes.oneOf(['green']),

  className: CommonPropTypes.className,
  style: CommonPropTypes.style,

  disabled: PropTypes.bool,
  disabledClassName: CommonPropTypes.className,
  disabledStyle: CommonPropTypes.style,

  clickHandler: PropTypes.func,

  id: PropTypes.string,

  name: PropTypes.string,

  /* if true, will contain spinner and not render additional content */
  showSpinner: PropTypes.bool,

  /* path to image to render within button tag */
  icon: PropTypes.string,

  /* text to render within button tag */
  text: PropTypes.string,

  children: PropTypes.node,
};

Button.defaultProps = {
  className: styles.common,
  disabledClassName: styles.disabled,
};

Button.propUpdates = {
  style: (state, propName, prevProps, nextProps) => {
    if (propsChanged(prevProps, nextProps, ['style', 'disabled'])) {
      return { ...state, style: Button.calculateStyle(nextProps) };
    }
    return state;
  },
};
