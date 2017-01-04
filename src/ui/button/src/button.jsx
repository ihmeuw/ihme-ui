import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { CommonPropTypes, PureComponent, propsChanged, stateFromPropUpdates } from '../../../utils';

import styles from './button.css';
import Spinner from '../../spinner';

export default class Button extends PureComponent {
  static calculateStyle(props) {
    return {
      ...props.style,
      ...(props.disabled ? props.disabledStyle : {}),
    };
  }

  constructor(props) {
    super(props);

    this.state = stateFromPropUpdates(Button.propUpdates, {}, props, {});
  }

  componentWillReceiveProps(nextProps) {
    this.setState(stateFromPropUpdates(Button.propUpdates, this.props, nextProps, {}));
  }

  render() {
    const {
      children,
      className,
      disabled,
      disabledClassName,
      icon,
      id,
      name,
      onClick,
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
        className={classNames(styles.common, styles[theme], className, {
          [disabledClassName]: disabled,
        })}
        disabled={disabled}
        id={id}
        name={name}
        onClick={showSpinner ? null : onClick}
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
  className: CommonPropTypes.className,

  disabled: PropTypes.bool,

  /* className to apply when disabled */
  disabledClassName: CommonPropTypes.className,

  /* inline styles to apply when disabled */
  disabledStyle: CommonPropTypes.style,

  /* path to image to render within button tag */
  icon: PropTypes.string,

  id: PropTypes.string,

  name: PropTypes.string,

  onClick: PropTypes.func,

  /* if true, will contain spinner and not render additional content */
  showSpinner: PropTypes.bool,

  style: PropTypes.object,

  /* text to render within button tag */
  text: PropTypes.string,

  /* color scheme of component; see button.css */
  theme: PropTypes.oneOf(['green']),
};

Button.defaultProps = {
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
