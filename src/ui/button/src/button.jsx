import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import assign from 'lodash/assign';

import {
  CommonPropTypes,
  combineStyles,
  memoizeByLastCall,
  propsChanged,
  stateFromPropUpdates,
} from '../../../utils';

import styles from './button.css';
import LoadingIndicator from '../../loading-indicator';

/**
 * `import { Button } from 'ihme-ui'`
 */
export default class Button extends React.PureComponent {
  constructor(props) {
    super(props);

    this.combineStyles = memoizeByLastCall(combineStyles);
    this.iconCombineStyles = memoizeByLastCall(combineStyles);
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
      iconClassName,
      id,
      name,
      onClick,
      showSpinner,
      text,
      theme,
    } = this.props;
    const {
      iconStyleList,
      styleList,
    } = this.state;

    return (
      <button
        style={this.combineStyles(styleList)}
        className={classNames(styles.common, styles[theme], className, {
          [disabledClassName]: disabled,
        })}
        disabled={disabled}
        id={id}
        name={name}
        onClick={onClick}
        type="button"
      >
        {showSpinner && <LoadingIndicator inline />}
        {
          !showSpinner
          && icon
          && <img
            className={classNames(styles.icon, iconClassName)}
            alt=""
            src={icon}
            style={this.iconCombineStyles(iconStyleList)}
          />
        }
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
   * set button as disabled
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
   * className applied to icon
   */
  iconClassName: CommonPropTypes.className,

  /**
   * inline styles to apply to icon
   */
  iconStyle: CommonPropTypes.style,

  /**
   * id value for button
   */
  id: PropTypes.string,

  /**
   * [name of button](https://www.w3.org/TR/2011/WD-html5-20110525/association-of-controls-and-forms.html#attr-fe-name)
   */
  name: PropTypes.string,

  /**
   * executed on click;
   * signature: function(SyntheticEvent) {...}
   */
  onClick: PropTypes.func,

  /**
   * display a loading indicator
   */
  showSpinner: PropTypes.bool,

  /**
   * inline styles to apply to button
   */
  style: CommonPropTypes.style,

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
  // update style if disabled, disabledStyle, or style have changed
  styleList: (accum, propName, prevProps, nextProps) => {
    const propsToCheck = [
      'disabled',
      'disabledStyle',
      'style',
    ];
    if (!propsChanged(prevProps, nextProps, propsToCheck)) return accum;

    const styleList = [nextProps.style];

    if (nextProps.disabled) {
      styleList.push(nextProps.disabledStyle);
    }

    return assign({}, accum, {
      styleList,
    });
  },
  // update iconStyleList if icon or iconStyle have changed
  iconStyleList: (accum, propName, prevProps, nextProps) => {
    const propsToCheck = [
      'icon',
      'iconStyle',
    ];
    if (!propsChanged(prevProps, nextProps, propsToCheck)) return accum;

    return assign({}, accum, {
      iconStyleList: [nextProps.iconStyle],
    });
  },
};
