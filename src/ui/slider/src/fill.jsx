import React, { PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import classNames from 'classnames';

import { getDimension } from './util';
import style from './style.css';

export default class Fill extends React.Component {
  static getWidth(width, direction) {
    return direction === 'right' ? `calc(100% - ${getDimension(width)})` : getDimension(width);
  }

  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
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
