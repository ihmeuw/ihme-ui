import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { CommonPropTypes, PureComponent, propsChanged, stateFromPropUpdates } from '../../../utils';

import styles from './button.css';
import Spinner from '../../spinner';

/**
 * `import Button from 'ihme-ui/ui/button'`
 */
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
  /**
   * className applied to button
   */
  className: CommonPropTypes.className,

  /**
   * boolean value to set button as disabled
   */
  disabled: PropTypes.bool,

  /**
   * className applied to button when disabled
   */
  disabledClassName: CommonPropTypes.className,

  /**
   * inline styles to apply to outermost svg element when disabled
   */
  disabledStyle: CommonPropTypes.style,

  /**
   * path to image to render within button tag
   */
  icon: PropTypes.string,

  /**
   * id value for button
   */
  id: PropTypes.string,

  /**
   * [name of button](https://www.w3.org/TR/2011/WD-html5-20110525/association-of-controls-and-forms.html#attr-fe-name)
   */
  name: PropTypes.string,

  /**
   * function to be executed on click;
   * signature: function(SyntheticEvent) {...}
   */
  onClick: PropTypes.func,

  /**
   * boolean value to display a loading spinner
   */
  showSpinner: PropTypes.bool,

  /**
   * inline styles to apply to button
   */
  style: PropTypes.object,

  /**
   * text to render within button tag
   */
  text: PropTypes.string,

  /**
   * color scheme of component (see button.css)
   */
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
