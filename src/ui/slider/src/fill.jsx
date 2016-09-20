import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { CommonPropTypes, PureComponent } from '../../../utils';

import { getDimension } from './util';
import style from './style.css';

export default class Fill extends PureComponent {
  static getWidth(width, direction) {
    return direction === 'right' ? `calc(100% - ${getDimension(width)})` : getDimension(width);
  }

  render() {
    return (
      <div
        className={classNames(style.fill, style[this.props.direction], this.props.className)}
        style={{
          width: Fill.getWidth(this.props.width, this.props.direction),
          height: getDimension(this.props.height),
          ...this.props.style,
        }}
      >
      </div>
    );
  }
}

Fill.propTypes = {
  className: CommonPropTypes.className,
  direction: PropTypes.oneOf(['left', 'right']),
  height: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  style: PropTypes.object,
  width: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
};

Fill.defaultProps = {
  direction: 'left',
  height: '100%',
  style: {
    backgroundColor: '#ccc',
  },
  width: 200,
};
