import React, { PropTypes } from 'react';
import classNames from 'classnames';

import style from './brush-handle.css';

const propTypes = {
  /* initial position of handle along x-axis (in pixel space) */
  initialPosition: PropTypes.number,

  which: PropTypes.oneOf(['east', 'west']),

  setParentState: PropTypes.func,

  brushStart: PropTypes.func,

  brushOut: PropTypes.func,

  /* translate transform, e.g. ('transform(0)') */
  translate: PropTypes.string
};

export default class BrushHandle extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentWillMount() {
    const { which, brushStart } = this.props;
    this.setState({
      partiallyAppliedBrushStart: brushStart(which)
    });
  }

  render() {
    const { initialPosition, translate } = this.props;
    const { partiallyAppliedBrushStart } = this.state;
    return (
      <rect
        className={classNames(style.handle)}
        y="8px"
        x={`${initialPosition}px`}
        height="17px"
        stroke="none"
        fill="#000"
        width="5px"
        transform={translate}
        onMouseDown={partiallyAppliedBrushStart}
      >
      </rect>
    );
  }
}

BrushHandle.propTypes = propTypes;
