import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { PureComponent } from '../../../utils';

import { getDimension } from './util';
import style from './style.css';

export default class Fill extends PureComponent {
  static getWidth(width, direction) {
    return direction === 'right' ? `calc(100% - ${getDimension(width)})` : getDimension(width);
  }

  render() {
    return (
      <div
        className={classNames(style.fill, style[this.props.direction])}
        style={{
          width: Fill.getWidth(this.props.width, this.props.direction),
          height: getDimension(this.props.height),
          ...this.props.fillStyle,
        }}
      >
      </div>
    );
  }
}

Fill.propTypes = {
  direction: PropTypes.oneOf(['left', 'right']),
  height: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  width: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  fillStyle: PropTypes.object,
};

Fill.defaultProps = {
  direction: 'left',
  height: '100%',
  width: 200,
  fillStyle: {
    backgroundColor: '#ccc',
  },
};
