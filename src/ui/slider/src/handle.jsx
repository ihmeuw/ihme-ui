import React, { PropTypes } from 'react';
import classNames from 'classnames';

import style from './style.css';

const propTypes = {
  direction: PropTypes.oneOf(['left', 'right', 'middle']),
  percentage: PropTypes.number.isRequired,
  text: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  name: PropTypes.string.isRequired,
  onMove: PropTypes.func.isRequired
};

const defaultProps = {
  direction: 'middle'
};

export default class Handle extends React.Component {
  get offset() {
    if (this.props.direction === 'left') {
      return -Math.round(this.refs.handle.getBoundingClientRect().width / 2);
    } else if (this.props.direction === 'right') {
      return Math.round(this.refs.handle.getBoundingClientRect().width / 2);
    }
    return 0;
  }

  render() {
    return (
      <div
        className={ classNames(style.flag, style[this.props.direction]) }
        style={ { left: `${this.props.percentage * 100}%` } }
        ref="handle"
      >
        <span>
          { this.props.text }
        </span>
      </div>
    );
  }
}

Handle.propTypes = propTypes;

Handle.defaultProps = defaultProps;
