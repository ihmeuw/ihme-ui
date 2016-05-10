import React, { PropTypes } from 'react';
import classNames from 'classnames';
import interact from 'interact.js';
import { identity } from 'lodash';

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
  onEnd: PropTypes.func.isRequired,
  snapTarget: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.object
  ]).isRequired
};

const defaultProps = {
  direction: 'middle',
  labelFunc: identity
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
  }

  componentDidMount() {
    const { handle } = this.refs;

    this.offset = getOffset(this.props.direction, handle.getBoundingClientRect().width);

    this._interactable = interact(handle)
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

  componentWillUnmount() {
    this._interactable.unset();
  }

  render() {
    return (
      <div
        className={ classNames(style.flag, style[this.props.direction]) }
        style={ { left: `${this.props.position}px` } }
        ref="handle"
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
