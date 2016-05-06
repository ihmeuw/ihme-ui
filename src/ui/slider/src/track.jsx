import React from 'react';

import style from './style.css';

const propTypes = {

};

const defaultProps = {

};

export default class Track extends React.Component {
  get clientRect() {
    return this.refs.track.getBoundingClientRect();
  }

  render() {
    return (
      <div ref="track" className={ style.track }></div>
    );
  }
}

Track.propTypes = propTypes;

Track.defaultProps = defaultProps;
