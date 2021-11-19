import React from 'react';
import PropTypes from 'prop-types';
import isFinite from 'lodash/isFinite';
import noop from 'lodash/noop';
import { isWithinRange, percentOfRange } from '../../../../utils';
import SliderHandle from './slider-handle';

/**
 * if the slider handle is being moved towards 0 (positionChange < 0)
 * or towards 1 (positionChange > 0)
 * and if the slider is within tolerance of the bounds, snap to bounds
 * without snapping behavior, it is very difficult to reset the slider handles
 * @param {number} tolerance - tolerance within which to snap to bounds
 * @param positionAsPercent - position of slider handle, as percent of track
 * @param positionChange - delta in handle move
 * @return {number}
 */
function maybeSnapToBounds(tolerance, positionAsPercent, positionChange) {
  if (positionChange < 0 && Math.abs(0 - positionAsPercent) < tolerance) return 0;
  if (positionChange > 0 && Math.abs(1 - positionAsPercent) < tolerance) return 1;
  return positionAsPercent;
}

export default class Slider extends React.Component {
  constructor(props) {
    super(props);

    this.decoratedSliderMove = this.decoratedSliderMove.bind(this);
    this.keyboardSliderMove = this.keyboardSliderMove.bind(this);
  }

  rectWidth(whichSliderHandle, edgePosition, containerWidth) {
    /* eslint no-self-compare:0 */
    if (whichSliderHandle === 'left') return edgePosition || 0;

    // make certain both containerWidth and edgePosition are numbers
    // and not NaN (self-compare check)
    if (typeof containerWidth === 'number' && containerWidth === containerWidth
      && typeof edgePosition === 'number' && edgePosition === edgePosition) {
      const diff = containerWidth - edgePosition;
      return (diff < 0) ? 0 : diff;
    }

    return 0;
  }

  keyboardSliderMove(keyPressed, whichSliderHandle) {
    const {
      domain,
      onSliderMove,
      rangeExtent: [minExtent, maxExtent],
      width,
    } = this.props;

    let lowerExtent = percentOfRange(minExtent, domain);
    let upperExtent = percentOfRange(maxExtent, domain);
    // Page up/down increments/decrements by 10%, arrow keys increment/decrement by 1%.
    const changeAmount = (keyPressed === 'PageUp' || keyPressed === 'PageDown') ? 10 : 1;
    const percentChange = changeAmount / width;
    
    // Left slider was changed. Adjust lower domain.
    if (whichSliderHandle === 'x1') {
      // Right/Up Arrow and Page Up keys increment.
      if (keyPressed === 'ArrowRight' || keyPressed === 'ArrowUp' || keyPressed === 'PageUp') {
        let newLower = lowerExtent + percentChange;
        // prevent the slider handles from crossing
        if (newLower > upperExtent) newLower = upperExtent;
        lowerExtent = newLower;
      }
      // Left/Down Arrow and Page Down keys decrement.
      if (keyPressed === 'ArrowLeft' || keyPressed === 'ArrowDown' || keyPressed === 'PageDown') {
        let newLower = lowerExtent - percentChange;
        // prevent the slider handles from crossing
        if (newLower > upperExtent) newLower = upperExtent;
        lowerExtent = newLower;
      }
    }

    // Right slider was changed. Adjust upper domain.
    if (whichSliderHandle === 'x2') {
      // Right/Up Arrow and Page Up keys increment.
      if (keyPressed === 'ArrowRight' || keyPressed === 'ArrowUp' || keyPressed === 'PageUp') {
        let newUpper = upperExtent + percentChange;
        // prevent the slider handles from crossing
        if (newUpper < lowerExtent) newUpper = lowerExtent;
        upperExtent = newUpper;
      }
      // Left/Down Arrow and Page Down keys decrement.
      if (keyPressed === 'ArrowLeft' || keyPressed === 'ArrowDown' || keyPressed === 'PageDown') {
        let newUpper = upperExtent - percentChange;
        // prevent the slider handles from crossing
        if (newUpper < lowerExtent) newUpper = lowerExtent;
        upperExtent = newUpper;
      }
    }

    // if user is attempting to move slider outside of bounding domain of the data
    // don't trigger new render or fire moveHandler
    // while xScale is already clamped, this check prevents unnecessary render cycles
    if (!isWithinRange(lowerExtent, [0, 1]) || !isWithinRange(upperExtent, [0, 1])) return;

    // fire action handler passed in to <ChoroplethLegend />
    // with updated range extent
    onSliderMove([lowerExtent, upperExtent]);
  }

  /**
   * Passed as moveHandler to individual brush handles
   * @param {Number} positionChange -> num pixels the handle has been dragged
   * @param {String} whichSliderHandle -> 'x1' or 'x2'
   */
  decoratedSliderMove(positionChange, whichSliderHandle) {
    const {
      domain,
      onSliderMove,
      rangeExtent: [minExtent, maxExtent],
      width,
    } = this.props;

    let lowerExtent = percentOfRange(minExtent, domain);
    let upperExtent = percentOfRange(maxExtent, domain);
    let positionAsPercent;
    const percentChange = positionChange / width;
    const tolerance = 0.005;

    switch (whichSliderHandle) {
      case 'x1':
        positionAsPercent = maybeSnapToBounds(
          tolerance,
          lowerExtent + percentChange,
          percentChange
        );

        // prevent the slider handles from crossing
        if (positionAsPercent > upperExtent) positionAsPercent = upperExtent;
        lowerExtent = positionAsPercent;
        break;
      case 'x2':
        positionAsPercent = maybeSnapToBounds(
          tolerance,
          upperExtent + percentChange,
          percentChange
        );

        // prevent the slider handles from crossing
        if (positionAsPercent < lowerExtent) positionAsPercent = lowerExtent;
        upperExtent = positionAsPercent;
        break;
      default:
        break;
    }

    // if user is attempting to move slider outside of bounding domain of the data
    // don't trigger new render or fire moveHandler
    // while xScale is already clamped, this check prevents unnecessary render cycles
    if (!isFinite(positionAsPercent) || !isWithinRange(positionAsPercent, [0, 1])) return;

    // fire action handler passed in to <ChoroplethLegend />
    // with updated range extent
    onSliderMove([lowerExtent, upperExtent]);
  }

  render() {
    const {
      domain,
      xScale,
      rangeExtent,
      width,
      height,
      translateY,
      labelFormat,
      marginTop,
      marginLeft,
      zoom
    } = this.props;
    const [minExtent, maxExtent] = rangeExtent;
    const [minDomain, maxDomain] = domain;
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
          ariaLabel="Change the minimum value displayed on the map."
          whichSliderHandle={'x1'}
          position={leftEdgeinPx}
          label={minExtent}
          labelFormat={labelFormat}
          onSliderMove={this.decoratedSliderMove}
          onSliderKeyboardMove={this.keyboardSliderMove}
          marginTop={marginTop}
          marginLeft={marginLeft}
          minValue={minDomain}
          height={height}
        />
        <rect
          height={`${height}px`}
          stroke="none"
          fill="#cccccc"
          x={rightEdgeInPx || 0}
          width={this.rectWidth('right', rightEdgeInPx, width)}
        >
        </rect>
        <SliderHandle
          ariaLabel="Change the maximum value displayed on the map."
          whichSliderHandle="x2"
          position={rightEdgeInPx}
          label={maxExtent}
          labelFormat={labelFormat}
          onSliderMove={this.decoratedSliderMove}
          onSliderKeyboardMove={this.keyboardSliderMove}
          marginTop={marginTop}
          marginLeft={marginLeft}
          maxValue={maxDomain}
          height={height}
        />
      </g>
    );
  }
}

Slider.propTypes = {
  domain: PropTypes.array.isRequired,

  /* the height of element (path, line, rect) that the slider will sit atop, in px */
  height: PropTypes.number,

  /* label format function; given props.label as argument; defaults to identity function */
  labelFormat: PropTypes.func,

  /* left margin applied within svg document handle is placed within; used to calc origin offset */
  marginLeft: PropTypes.number,

  /* top margin applied within svg document handle is placed within; used to calc origin offset */
  marginTop: PropTypes.number,

  /* will be called with updated extent (as percentage of slider width) */
  onSliderMove: PropTypes.func,

  /* will be called when keyboard is used to change slider handles */
  onSliderKeyboardMove: PropTypes.func,

  /* [min, max] of domain (in data space) user has selected; used to position slider handles */
  rangeExtent: PropTypes.array.isRequired,

  /* y shift of entire slider, in px */
  translateY: PropTypes.number,

  /* width of parent container, in px */
  width: PropTypes.number.isRequired,

  /* linear x scale */
  xScale: PropTypes.func.isRequired,

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
};

Slider.defaultProps = {
  height: 15,
  zoom: 1,
  marginTop: 0,
  marginLeft: 0,
  translateY: 1,
  onSliderMove: noop,
  onSliderKeyboardMove: noop,
};
