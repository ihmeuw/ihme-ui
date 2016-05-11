import React, { PropTypes } from 'react';
import classNames from 'classnames';
import interact from 'interact.js';
import { identity } from 'lodash';

import { getDimension, getSnapTargetFunc } from './util';

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
  ]).isRequired,
  className: PropTypes.string
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

    this.handleRef = this.handleRef.bind(this);
  }

  componentDidMount() {
    this.bindInteract(this.props.snapTarget);
  }

  componentWillReceiveProps(newProps) {
    if (this.props.snapTarget !== newProps.snapTarget) {
      if (this._interactable) this._interactable.unset();
      this.bindInteract(newProps.snapTarget);
    }
  }

  componentWillUnmount() {
    this._interactable.unset();
  }

  bindInteract(snapTarget) {
    const offset = getOffset(this.props.direction, this._handle.getBoundingClientRect().width);

    this._interactable = interact(this._handle)
      .origin('parent')
      .draggable({
        max: Infinity,
        snap: {
          targets: [getSnapTargetFunc(snapTarget, {
            range: Infinity,
            offset: { x: offset }
          })]
        }
      })
      .styleCursor(false)
      .on('dragmove', this.props.onMove(this.props.name, -offset));
  }

  handleRef(ref) {
    this._handle = ref;
  }

  render() {
    return (
      <div
        className={ classNames(this.props.className, style.flag, style[this.props.direction]) }
        style={ { left: getDimension(this.props.position) } }
        ref={ this.handleRef }
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
