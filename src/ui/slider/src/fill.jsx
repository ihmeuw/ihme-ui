import React, { PropTypes } from 'react';
import classNames from 'classnames';

import { getDimension } from './util';
import style from './style.css';

function getWidth(props) {
  const width = getDimension(props.width);
  if (props.direction === 'right') {
    return `calc(100% - ${width})`;
  }
  return width;
}

export default function Fill(props) {
  return (
    <div
      className={classNames(style.fill, style[props.direction])}
      style={{
        height: getDimension(props.height),
        width: getWidth(props),
        ...props.fillStyle,
      }}
    >
    </div>
  );
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
