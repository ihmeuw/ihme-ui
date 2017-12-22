import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { Button, Shape } from '../..';

const SVG_STYLE = {
  height: '100%',
  width: '1em',
};

const TEXT_STYLE = {
  margin: 0,
};

export default function CustomOptionType(props) {
  return (
    <Button
      className={classNames(props.className)}
      disabled={props.disabled}
      onClick={props.onClick}
      selected={props.selected}
    >
      <svg style={SVG_STYLE}>
        <g>
          <Shape
            shapeType="diamond"
            translateX={8}
            translateY={8}
          />
        </g>
      </svg>
      <p style={TEXT_STYLE}>{props.text}</p>
    </Button>
  );
}

CustomOptionType.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  selected: PropTypes.bool,
  style: PropTypes.object,
};
