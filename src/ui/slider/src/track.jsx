import React, { PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import interact from 'interact.js';
import isEmpty from 'lodash/isEmpty';

import { getSnapTargetFunc } from './util';
import style from './style.css';

export default class Track extends React.Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.trackRef = this.trackRef.bind(this);
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

  get width() {
    return this._track.clientWidth;
  }

  bindInteract(snapTarget) {
    if (isEmpty(snapTarget)) return;

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
      <div className={style.track}>
        <div ref={this.trackRef} className={style['track-click-target']}></div>
        {this.props.children}
      </div>
    );
  }
}

Track.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func.isRequired,
  snapTarget: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.object,
  ]).isRequired,
};
