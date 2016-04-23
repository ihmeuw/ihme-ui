import React, { PropTypes } from 'react';
import { noop } from 'lodash';

const propTypes = {
  /* `d` attribute of <path> element */
  d: PropTypes.string.isRequired,

  /* locationId identifying this geometry */
  locationId: PropTypes.number,

  /* fill of path */
  fill: PropTypes.string,

  /* whether or not this geometry is selected */
  selected: PropTypes.bool,

  /* partially applied fn that takes in datum and returns fn */
  clickHandler: PropTypes.func,

  /* partially applied fn that takes in datum and returns fn */
  hoverHandler: PropTypes.func
};

const defaultProps = {
  fill: '#4682b4',
  selected: false,
  clickHandler() { return noop; },
  hoverHandler() { return noop; }
};

export default class Path extends React.Component {
  constructor(props) {
    const { clickHandler, hoverHandler, locationId } = props;

    super(props);
    this.state = {
      onClick: clickHandler(locationId),
      onMouseMove: hoverHandler(locationId)
    };
  }

  render() {
    const { d, fill, selected } = this.props;
    const { onClick, onMouseMove } = this.state;

    return (
      <path
        d={d}
        style={{
          fill,
          strokeWidth: selected ? '2px' : '1px',
          stroke: '#000'
        }}
        onClick={onClick}
        onMouseMove={onMouseMove}
      >
      </path>
    );
  }
}

Path.propTypes = propTypes;
Path.defaultProps = defaultProps;
