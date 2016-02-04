import React, { PropTypes } from 'react';
import Label from './label';

const propTypes = {
  xScale: PropTypes.func.isRequired, // linear x scale
  rangeExtent: PropTypes.array // [min, max] of domain user has selected; defaults to full domain
};

const defaultProps = {

};

export default class Brush extends React.Component {
  rectWidth (which, edgePosition, containerWidth) {
    if (which === 'left') {
      return (edgePosition) ? edgePosition : 0;
    } else {
      if (containerWidth && edgePosition) {
        var diff = containerWidth - edgePosition;
        return (diff < 0) ? 0 : diff;
      } else {
        return 0;
      }
    }
  }

  render () {
    const { xScale } = this.props;

    return (
      <g>
        <rect
          y='10px'
          x='0px'
          height='15px'
          stroke='none'
          fill='#cccccc'
          width={this.rectWidth('left', sliderLeftEdge)}>
        </rect>
        <Label
          anchor='start'
          position={{
            x:
            y: 22,
            shift: 8
          }}
        />
        <rect
          y='10px'
          height='15px'
          stroke='none'
          fill='#cccccc'
          x={sliderRightEdge ? (sliderRightEdge) : 0}
          width={this.rectWidth('right', sliderRightEdge, width)}>
        </rect>
        <Label
          anchor='end'
          position={{
            x:
            y: 22,
            shift: 8
          }}
        />
      <g>
    );
  }
};

Brush.propTypes = propTypes;

Brush.defaultProps = defaultProps;
