import React, { PropTypes } from 'react';
import { isNumber } from 'lodash';
import BrushHandle from './brush-handle';

const propTypes = {
  /* linear x scale */
  xScale: PropTypes.func.isRequired,

  /* [min, max] of domain user has selected; defaults to full domain */
  rangeExtent: PropTypes.array,

  /* width of parent container, in px */
  width: PropTypes.number,

  /*
   * will be called with two params
   * @param {Array} pixelExtent
   * @param {Array} dataExtent
   */
  onHandleMove: PropTypes.func
};

const IDENTITY_TRANSLATE = 0;
const IDENTITY_TRANFORM = `translate(${IDENTITY_TRANSLATE})`;

export default class Brush extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentX: 0,
      currentTranslate: IDENTITY_TRANSLATE,
      westTranslate: IDENTITY_TRANFORM,
      eastTranslate: IDENTITY_TRANFORM
    };

    this.selectElement = this.selectElement.bind(this);
    this.moveElement = this.moveElement.bind(this);
    this.deSelectElement = this.deSelectElement.bind(this);
  }

  rectWidth(which, edgePosition, containerWidth) {
    if (which === 'left') return (edgePosition) ? edgePosition : 0;

    if (containerWidth && edgePosition) {
      const diff = containerWidth - edgePosition;
      return (diff < 0) ? 0 : diff;
    }

    return 0;
  }

  selectElement(handle) {
    return (evt) => {
      const selectedElement = evt.target;
      const currentTranslate = selectedElement.getAttributeNS(null, 'transform')
        .slice(10, -1)
        .split(' ')
        .map((num) => { return parseFloat(num); });

      this.setState({
        selectedElement,
        currentX: evt.clientX,
        currentTranslate,
        handle
      });
    };
  }

  /**
   *
   * @param handle {String} oneOf(['west', 'east'])
   * @side-effect setState
   */
  moveElement(evt) {
    const { currentX, currentTranslate, selectedElement, handle } = this.state;
    if (!selectedElement) return;

    const dx = evt.clientX - currentX;
    if (!isNumber(dx)) return;

    let adjustedTranslate = currentTranslate.slice();
    adjustedTranslate[0] += dx;
    const newMatrix = `translate(${adjustedTranslate.join(' ')})`;

    this.setState({
      currentX: evt.clientX,
      [`${handle}Translate`]: newMatrix,
      currentTranslate: adjustedTranslate
    });
  }

  deSelectElement() {
    this.setState({
      selectedElement: null,
      currentX: 0,
      currentTranslate: IDENTITY_TRANSLATE
    });
  }

  render() {
    const { xScale, rangeExtent, width } = this.props;
    const { westTranslate, eastTranslate } = this.state;

    const leftEdge = xScale(rangeExtent[0]);
    const rightEdge = xScale(rangeExtent[1]);

    return (
      <g
        style={{ pointerEvents: 'all' }}
      >
        <rect
          style={{ pointerEvents: 'all', visibility: 'hidden' }}
          onMouseMove={this.moveElement}
          onMouseUp={this.deSelectElement}
          height="30px"
          width={width}
        >
        </rect>
        <rect
          y="10px"
          x="0px"
          height="15px"
          stroke="none"
          fill="#cccccc"
          width={this.rectWidth('left', leftEdge)}
        >
        </rect>
        <BrushHandle
          which="west"
          initialPosition={leftEdge}
          translate={westTranslate}
          brushStart={this.selectElement}
        />
        <rect
          y="10px"
          height="15px"
          stroke="none"
          fill="#cccccc"
          x={rightEdge ? (rightEdge) : 0}
          width={this.rectWidth('right', rightEdge, width)}
        >
        </rect>
        <BrushHandle
          which="east"
          initialPosition={rightEdge}
          translate={eastTranslate}
          brushStart={this.selectElement}
        />
      </g>
    );
  }
}

Brush.propTypes = propTypes;
