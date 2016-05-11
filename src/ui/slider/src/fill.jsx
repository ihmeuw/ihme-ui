import React, { PropTypes } from 'react';
import classNames from 'classnames';

import { getDimension } from './util';

import style from './style.css';

const propTypes = {
  direction: PropTypes.oneOf(['left', 'right']),
  height: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  width: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  fillStyle: PropTypes.object
};

const defaultProps = {
  direction: 'left',
  height: '100%',
  width: 200,
  fillStyle: {
    backgroundColor: '#ccc'
  }
};

function getWidth(props) {
  const width = getDimension(props.width);
  if (props.direction === 'right') {
    return `calc(100% - ${width})`;
  }
  return width;
}

class Fill extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { props } = this;

    return (
      <div
        className={ classNames(style.fill, style[props.direction]) }
        style={ {
          height: getDimension(props.height),
          width: getWidth(props),
          ...props.fillStyle
        } }
      >
      </div>
    );
  }
}

Fill.propTypes = propTypes;

Fill.defaultProps = defaultProps;

export default Fill;
