import React, { PropTypes } from 'react';
import classNames from 'classnames';
import memoize from 'lodash/memoize';
import { CommonPropTypes, eventHandleWrapper, PureComponent } from '../../../utils';

import styles from './option.css';

/**
 * `import Group from 'ihme-ui/ui/group'`
 *
 *
 * A wrapper to group elements, both visually and functionally. Its primary use case is as a buttonset,
 * which can be accomplished by wrapping `<Option />` components (or similar, customized components) in a `<Group />`.
 *
 * If providing a custom component instead of using `<Option />`, component must accept an identifying `value` prop.
 */
export default class Group extends PureComponent {
  static onClickWrapper(optionValue, onClick) {
    return eventHandleWrapper(onClick, optionValue);
  }

  constructor(props) {
    super(props);

    this.wrappedOnClick = memoize(Group.onClickWrapper);
  }

  render() {
    const { children, className, onClick, style } = this.props;
    const numOptions = React.Children.count(children);

    return (
      <div className={classNames(className)} style={style}>
        {
          React.Children.map(children, (child, index) => {
            const childProps = {
              className: classNames(styles.option, {
                [styles.first]: index === 0,
                [styles.last]: index === numOptions - 1,
              }, child.props.className),
              onClick: this.wrappedOnClick(child.props.value, onClick),
            };

            return React.cloneElement(child, childProps);
          })
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
   * signature: function(event, selectedValue) {...}
   */
  onClick: PropTypes.func.isRequired,

  /**
   * inline styles applied to outermost wrapping div
   */
  style: CommonPropTypes.style,
};

Group.defaultProps = {
  className: styles.group,
};
