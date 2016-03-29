import React, { PropTypes } from 'react';

import classNames from 'classnames';

import styles from './group.css';


const propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired,

  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array
  ]),

  /* function with following signature: function({ value }) */
  clickHandler: PropTypes.func,

  disabledItems: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.number),
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.number,
    PropTypes.string
  ]),

  hoverHandler: PropTypes.func,

  selectedItems: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.number),
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.number,
    PropTypes.string
  ]),

  theme: PropTypes.oneOf(['dark', 'light', 'common'])
};

const defaultProps = {
  theme: 'common'
};


const Group = (props) => {
  const { children, className, theme } = props;

  const wrappedClickHandler = (wrappedProps) => {
    return () => {
      props.clickHandler(wrappedProps);
    };
  };

  return (
    <div className={classNames(className, styles.group)}>
      {
        React.Children.map(children, (child) => {
          const childProps = {
            className: classNames(styles.option, child.props.className, styles[theme], className),
            clickHandler: wrappedClickHandler({ value: child.props.value })
          };

          return React.cloneElement(child, childProps);
        })
      }
    </div>
  );
};

Group.propTypes = propTypes;

Group.defaultProps = defaultProps;

export default Group;
