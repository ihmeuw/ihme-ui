import React, { PropTypes } from 'react';
import { isWithinRange } from '../../../utils/domain';
import SliderHandle from './slider-handle';

const propTypes = {
  /* linear x scale */
  xScale: PropTypes.func.isRequired,

  /* [min, max] of domain (in data space) user has selected; used to position slider handles */
  rangeExtent: PropTypes.array.isRequired,

  /* width of parent container, in px */
  width: PropTypes.number.isRequired,

  /* the height of element (path, line, rect) that the slider will sit atop, in px */
  height: PropTypes.number,

  /* y shift of entire slider, in px */
  translateY: PropTypes.number,

  /*
    float value used for implementing "zooming";
    any element that needs to become larger in "presentation mode"
    should respond to this scale factor.
    guide:
      zoom: 0 -> smallest possible
      zoom: 0.5 -> half of normal size
      zoom: 1 -> normal
      zoom: 2 -> twice normal size
  */
  zoom: PropTypes.number,

  /* top margin applied within svg document handle is placed within; used to calc origin offset */
  marginTop: PropTypes.number,

  /* left margin applied within svg document handle is placed within; used to calc origin offset */
  marginLeft: PropTypes.number,

  /* will be called with updated extent (as percentage of slider width) */
  onSliderMove: PropTypes.func
};

const defaultProps = {
  height: 15,
  zoom: 1,
  marginTop: 0,
  marginLeft: 0,
  translateY: 1,
  onSliderMove: () => { return; }
};

export default class Slider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      x1: 0,
      x2: 1
    };

    this.decoratedSliderMove = this.decoratedSliderMove.bind(this);
  }

  rectWidth(which, edgePosition, containerWidth) {
    /* eslint no-self-compare:0 */
    if (which === 'left') return (edgePosition) ? edgePosition : 0;

    // make certain both containerWidth and edgePosition are numbers
    // and not NaN (self-compare check)
    if (typeof containerWidth === 'number' && containerWidth === containerWidth
      && typeof edgePosition === 'number' && edgePosition === edgePosition) {
      const diff = containerWidth - edgePosition;
      return (diff < 0) ? 0 : diff;
    }

    return 0;
  }

  /**
   * Passed as moveHandler to individual brush handles
   * @param {Array} positionInPixelSpace
   * @param {String} which -> 'x1' or 'x2'
   */
  decoratedSliderMove(positionInPixelSpace, which) {
    const { onSliderMove, width } = this.props;
    const { x1, x2 } = this.state;

    // find position of slider handle as percent of range
    // if the slider is within tolerance of the bounds, snap to bounds
    // without snapping behavior, it is very difficult to reset the slider handles
    const tolerance = 0.005;
    let positionAsPercent = positionInPixelSpace / width;
    if (Math.abs(0 - positionAsPercent) < tolerance) positionAsPercent = 0;
    if (Math.abs(1 - positionAsPercent) < tolerance) positionAsPercent = 1;

    // prevent the slider handles from crossing
    switch (which) {
      case 'x1':
        if (positionAsPercent >= x2) positionAsPercent = x2;
        break;
      case 'x2':
        if (positionAsPercent <= x1) positionAsPercent = x1;
        break;
      default:
        break;
    }

    // if user is attempting to move slider outside of bounding domain of the data
    // don't trigger new render or fire moveHandler
    // while xScale is already clamped, this check prevents unnecessary render cycles
    if (!isWithinRange(positionAsPercent, [0, 1])) return;

    // keep internal state within this component
    this.setState({ [which]: positionAsPercent }, () => {
      const { x1: newX1, x2: newX2 } = this.state;

      // order the range extent
      const lowerExtent = Math.min(newX1, newX2);
      const upperExtent = Math.max(newX1, newX2);

      // fire action handler passed in to <ChoroplethLegend />
      // with updated range extent
      onSliderMove([lowerExtent, upperExtent]);
    });
  }

  /*
    TODO
    - moving the slider handles at the bounds of the slider is sticky
    - moving the slider handles is janky
      investigate wrapping the handles in a transition component
      that will interpolate from oldProps.position to newProps.position
   */
  render() {
    const {
      xScale,
      rangeExtent,
      width,
      height,
      translateY,
      marginTop,
      marginLeft,
      zoom
    } = this.props;
    const [minExtent, maxExtent] = rangeExtent;
    const leftEdgeinPx = xScale(minExtent);
    const rightEdgeInPx = xScale(maxExtent);

    return (
      <g transform={`translate(0, ${translateY * zoom})`}>
        <rect
          x="0px"
          height={`${height}px`}
          stroke="none"
          fill="#cccccc"
          width={this.rectWidth('left', leftEdgeinPx)}
        >
        </rect>
        <SliderHandle
          which={"x1"}
          position={leftEdgeinPx}
          label={minExtent}
          onSliderMove={this.decoratedSliderMove}
          marginTop={marginTop}
          marginLeft={marginLeft}
          height={height}
        />
        <rect
          height={`${height}px`}
          stroke="none"
          fill="#cccccc"
          x={rightEdgeInPx ? rightEdgeInPx : 0}
          width={this.rectWidth('right', rightEdgeInPx, width)}
        >
        </rect>
        <SliderHandle
          which="x2"
          position={rightEdgeInPx}
          label={maxExtent}
          onSliderMove={this.decoratedSliderMove}
          marginTop={marginTop}
          marginLeft={marginLeft}
          height={height}
        />
      </g>
    );
  }
}

Slider.propTypes = propTypes;
Slider.defaultProps = defaultProps;
