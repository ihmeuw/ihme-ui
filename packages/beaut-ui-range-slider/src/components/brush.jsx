import React, { PropTypes } from 'react';

const propTypes = {
  xScale: PropTypes.func.isRequired, // linear x scale
  rangeExtent: PropTypes.array, // [min, max] of domain user has selected; defaults to full domain
  width: PropTypes.number
};

export default class Brush extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      grabPoint: {
        x1: 0,
        x2: 0
      },
      position: {
        x1: 0,
        x2: 0
      }
    };

    // bind event handlers to current context (once!)
    this.grab = this.grab.bind(this);
    this.drag = this.drag.bind(this);
    this.drop = this.drop.bind(this);
  }

  componentWillMount() {
    const { xScale, rangeExtent } = this.props;

    this.setState({
      position: {
        x1: xScale(rangeExtent[0]),
        x2: xScale(rangeExtent[1])
      }
    });
  }

  rectWidth(which, edgePosition, containerWidth) {
    if (which === 'left') return (edgePosition) ? edgePosition : 0;

    if (containerWidth && edgePosition) {
      const diff = containerWidth - edgePosition;
      return (diff < 0) ? 0 : diff;
    }

    return 0;
  }

  grab(e) {
    const target = e.currentTarget;

    this.setState({
      grabPoint: {
        [target.id]: e.clientX
      },
      currentTarget: target.id
    });
  }

  drag(e) {
    const { currentTarget } = this.state;

    if (!currentTarget) return;

    this.setState({
      position: {
        [currentTarget]: e.clientX - e.currentTarget.getCTM().e
      }
    });
  }

  drop() {
    this.setState({
      currentTarget: null
    });
  }


  render() {
    const { xScale, rangeExtent, width } = this.props;
    const { position } = this.state;

    const leftEdge = xScale(rangeExtent[0]);
    const rightEdge = xScale(rangeExtent[1]);

    return (
      <g>
        <rect
          y="10px"
          x="0px"
          height="15px"
          stroke="none"
          fill="#cccccc"
          width={this.rectWidth('left', leftEdge)}
        >
        </rect>
        <rect
          id="x1"
          y="8px"
          x={`${position.x1}px`}
          height="17px"
          stroke="none"
          fill="#000"
          width="5px"
          onMouseDown={this.grab}
          onMouseUp={this.drop}
        >
        </rect>
        <rect
          y="10px"
          height="15px"
          stroke="none"
          fill="#cccccc"
          x={rightEdge ? (rightEdge) : 0}
          width={this.rectWidth('right', rightEdge, width)}
        >
        </rect>
        <rect
          id="x2"
          y="8px"
          x={`${position.x2}px`}
          height="17px"
          stroke="none"
          fill="#000"
          width="5px"
          onMouseDown={this.grab}
          onMouseUp={this.drop}
        >
        </rect>
      </g>
    );
  }
}

Brush.propTypes = propTypes;
