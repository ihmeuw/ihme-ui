import React, { PropTypes } from 'react';
import { noop, bindAll } from 'lodash';

export default class Path extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      path: props.pathGenerator(props.feature)
    };

    bindAll(this, [
      'onClick',
      'onMouseDown',
      'onMouseMove',
      'onMouseOver'
    ]);
  }

  componentWillReceiveProps(newProps) {
    const featureHasChanged = newProps.feature !== this.props.feature;
    const projectionHasChanged = newProps.pathGenerator !== this.props.pathGenerator;

    if (projectionHasChanged || featureHasChanged) {
      this.setState({
        path: newProps.pathGenerator(newProps.feature)
      });
    }
  }

  onClick(e) {
    e.preventDefault();

    // if being dragged, don't fire onClick
    if (this.dragging) return;

    this.props.onClick(e, this.props.locationId);
  }

  onMouseDown(e) {
    e.preventDefault();

    // clear mouseMove flag
    this.dragging = false;
    this.props.onMouseDown(e, this.props.locationId);
  }

  onMouseMove(e) {
    e.preventDefault();

    // set flag to prevent onClick handler from firing when map is being dragged
    this.dragging = true;
    this.props.onMouseMove(e, this.props.locationId);
  }

  onMouseOut(e) {
    e.preventDefault();

    this.props.onMouseOut(e, this.props.locationId);
  }

  onMouseOver(e) {
    e.preventDefault();

    this.props.onMouseOver(e, this.props.locationId);
  }

  render() {
    const { fill, selected, style, selectedStyle, className, selectedClassName } = this.props;
    const { path } = this.state;

    return (
      <path
        d={path}
        className={selected ? selectedClassName : className}
        style={selected ? { fill, ...selectedStyle } : { fill, ...style }}
        onClick={this.onClick}
        onMouseDown={this.onMouseDown}
        onMouseMove={this.onMouseMove}
        onMouseOver={this.onMouseOver}
      >
      </path>
    );
  }
}

Path.propTypes = {
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
  onMouseOut: PropTypes.func,

  /* classname and style to apply to unselected path */
  className: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  style: PropTypes.object,

  /* classname and style to apply to selected path */
  selectedClassName: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  selectedStyle: PropTypes.object,
};

Path.defaultProps = {
  selected: false,
  style: {
    strokeWidth: '1px',
    stroke: '#000',
  },
  selectedStyle: {
    strokeWidth: '2px',
    stroke: '#000',
  },
  onClick() { return noop; },
  onMouseOver() { return noop; },
  onMouseMove() { return noop; },
  onMouseDown() { return noop; },
  onMouseOut() { return noop; },
};
