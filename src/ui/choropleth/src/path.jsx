import React, { PropTypes } from 'react';
import { noop, bindAll } from 'lodash';

const propTypes = {
  /* a GeoJSON feature or geometry object; see https://github.com/d3/d3/wiki/Geo-Paths#_path */
  feature: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object
  ]).isRequired,

  /* a function which accepts a `feature` and returns a valid `d` attribute */
  pathGenerator: PropTypes.func.isRequired,

  /* locationId identifying this geometry */
  locationId: PropTypes.number,

  /* fill of path */
  fill: PropTypes.string,

  /* whether or not this geometry is selected */
  selected: PropTypes.bool,

  /* signature: function(locationId, event) {...} */
  onClick: PropTypes.func,

  /* signature: function(locationId, event) {...} */
  onMouseOver: PropTypes.func,

  /* signature: function(locationId, event) {...} */
  onMouseMove: PropTypes.func,

  /* signature: function(locationId, event) {...} */
  onMouseDown: PropTypes.func,

  /* signature: function(locationId, event) {...} */
  onMouseOut: PropTypes.func
};

const defaultProps = {
  fill: '#4682b4',
  selected: false,
  onClick() { return noop; },
  onMouseOver() { return noop; },
  onMouseMove() { return noop; },
  onMouseDown() { return noop; },
  onMouseOut() { return noop; }
};

export default class Path extends React.Component {
  constructor(props) {
    super(props);

    bindAll(this, [
      'onClick',
      'onMouseDown',
      'onMouseMove',
      'onMouseOver'
    ]);
  }

  onClick(e) {
    e.preventDefault();

    // if being dragged, don't fire onClick
    if (this.dragging) return;

    this.props.onClick(this.props.locationId, e);
  }

  onMouseDown(e) {
    e.preventDefault();

    // clear mouseMove flag
    this.dragging = false;
    this.props.onMouseDown(this.props.locationId, e);
  }

  onMouseMove(e) {
    e.preventDefault();

    // set flag to prevent onClick handler from firing when map is being dragged
    this.dragging = true;
    this.props.onMouseMove(this.props.locationId, e);
  }

  onMouseOut(e) {
    e.preventDefault();

    this.props.onMouseOut(this.props.locationId, e);
  }

  onMouseOver(e) {
    e.preventDefault();

    this.props.onMouseOver(this.props.locationId, e);
  }

  render() {
    const { feature, pathGenerator, fill, selected } = this.props;

    return (
      <path
        d={pathGenerator(feature)}
        style={{
          fill,
          strokeWidth: selected ? '2px' : '1px',
          stroke: '#000'
        }}
        onClick={this.onClick}
        onMouseDown={this.onMouseDown}
        onMouseMove={this.onMouseMove}
        onMouseOver={this.onMouseOver}
      >
      </path>
    );
  }
}

Path.propTypes = propTypes;
Path.defaultProps = defaultProps;
