import React, { PropTypes } from 'react';
import classNames from 'classnames';
import interact from 'interact.js';
import { identity } from 'lodash';

import { getSnapTargetFunc } from './util';

import style from './style.css';

const propTypes = {
  direction: PropTypes.oneOf(['left', 'right', 'middle']),
  position: PropTypes.number.isRequired,
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  labelFunc: PropTypes.func,
  name: PropTypes.string.isRequired,
  onMove: PropTypes.func.isRequired,
  snapTarget: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.object
  ]).isRequired
};

const defaultProps = {
  direction: 'middle',
  labelFunc: identity
};

function getOffset(direction, width) {
  if (direction === 'left') {
    return -Math.round(width / 2);
  } else if (direction === 'right') {
    return Math.round(width / 2);
  }
  return 0;
}

export default class Handle extends React.Component {
  constructor(props) {
    super(props);

    this.offset = 0;

    this.bindInteract = this.bindInteract.bind(this);
  }

  bindInteract(ref) {
    if (!ref) {
      this._interactable.unset();
      return;
    }

    this.offset = getOffset(this.props.direction, ref.getBoundingClientRect().width);

    this._interactable = interact(ref)
      .origin('parent')
      .draggable({
        max: Infinity,
        snap: {
          targets: [getSnapTargetFunc(this.props.snapTarget, {
            range: Infinity,
            offset: { x: this.offset }
          })]
        }
      })
      .styleCursor(false)
      .on('dragmove', this.props.onMove(this.props.name, -this.offset));
  }

  render() {
    return (
      <div
        className={ classNames(style.flag, style[this.props.direction]) }
        style={ { left: `${this.props.position}px` } }
        ref={ this.bindInteract }
      >
        <span>
          { this.props.labelFunc(this.props.label) }
        </span>
      </div>
    );
  }
}

Handle.propTypes = propTypes;

Handle.defaultProps = defaultProps;
