import React, { PropTypes } from 'react';
import classNames from 'classnames';
import interact from 'interact.js';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import { CommonPropTypes, PureComponent } from '../../../utils';

import { getSnapTargetFunc } from './util';
import style from './style.css';

export default class Track extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.trackRef = this.trackRef.bind(this);
  }

  componentWillReceiveProps(newProps) {
    const state = {};

    if (this.props.snapTarget !== newProps.snapTarget) {
      this.bindInteract(newProps.snapTarget);

      if (newProps.ticks) {
        state.ticks = [];
        for (let x = newProps.snapTarget.x; x < this.width; x += newProps.snapTarget.x) {
          state.ticks.push(x);
        }
      }
    }

    this.setState(state);
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

  renderTicks() {
    if (!this.state.ticks) return null;

    return (
      <svg className={style['track-tick']} width="100%" height="100%">
        {
          map(this.state.ticks, (x) => {
            return (
              <g key={x}>
                <line x1={x} x2={x} y1="0%" y2="100%" stroke="black" />
              </g>
            );
          })
        }
      </svg>
    );
  }

  render() {
    return (
      <div className={classNames(style.track, this.props.className)} style={this.props.style}>
        <div ref={this.trackRef} className={style['track-click-target']}></div>
        {this.props.children}
        {this.renderTicks()}
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
  ticks: PropTypes.bool,
};
