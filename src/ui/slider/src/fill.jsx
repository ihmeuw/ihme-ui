import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { CommonPropTypes, PureComponent } from '../../../utils';

import { getDimension } from './util';
import styles from './slider.css';

export default class Fill extends PureComponent {
  static getWidth(width, direction) {
    return direction === 'right' ? `calc(100% - ${getDimension(width)})` : getDimension(width);
  }

  render() {
    const {
      className,
      direction,
      height,
      style,
      width,
    } = this.props;

    return (
      <div
        className={classNames(styles.fill, styles[direction], className)}
        style={{
          ...style,
          width: Fill.getWidth(width, direction),
          height: getDimension(height),
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
  width: 200,
};
