import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import assign from 'lodash/assign';
import omit from 'lodash/omit';

import {
  combineStyles,
  CommonPropTypes,
  memoizeByLastCall,
  PureComponent,
  propsChanged,
  stateFromPropUpdates,
} from '../../../utils';
import Button from '../../button';
import styles from './option.css';

/**
 * `import { Option } from 'ihme-ui'`
 *
 *
 * Component designed to be wrapped by `<Group />`. Renders `props.type` and provides it with computed props `className`, `disabled`, `selected`, and `style`.
 * Any additional props passed to `<Option />` will be passed directly to the rendered component.
 */
export default class Option extends PureComponent {
  constructor(props) {
    super(props);

    this.combineStyles = memoizeByLastCall(combineStyles);
    this.state = stateFromPropUpdates(Option.propUpdates, {}, props, {});
  }

  componentWillReceiveProps(nextProps) {
    this.setState(stateFromPropUpdates(Option.propUpdates, this.props, nextProps, {}));
  }

  render() {
    const {
      className,
      disabled,
      disabledClassName,
      selected,
      selectedClassName,
      type,
    } = this.props;

    const {
      style,
    } = this.state;

    return React.createElement(
      type,
      {
        className: classNames(className, {
          [selectedClassName]: selected,
          [disabledClassName]: disabled,
        }),
        disabled,
        selected,
        style: this.combineStyles(style),
        ...omit(this.props, Object.keys(Option.propTypes)),
      }
    );
  }
}

Option.propTypes = {
  /**
   * combined with `disabledClassName` and `selectedClassName` (if applicable) and passed to rendered component as `className`
   */
  className: CommonPropTypes.className,

  /**
   * whether option is disabled
   */
  disabled: PropTypes.bool,

  /**
   * className applied when disabled
   */
  disabledClassName: CommonPropTypes.className,

  /**
   * inline style applied when disabled
   */
  disabledStyle: CommonPropTypes.style,

  /**
   * whether option is selected
   */
  selected: PropTypes.bool,

  /**
   * className applied when selected
   */
  selectedClassName: CommonPropTypes.className,

  /**
   * inline style applied when selected
   */
  selectedStyle: CommonPropTypes.style,

  /**
   * inline styles
   */
  style: CommonPropTypes.style,

  /**
   * tag name (JSX primitive) or React component to be rendered
   * defaults to [`<Button />`](https://github.com/ihmeuw/ihme-ui/blob/master/src/ui/button/src/button.jsx)
   */
  type: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
  ]),
};

Option.defaultProps = {
  className: styles.option,
  disabledClassName: styles.disabled,
  selectedClassName: styles.selected,
  type: Button,
};

Option.propUpdates = {
  style: (state, propName, prevProps, nextProps) => {
    const propsToCheck = [
      'style',
      'selected',
      'selectedStyle',
      'disabled',
      'disabledStyle',
    ];

    if (!propsChanged(prevProps, nextProps, propsToCheck)) {
      return state;
    }

    const style = [nextProps.style];

    if (nextProps.selected) {
      style.push(nextProps.selectedStyle);
    }

    if (nextProps.disabled) {
      style.push(nextProps.disabledStyle);
    }

    return assign({}, state, {
      style,
    });
  },
};
