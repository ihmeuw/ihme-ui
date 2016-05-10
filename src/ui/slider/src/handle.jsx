import React, { PropTypes } from 'react';
import classNames from 'classnames';
import interact from 'interact.js';
import { bindAll } from 'lodash';

import style from './style.css';

const propTypes = {
  direction: PropTypes.oneOf(['left', 'right', 'middle']),
  position: PropTypes.number.isRequired,
  text: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  name: PropTypes.string.isRequired,
  onMove: PropTypes.func.isRequired,
  onEnd: PropTypes.func.isRequired,
  snapTarget: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.object
  ]).isRequired
};

const defaultProps = {
  direction: 'middle'
};

function getSnapTargetFunc(snapTarget, snapGridArgs = {}) {
  if (typeof snapTarget === 'function') {
    return snapTarget;
  } else if (typeof snapTarget === 'object') {
    return interact.createSnapGrid({
      ...snapGridArgs,
      ...snapTarget
    });
  }
  return null;
}

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

    bindAll(this, ['bindInteract']);
  }

  bindInteract(ref) {
    this.offset = getOffset(this.props.direction, ref.getBoundingClientRect().width);

    interact(ref)
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
      .on('dragmove', this.props.onMove(this.props.name, -this.offset))
      .on('dragend', this.props.onEnd(this.props.name));
  }

  render() {
    return (
      <div
        className={ classNames(style.flag, style[this.props.direction]) }
        style={ { left: `${this.props.position}px` } }
        ref={ this.bindInteract }
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
