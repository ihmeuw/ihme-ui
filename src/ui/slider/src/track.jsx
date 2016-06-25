import React, { PropTypes } from 'react';
import classNames from 'classnames';
import interact from 'interact.js';
import isEmpty from 'lodash/isEmpty';
import { CommonPropTypes, PureComponent } from '../../../utils';

import { getSnapTargetFunc } from './util';
import style from './style.css';

export default class Track extends PureComponent {
  constructor(props) {
    super(props);
    this.trackRef = this.trackRef.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (this.props.snapTarget !== newProps.snapTarget) {
      this.bindInteract(newProps.snapTarget);
    }
  }

  componentWillUnmount() {
    this._interactable.unset();
  }

  get width() {
    return this._track.clientWidth;
  }

  bindInteract(snapTarget) {
    if (isEmpty(snapTarget)) return;

    if (this._interactable) this._interactable.unset();
    const snapTargetFunc = getSnapTargetFunc(snapTarget);
    this._interactable = interact(this._track)
      .origin('self')
      .styleCursor(false)
      .on('tap', (event) => {
        const newEvent = {
          ...event,
          snap: snapTargetFunc(event.layerX),
        };
        this.props.onClick(newEvent);
      });
  }

  trackRef(ref) {
    this._track = ref;
  }

  render() {
    return (
      <div className={classNames(style.track, this.props.className)} style={this.props.style}>
        <div ref={this.trackRef} className={style['track-click-target']}></div>
        {this.props.children}
      </div>
    );
  }
}

Track.propTypes = {
  className: CommonPropTypes.className,
  style: PropTypes.object,
  children: PropTypes.node,
  onClick: PropTypes.func.isRequired,
  snapTarget: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.object,
  ]).isRequired,
};
