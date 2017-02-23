import React, { PropTypes } from 'react';
import classNames from 'classnames';
import interact from 'interact.js';
import isEmpty from 'lodash/isEmpty';
import { CommonPropTypes, PureComponent } from '../../../utils';

import Ticks from './ticks';
import { getSnapTargetFunc } from './util';
import style from './slider.css';

export default class Track extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.trackRef = this.trackRef.bind(this);
  }

  componentDidMount() {
    this.bindInteract(this.props.snapTarget);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(this.handlePropUpdates(this.props, nextProps));
  }

  handlePropUpdates(prevProps, nextProps) {
    const state = {};

    if (prevProps.snapTarget !== nextProps.snapTarget) {
      this.bindInteract(nextProps.snapTarget);

      if (nextProps.ticks) {
        state.ticks = [];
        for (let x = nextProps.snapTarget.x; x < this.width; x += nextProps.snapTarget.x) {
          state.ticks.push(x);
        }
      }
    }

    return state;
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
        {this.props.children}
        {this.state.ticks && (
          <Ticks
            className={this.props.ticksClassName}
            style={this.props.ticksStyle}
            tickClassName={this.props.tickClassName}
            tickStyle={this.props.tickStyle}
            x={this.state.ticks}
          />
        )}
        <div ref={this.trackRef} className={style['track-click-target']} />
      </div>
    );
  }
}

Track.propTypes = {
  children: PropTypes.node,

  className: CommonPropTypes.className,

  onClick: PropTypes.func.isRequired,

  snapTarget: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.object,
  ]).isRequired,

  style: PropTypes.object,

  tickClassName: CommonPropTypes.className,
  tickStyle: PropTypes.object,

  /* show ticks */
  ticks: PropTypes.bool,
  ticksClassName: CommonPropTypes.className,
  ticksStyle: PropTypes.object,
};
