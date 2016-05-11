import React, { PropTypes }from 'react';
import interact from 'interact.js';

import { getSnapTargetFunc } from './util';

import style from './style.css';

const propTypes = {
  onClick: PropTypes.func.isRequired,
  snapTarget: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.object
  ]).isRequired
};

export default class Track extends React.Component {
  constructor(props) {
    super(props);

    this.bindInteract = this.bindInteract.bind(this);
  }

  bindInteract(ref) {
    if (!ref) {
      this._interactable.unset();
      return;
    }

    const snapTarget = getSnapTargetFunc(this.props.snapTarget);

    this._interactable = interact(ref)
      .styleCursor(false)
      .on('tap', (event) => {
        const newEvent = {
          ...event,
          snap: snapTarget(event.layerX)
        };
        this.props.onClick(newEvent);
      });
  }

  render() {
    return (
      <div ref={ this.bindInteract } className={ style.track }></div>
    );
  }
}

Track.propTypes = propTypes;
