import React, { PropTypes } from 'react';
import classNames from 'classnames';
import memoize from 'lodash/memoize';
import noop from 'lodash/noop';

import {
  CommonPropTypes,
  propResolver,
  PureComponent,
} from '../../../utils';

/**
 * `import { Group } from 'ihme-ui'`
 *
 *
 * A wrapper to group elements. Its primary use case is as a buttonset, which can be accomplished
 * by wrapping `<Option />` components (or similar, customized components) in a `<Group />`.
 *
 */
export default class Group extends PureComponent {
  constructor(props) {
    super(props);

    this.memoizedOnClick = memoize(this.onOptionClick.bind(this));
  }

  onOptionClick(value, cb, instance) {
    return event => cb(event, value, instance);
  }

  render() {
    const {
      children,
      className,
      onClick,
      optionValueProp,
      style,
    } = this.props;

    return (
      <div className={classNames(className)} style={style}>
        {
          React.Children.map(children, child =>
            React.cloneElement(child, {
              onClick: this.memoizedOnClick(
                propResolver(child.props, optionValueProp),
                child.props.onClick || onClick,
                child
              ),
            })
          )
        }
      </div>
    );
  }
}

Group.propTypes = {
  children: PropTypes.node.isRequired,

  /**
   * className applied to outermost wrapping div
   */
  className: CommonPropTypes.className,

  /**
   * onClick callback passed to each child
   * implicitly depends on child components having a `value` prop
   * signature: (SyntheticEvent, selectedValue, optionInstance) {...}
   */
  onClick: PropTypes.func,

  /**
   * Prop passed to `<Option />` to include in onClick handler
   * If function, passed Option.props as input.
   * Otherwise, uses object access to pull value off Option.props.
   * E.g., if every `<Option />` is provided a `value` prop that uniquely identifies that option,
   * set `optionValueProp="value"` to include that value in the onClick handler.
   */
  optionValueProp: CommonPropTypes.dataAccessor,

  /**
   * inline styles applied to outermost wrapping div
   */
  style: CommonPropTypes.style,
};

Group.defaultProps = {
  onClick: noop,
  optionValueProp: 'value',
};
