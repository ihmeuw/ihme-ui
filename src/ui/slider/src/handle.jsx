import React, { PropTypes } from 'react';
import classNames from 'classnames';
import interact from 'interact.js';
import { identity, noop } from 'lodash';
import { CommonPropTypes, PureComponent } from '../../../utils';
import { stateFromPropUpdates, updateFunc } from '../../../utils/props';

import { getDimension, getSnapTargetFunc } from './util';
import style from './slider.css';

function getOffset(direction, width) {
  if (direction === 'left') {
    return -Math.round(width / 2);
  } else if (direction === 'right') {
    return Math.round(width / 2);
  }
  return 0;
}

export default class Handle extends PureComponent {
  constructor(props) {
    super(props);
    this.state = stateFromPropUpdates(Handle.propUpdates, {}, props, {});

    this.handleRef = this.handleRef.bind(this);
  }

  componentDidMount() {
    this.bindInteract(this.props.snapTarget);
  }

  componentWillReceiveProps(newProps) {
    if (this.props.snapTarget !== newProps.snapTarget ||
        this.props.height !== newProps.height) {
      this.bindInteract(newProps.snapTarget);
    }

    this.setState(stateFromPropUpdates(Handle.propUpdates, this.props, newProps, {}));
  }

  componentWillUnmount() {
    this._interactable.unset();
  }

  bindInteract(snapTarget) {
    if (this._interactable) this._interactable.unset();
    const offset = getOffset(this.props.direction, this._handle.getBoundingClientRect().width);
    this._interactable = interact(this._handle)
      .origin('parent')
      .draggable({
        max: Infinity,
        snap: {
          targets: [getSnapTargetFunc(snapTarget, {
            range: Infinity,
            offset: { x: offset },
          })],
        },
      })
      .styleCursor(false)
      .on('dragmove', this.props.onDrag(this.props.name, -offset))
      .on('dragend', this.props.onDragEnd)
      .on('tap', (event) => { event.target.focus(); });
  }

  handleRef(ref) {
    this._handle = ref;
  }

  render() {
    return (
      <button
        type="button"
        className={classNames(style.flag, style[this.props.direction], this.props.className)}
        style={this.state.style}
        ref={this.handleRef}
        onKeyDown={this.props.onKeyDown(this.props.name)}
        onKeyUp={this.props.onKeyUp}
      >
        {this.props.labelFunc(this.props.label)}
      </button>
    );
  }
}

Handle.propTypes = {
  className: CommonPropTypes.className,
  direction: PropTypes.oneOf(['left', 'right', 'middle']),
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  labelFunc: PropTypes.func,
  name: PropTypes.string.isRequired,
  onKeyDown: PropTypes.func,
  onKeyUp: PropTypes.func,
  onDrag: PropTypes.func.isRequired,
  onDragEnd: PropTypes.func.isRequired,
  position: PropTypes.number.isRequired,
  snapTarget: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.object,
  ]).isRequired,
  style: PropTypes.object,
};

Handle.defaultProps = {
  direction: 'middle',
  label: '',
  labelFunc: identity,
  onDrag: noop,
  onDragEnd: noop,
  onKeyDown: noop,
  onKeyUp: noop,
};

Handle.propUpdates = {
  position: updateFunc(
    (nextProp, _, nextProps) => ({ style: { ...nextProps.style, left: getDimension(nextProp) } })
  ),
};
